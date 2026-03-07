import client from "@repo/db/index";
import { ApplicationStatus } from "@repo/db";

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
                orderBy: { sortOrder: 'asc' },
                take: 1
            }
        }
    });

    if (pipeline && pipeline.stages.length > 0) {
        // Update application to link it to the first stage
        return await client.application.update({
            where: { id: applicationId },
            data: {
                pipelineId: pipeline.id,
                stageId: pipeline.stages[0]!.id
            }
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
            stage: true
        }
    });
};

export const getStudentApplications = async (studentId: string) => {
    return await client.application.findMany({
        where: { studentId },
        include: {
            job: true,
            stage: true
        },
        orderBy: { createdAt: 'desc' }
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
