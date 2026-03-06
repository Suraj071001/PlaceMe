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
        locationId: job.locationId as string,
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
    include: { company: true, department: true, location: true },
  });
};

export const getJobs = async () => {
  return await client.job.findMany({
    orderBy: { createdAt: "desc" },
    include: { company: true },
  });
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
