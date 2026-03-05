import {
    createJob,
    getJobs,
    getJobById,
    updateJob,
    deleteJob,
    getJobsByCompanyId,
} from "./dao";
import type { CreateJobPayload, UpdateJobPayload } from "@repo/zod";
import logger from "../../utils/logger";

export const createJobService = async (payload: CreateJobPayload) => {
    logger.info("JOB_CREATE_START", { title: payload.title });

    const job = await createJob(payload);
    logger.info("JOB_CREATE_SUCCESS", { jobId: job.id });
    return job;
};

export const getJobsService = async () => {
    logger.info("JOB_FETCH_START");
    const jobs = await getJobs();
    logger.info("JOB_FETCH_SUCCESS", { count: jobs.length });
    return jobs;
};

export const getJobByIdService = async (id: string) => {
    logger.info("JOB_FETCH_START", { id });
    const job = await getJobById(id);
    if (!job) {
        throw new Error("Job not found");
    }
    logger.info("JOB_FETCH_SUCCESS", { id });
    return job;
};

export const getJobsByCompanyIdService = async (companyId: string) => {
    logger.info("JOB_FETCH_BY_COMPANY_START", { companyId });
    const jobs = await getJobsByCompanyId(companyId);
    logger.info("JOB_FETCH_BY_COMPANY_SUCCESS", { companyId, count: jobs.length });
    return jobs;
};

export const updateJobService = async (id: string, payload: UpdateJobPayload) => {
    logger.info("JOB_UPDATE_START", { id });

    const job = await getJobById(id);
    if (!job) {
        throw new Error("Job not found");
    }

    const updated = await updateJob(id, payload);
    logger.info("JOB_UPDATE_SUCCESS", { id });
    return updated;
};

export const deleteJobService = async (id: string) => {
    logger.info("JOB_DELETE_START", { id });
    const job = await getJobById(id);
    if (!job) {
        throw new Error("Job not found");
    }

    const deleted = await deleteJob(id);
    logger.info("JOB_DELETE_SUCCESS", { id });
    return deleted;
};
