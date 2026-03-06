import {
    createApplicationForm,
    getApplicationForms,
    getApplicationFormById,
    updateApplicationFormDeep,
    deleteApplicationForm,
} from "./dao";
import type {
    CreateApplicationFormPayload,
    UpdateApplicationFormPayload,
    ApplicationFormQueryPayload,
} from "@repo/zod";
import logger from "../../utils/logger";

export const createApplicationFormService = async (payload: CreateApplicationFormPayload) => {
    logger.info("Application form creation started");
    const form = await createApplicationForm(payload);
    logger.info("Application form created successfully", { formId: form.id });
    return form;
};

export const getApplicationFormsService = async (query: ApplicationFormQueryPayload) => {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const filters: any = {};
    if (query.departmentId) filters.departmentId = query.departmentId;

    logger.info("Fetching application forms");
    const { data, total } = await getApplicationForms(skip, limit, filters);

    return {
        forms: data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getApplicationFormByIdService = async (id: string) => {
    const form = await getApplicationFormById(id);
    if (!form) {
        logger.warn("Application form not found", { formId: id });
        throw new Error("Application Form not found");
    }
    return form;
};

export const updateApplicationFormService = async (
    id: string,
    payload: UpdateApplicationFormPayload
) => {
    logger.info("Application form update started", { formId: id });

    // Verify existence
    await getApplicationFormByIdService(id);

    const updatedForm = await updateApplicationFormDeep(id, payload);
    logger.info("Application form updated successfully", { formId: id });
    return updatedForm;
};

export const deleteApplicationFormService = async (id: string) => {
    logger.info("Application form deletion started", { formId: id });

    // Verify existence
    await getApplicationFormByIdService(id);

    await deleteApplicationForm(id);
    logger.info("Application form deleted successfully", { formId: id });
    return true;
};
