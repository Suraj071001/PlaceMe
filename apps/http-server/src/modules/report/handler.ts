import type { Application } from "express";
import { getReportsController, generateReportController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { GenerateReportSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const reportRoutes = (app: Application) => {
    app.get(
        ROUTES.REPORT.BASE,
        permissionMiddleware("READ_REPORTS"),
        getReportsController
    );
    app.post(
        ROUTES.REPORT.GENERATE,
        zodValidator(GenerateReportSchema),
        permissionMiddleware("READ_REPORTS"),
        generateReportController
    );
};
