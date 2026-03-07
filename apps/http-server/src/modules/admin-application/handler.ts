import type { Application } from "express";
import { getJobApplicationsController, updateApplicationStageController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { UpdateAdminApplicationStageSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const adminApplicationRoutes = (app: Application) => {
    // Get all applications for a job (to render in pipeline)
    app.get(
        ROUTES.ADMIN_APPLICATION.BY_JOB,
        permissionMiddleware("READ_APPLICATION_ADMIN"),
        getJobApplicationsController
    );

    // Update application stage (drag and drop in pipeline)
    app.patch(
        ROUTES.ADMIN_APPLICATION.UPDATE_STAGE,
        zodValidator(UpdateAdminApplicationStageSchema),
        permissionMiddleware("MOVE_APPLICATION_STAGE"),
        updateApplicationStageController
    );
};
