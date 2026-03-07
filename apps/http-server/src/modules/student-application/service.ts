import {
    createApplication,
    getApplicationById,
    getStudentApplications,
    linkApplicationToPipeline
} from "./dao";
import type { ApplyJobPayload } from "@repo/zod";
import logger from "../../utils/logger";
import client from "@repo/db/index";

export const applyJobService = async (studentId: string, payload: ApplyJobPayload) => {
    logger.info("Apply to job started for student", { studentId, jobId: payload.jobId });

    // Check if job exists and has a form
    const job = await client.job.findUnique({
        where: { id: payload.jobId },
        include: { applicationForms: true }
    });

    if (!job) {
        throw new Error("Job not found");
    }

    // Check if student applied already
    const existing = await client.application.findUnique({
        where: {
            studentId_jobId: {
                studentId,
                jobId: payload.jobId
            }
        }
    });

    if (existing) {
        throw new Error("You have already applied to this job");
    }

    const requiresForm = job.applicationForms && job.applicationForms.length > 0;

    const application = await createApplication(studentId, payload.jobId, requiresForm);

    if (!requiresForm) {
        // Automatically enter pipeline
        await linkApplicationToPipeline(application.id, payload.jobId);
    }

    logger.info("Application created successfully", { applicationId: application.id });
    return application;
};

export const getApplicationByIdService = async (id: string, studentId: string) => {
    const application = await getApplicationById(id);
    if (!application) throw new Error("Application not found");
    if (application.studentId !== studentId) {
        throw new Error("Unauthorized access to this application");
    }
    return application;
};

export const getMyApplicationsService = async (studentId: string) => {
    return await getStudentApplications(studentId);
};
