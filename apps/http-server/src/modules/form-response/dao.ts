import client from "@repo/db/index";
import { ApplicationStatus } from "@repo/db";
import type { SubmitFormResponsePayload } from "@repo/zod";
import { linkApplicationToPipeline } from "../student-application/dao";

export const getApplicationWithForm = async (applicationId: string) => {
    return await client.application.findUnique({
        where: { id: applicationId },
        include: {
            job: {
                include: { applicationForms: true }
            },
            formResponse: true
        }
    });
};

export const createFormResponse = async (studentId: string, payload: SubmitFormResponsePayload) => {
    // We already validated in service that the application belongs to the student
    const application = await getApplicationWithForm(payload.applicationId);
    if (!application) throw new Error("Application not found");

    // Check if it already has a response
    if (application.formResponse) {
        throw new Error("Form already submitted for this application");
    }

    const formId = application.job.applicationForms[0]?.id;
    if (!formId) throw new Error("No application form found for this job");

    // Execute everything in a transaction
    return await client.$transaction(async (tx) => {
        // 1. Create FormResponse and FormAnswers
        const formResponse = await tx.formResponse.create({
            data: {
                applicationId: payload.applicationId,
                formId,
                studentId,
                answers: {
                    create: payload.answers.map(ans => ({
                        questionId: ans.questionId,
                        value: ans.value,
                        values: ans.values || [],
                        fileUrl: ans.fileUrl
                    }))
                }
            }
        });

        // 2. Update Application Status to APPLIED
        const updatedApp = await tx.application.update({
            where: { id: payload.applicationId },
            data: { status: ApplicationStatus.APPLIED }
        });

        return { formResponse, application: updatedApp };
    });
};

export const getFormResponseByApplication = async (applicationId: string) => {
    // Just find the response by application id
    return await client.formResponse.findUnique({
        where: { applicationId },
        include: { answers: true }
    });
};
