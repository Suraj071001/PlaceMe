import { createFormResponse, getFormResponseByApplication } from "./dao";
import { getApplicationById, linkApplicationToPipeline } from "../student-application/dao";
import type { SubmitFormResponsePayload } from "@repo/zod";
import logger from "../../utils/logger";
import client from "@repo/db";

const getStudentIdByUserId = async (userId: string) => {
    const student = await client.student.findUnique({
        where: { userId },
        select: { id: true },
    });
    if (!student) {
        throw new Error("Student profile not found for current user");
    }
    return student.id;
};

export const submitFormResponseService = async (userId: string, payload: SubmitFormResponsePayload) => {
    const studentId = await getStudentIdByUserId(userId);
    logger.info("Submit form response started", { applicationId: payload.applicationId, studentId });

    // Validate application ownership
    const application = await getApplicationById(payload.applicationId);
    if (!application) {
        throw new Error("Application not found");
    }

    if (application.studentId !== studentId) {
        throw new Error("Unauthorized to submit form for this application");
    }

    if (application.status !== "DRAFT") {
        throw new Error("Form already submitted or application is not in DRAFT status");
    }

    // Create form response and answers and update status to APPLIED
    const result = await createFormResponse(studentId, payload);

    // Link to pipeline
    await linkApplicationToPipeline(payload.applicationId, application.jobId);

    logger.info("Form submitted and applied successfully", { applicationId: payload.applicationId });

    return result;
};

export const getFormResponseService = async (userId: string, applicationId: string) => {
    const studentId = await getStudentIdByUserId(userId);
    // Validate ownership
    const application = await getApplicationById(applicationId);
    if (!application || application.studentId !== studentId) {
        throw new Error("Unauthorized access");
    }

    const response = await getFormResponseByApplication(applicationId);
    if (!response) {
        throw new Error("Form response not found");
    }

    return response;
};
