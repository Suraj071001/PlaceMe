import { createFormResponse, getFormResponseByApplication } from "./dao";
import { getApplicationById, linkApplicationToPipeline } from "../student-application/dao";
import type { SubmitFormResponsePayload } from "@repo/zod";
import logger from "../../utils/logger";

export const submitFormResponseService = async (studentId: string, payload: SubmitFormResponsePayload) => {
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

export const getFormResponseService = async (studentId: string, applicationId: string) => {
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
