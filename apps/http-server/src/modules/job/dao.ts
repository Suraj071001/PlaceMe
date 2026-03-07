import client from "@repo/db/index";
import type { CreateJobPayload, UpdateJobPayload } from "@repo/zod";
import redisClient from "@repo/redis-config/redisClient";
import { STREAM_ID as JOB_STREAM_ID } from "@repo/redis-config/STREAM";

export const createJob = async (data: CreateJobPayload) => {
  const { batchIds, applicationForm, ...jobData } = data;

  return await client.$transaction(async (tx) => {
    let resolvedBatchIds = batchIds ?? [];

    // If Google Chat notifications are enabled and caller did not pass explicit batches,
    // auto-target all batches with active Google Chat configuration.
    if ((jobData.google_chat || jobData.email) && resolvedBatchIds.length === 0) {
      const configuredBatches = await tx.batch.findMany({
        where: {
          ...(jobData.departmentId
            ? {
              branch: {
                departmentId: jobData.departmentId,
              },
            }
            : {}),
          ...(jobData.google_chat
            ? {
              googleChatConfigs: {
                is: {
                  isActive: true,
                },
              },
            }
            : {}),
        },
        select: { id: true },
      });
      resolvedBatchIds = configuredBatches.map((b) => b.id);
    }

    // Determine the application form connection/creation payload
    let applicationFormsPayload = {};

    if (applicationForm) {
      applicationFormsPayload = {
        applicationForms: {
          create: {
            title: applicationForm.title,
            isDefault: false,
            // Fallback to a department ID from the job if possible, or any department for now. Prisma schema requires departmentId for ApplicationForm.
            // Actually, we must fetch a department to link. Let's use jobData.departmentId or finding a random one.
            department: jobData.departmentId
              ? { connect: { id: jobData.departmentId } }
              : { connect: { id: (await tx.department.findFirst())?.id } },
            sections: {
              create: applicationForm.sections?.map((section) => ({
                title: section.title,
                order: section.order,
                description: section.description,
                questions: {
                  create: section.questions?.map((q) => ({
                    label: q.label,
                    type: q.type,
                    order: q.order,
                    required: q.required,
                    isPrivate: q.isPrivate,
                    description: q.description,
                    systemNote: q.systemNote,
                    options: {
                      create: q.options?.map((opt) => ({
                        label: opt.label,
                        value: opt.value,
                      })),
                    },
                  })),
                },
              })),
            },
          },
        },
      };
    }

    const job = await tx.job.create({
      data: {
        ...jobData,
        ...(resolvedBatchIds.length > 0
          ? {
              batches: {
                connect: resolvedBatchIds.map((id) => ({ id })),
              },
            }
          : {}),
        ...applicationFormsPayload,
      },
    });

    await tx.activity.create({
      data: {
        companyId: job.companyId,
        type: "JOB_CREATED",
        body: `${job.title} created`,
        metadata: {
          jobId: job.id,
          role: job.role,
          departmentId: job.departmentId ?? null,
          batchIds: resolvedBatchIds,
        },
      },
    });

    await tx.auditLog.create({
      data: {
        companyId: job.companyId,
        action: "JOB_CREATED",
        meta: {
          jobId: job.id,
          title: job.title,
          role: job.role,
          batchIds: resolvedBatchIds,
        },
      },
    });

    await redisClient.xAdd(
      JOB_STREAM_ID,
      "*",
      {
        role: String(job.role),
        companyId: String(job.companyId),
        title: String(job.title),
        slug: job.slug ?? "",
        description: job.description ?? "",
        location: job.location ?? "",
        departmentId: job.departmentId ?? "",
        employmentType: String(job.employmentType),
        closeAt: job.closeAt ? job.closeAt.toISOString() : "",
        jobId: String(job.id),
        batchIds: JSON.stringify(resolvedBatchIds),
        google_chat: String(Boolean(job.google_chat)),
        email: String(Boolean(job.email)),
      },
      {
        TRIM: {
          strategy: "MAXLEN",
          threshold: 1000,
          strategyModifier: "~",
        },
      },
    );

    return job;
  });
};

export const getJobById = async (id: string) => {
  return await client.job.findFirst({
    where: { id },
    include: { company: true, department: true },
  });
};

export const getJobs = async (skip: number, take: number, filters: any = {}) => {
  const where: any = {};

  if (filters.companyId) {
    where.companyId = filters.companyId;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.employmentType) {
    where.employmentType = filters.employmentType;
  }
  if (filters.role) {
    where.role = { contains: filters.role, mode: "insensitive" };
  }
  if (filters.tier) {
    where.tier = filters.tier;
  }
  if (filters.workMode) {
    where.workMode = filters.workMode;
  }

  const [data, total] = await Promise.all([
    client.job.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { company: true },
      skip,
      take,
    }),
    client.job.count({ where }),
  ]);

  return { data, total };
};

export const getJobsByCompanyId = async (companyId: string) => {
  return await client.job.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });
};

export const updateJob = async (id: string, data: UpdateJobPayload) => {
  return await client.$transaction(async (tx) => {
    const updated = await tx.job.update({
      where: { id },
      data,
    });

    await tx.activity.create({
      data: {
        companyId: updated.companyId,
        type: "JOB_UPDATED",
        body: `${updated.title} updated`,
        metadata: {
          jobId: updated.id,
          updatedFields: Object.keys(data),
        },
      },
    });

    await tx.auditLog.create({
      data: {
        companyId: updated.companyId,
        action: "JOB_UPDATED",
        meta: {
          jobId: updated.id,
          title: updated.title,
          updatedFields: Object.keys(data),
        },
      },
    });

    return updated;
  });
};

export const deleteJob = async (id: string) => {
  return await client.$transaction(async (tx) => {
    const existing = await tx.job.findUnique({
      where: { id },
      select: { id: true, title: true, companyId: true },
    });

    const deleted = await tx.job.delete({
      where: { id },
    });

    if (existing) {
      await tx.activity.create({
        data: {
          companyId: existing.companyId,
          type: "JOB_DELETED",
          body: `${existing.title} deleted`,
          metadata: {
            jobId: existing.id,
          },
        },
      });

      await tx.auditLog.create({
        data: {
          companyId: existing.companyId,
          action: "JOB_DELETED",
          meta: {
            jobId: existing.id,
            title: existing.title,
          },
        },
      });
    }

    return deleted;
  });
};

export const getJobEligibilityData = async () => {
  return await client.department.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      branches: {
        select: {
          id: true,
          name: true,
          batches: {
            select: {
              id: true,
              name: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};
