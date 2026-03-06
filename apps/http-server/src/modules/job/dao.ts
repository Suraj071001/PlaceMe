import client from "@repo/db/index";
import type { CreateJobPayload, UpdateJobPayload } from "@repo/zod";
import redisClient from "@repo/redis-config/redisClient";
import { STREAM_ID as JOB_STREAM_ID } from "@repo/redis-config/STREAM";

export const createJob = async (data: CreateJobPayload) => {
  const { batchIds, ...jobData } = data;

  return await client.$transaction(async (tx) => {
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
      },
    });

    await redisClient.xAdd(
      JOB_STREAM_ID,
      "*",
      {
        role: job.role,
        companyId: job.companyId,
        title: job.title,
        slug: job.slug as string,
        description: job.description as string,
        location: job.location as string,
        departmentId: job.departmentId as string,
        employmentType: job.employmentType,
        closeAt: JSON.stringify(job.closeAt),
        jobId: job.id,
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

export const getJobs = async (
  skip: number,
  take: number,
  filters: any = {},
) => {
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
