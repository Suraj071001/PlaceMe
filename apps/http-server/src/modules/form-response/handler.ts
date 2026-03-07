import type { Application } from "express";
import {
    submitFormResponseController,
    getFormResponseController
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { submitFormResponseSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const formResponseRoutes = (app: Application) => {
    app.post(ROUTES.FORM_RESPONSE.BASE, permissionMiddleware("APPLY_JOB"), zodValidator(submitFormResponseSchema), submitFormResponseController);
    app.get(ROUTES.FORM_RESPONSE.BY_APPLICATION_ID, permissionMiddleware("READ_APPLICATION"), getFormResponseController);
};
