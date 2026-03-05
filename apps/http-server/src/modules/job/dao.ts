import client from "@repo/db/index";
import type { CreateJobPayload, UpdateJobPayload } from "@repo/zod";

export const createJob = async (data: CreateJobPayload) => {
    return await client.job.create({
        data,
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
