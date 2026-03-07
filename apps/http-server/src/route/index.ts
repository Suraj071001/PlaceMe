import express from "express";
import { type Application } from "express";
import { API_VERSION } from "../constants/routes";
import { authRoutes } from "../modules/auth/handler";
import { companyRoutes } from "../modules/company/handler";
import { hrcontactRoutes } from "../modules/hrcontact/handler";
import { jobRoutes } from "../modules/job/handler";
import { applicationFormRoutes } from "../modules/application-form/handler";

import { departmentRoutes } from "../modules/department/handler";
import { studentRoutes } from "../modules/student/handler";
import { resumeRoutes } from "../modules/resume/handler";

const initV1Routes = (): express.Router => {
    const router = express.Router();
    const routerAsApp = router as Application;
    authRoutes(routerAsApp);
    companyRoutes(routerAsApp);
    hrcontactRoutes(routerAsApp);
    jobRoutes(routerAsApp);
    departmentRoutes(routerAsApp);
    applicationFormRoutes(routerAsApp);
    studentRoutes(routerAsApp);
    resumeRoutes(routerAsApp);
    return router;
}

export const initRoutes = (app: Application) => {
    const v1Router = initV1Routes();
    app.use(API_VERSION.V1, v1Router);
};