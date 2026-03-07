import client from "@repo/db/index";
import type { CreateJobPayload, UpdateJobPayload } from "@repo/zod";
import redisClient from "@repo/redis-config/redisClient";
import { STREAM_ID as JOB_STREAM_ID } from "@repo/redis-config/STREAM";

export const createJob = async (data: CreateJobPayload) => {
  const { batchIds, applicationForm, ...jobData } = data;

  return await client.$transaction(async (tx) => {
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
        ...(batchIds && batchIds.length > 0
          ? {
              batches: {
                connect: batchIds.map((id) => ({ id })),
              },
            }
          : {}),
        ...applicationFormsPayload,
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
  return await client.job.update({
    where: { id },
    data,
  });
};

export const deleteJob = async (id: string) => {
  return await client.job.delete({
    where: { id },
  });
};
