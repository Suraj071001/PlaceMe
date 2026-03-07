import type { Application } from "express";
import {
    applyJobController,
    getApplicationByIdController,
    getMyApplicationsController,
    getJobApplicationFormController,
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { applyJobSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const studentApplicationRoutes = (app: Application) => {
    app.get(ROUTES.STUDENT_APPLICATION.FORM_BY_JOB, permissionMiddleware("READ_JOBS"), getJobApplicationFormController);
    app.post(ROUTES.STUDENT_APPLICATION.APPLY, permissionMiddleware("APPLY_JOB"), zodValidator(applyJobSchema), applyJobController);
    app.get(ROUTES.STUDENT_APPLICATION.MINE, permissionMiddleware("READ_APPLICATION"), getMyApplicationsController);
    app.get(ROUTES.STUDENT_APPLICATION.BY_ID, permissionMiddleware("READ_APPLICATION"), getApplicationByIdController);
};
