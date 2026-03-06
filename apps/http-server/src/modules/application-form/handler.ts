import type { Application } from "express";
import { zodValidator } from "../../middlewares/zodValidator";
import { permissionMiddleware } from "../../middlewares/permissionValidator";
import {
    createApplicationFormController,
    getApplicationFormsController,
    getApplicationFormByIdController,
    updateApplicationFormController,
    deleteApplicationFormController,
} from "./controller";
import {
    CreateApplicationFormSchema,
    UpdateApplicationFormSchema,
} from "@repo/zod";

export const applicationFormRoutes = (app: Application) => {
    // Using generic "MANAGE_ALL" or assuming there will be forms permissions.
    // For now, attaching CREATE_JOB / UPDATE_JOB patterns assuming forms are tied to jobs
    app.post(
        "/api/v1/application-forms",
        zodValidator(CreateApplicationFormSchema),
        permissionMiddleware("CREATE_JOB"), // Assuming if you can create a job you can create a form
        createApplicationFormController
    );

    app.get(
        "/api/v1/application-forms",
        permissionMiddleware("READ_JOBS"),
        getApplicationFormsController
    );

    app.get(
        "/api/v1/application-forms/:id",
        permissionMiddleware("READ_JOBS"),
        getApplicationFormByIdController
    );

    app.put(
        "/api/v1/application-forms/:id",
        zodValidator(UpdateApplicationFormSchema),
        permissionMiddleware("EDIT_JOB"),
        updateApplicationFormController
    );

    app.delete(
        "/api/v1/application-forms/:id",
        permissionMiddleware("DELETE_JOB"),
        deleteApplicationFormController
    );
};
