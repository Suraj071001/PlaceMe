import client from "@repo/db/index";
import { ApplicationStatus } from "@repo/db";
import type { StudentApplicationQuery } from "@repo/zod";

export const createApplication = async (studentId: string, jobId: string, requiresForm: boolean) => {
  return await client.application.create({
    data: {
      studentId,
      jobId,
      status: requiresForm ? ApplicationStatus.DRAFT : ApplicationStatus.APPLIED,
    },
  });
};

export const linkApplicationToPipeline = async (applicationId: string, jobId: string) => {
  // 1. Get the job to find the company pipeline
  const job = await client.job.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new Error("Job not found");

  // 2. Find the pipeline for the company
  const pipeline = await client.pipeline.findFirst({
    where: { companyId: job.companyId },
    include: {
      stages: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
    },
  });

  if (pipeline && pipeline.stages.length > 0) {
    // Update application to link it to the first stage
    return await client.application.update({
      where: { id: applicationId },
      data: {
        pipelineId: pipeline.id,
        stageId: pipeline.stages[0]!.id,
      },
    });
  }

  return null;
};

export const getApplicationById = async (id: string) => {
  return await client.application.findUnique({
    where: { id },
    include: {
      job: true,
      formResponse: true,
      pipeline: true,
      stage: true,
    },
  });
};

const mapTierFilter = (tier?: string) => {
  if (!tier) return undefined;
  if (tier === "Dream") return "DREAM";
  if (tier === "Tier 1") return "STANDARD";
  if (tier === "Tier 2") return "BASIC";
  return tier;
};

const mapEmploymentTypeFilter = (jobType?: string) => {
  if (!jobType) return undefined;
  if (jobType === "Full-time") return "FULL_TIME";
  if (jobType === "Internship") return "INTERNSHIP";
  return jobType;
};

export const getStudentApplications = async (studentId: string, filters: StudentApplicationQuery) => {
  const jobType = mapEmploymentTypeFilter(filters.jobType);
  const tier = mapTierFilter(filters.tier);

  return await client.application.findMany({
    where: {
      studentId,
      deletedAt: null,
      job: {
        ...(filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                { role: { contains: filters.search, mode: "insensitive" } },
                { company: { name: { contains: filters.search, mode: "insensitive" } } },
              ],
            }
          : {}),
        ...(filters.location ? { location: { contains: filters.location, mode: "insensitive" } } : {}),
        ...(jobType ? { employmentType: jobType as any } : {}),
        ...(tier ? { tier: tier as any } : {}),
      },
    },
    include: {
      job: {
        include: {
          company: {
            select: {
              name: true,
            },
          },
        },
      },
      stage: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getJobWithApplicationForm = async (jobId: string) => {
    return await client.job.findUnique({
        where: { id: jobId },
        include: {
            company: true,
            applicationForms: {
                include: {
                    sections: {
                        orderBy: { order: "asc" },
                        include: {
                            questions: {
                                orderBy: { order: "asc" },
                                include: {
                                    options: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
};
