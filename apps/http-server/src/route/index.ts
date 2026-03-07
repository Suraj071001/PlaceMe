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
import { studentApplicationRoutes } from "../modules/student-application/handler";
import { formResponseRoutes } from "../modules/form-response/handler";
import { resumeRoutes } from "../modules/resume/handler";
import { roleRoutes } from "../modules/role/handler";
import { permissionRoutes } from "../modules/permission/handler";
import { rolePermissionRoutes } from "../modules/rolepermission/handler";

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
    studentApplicationRoutes(routerAsApp);
    formResponseRoutes(routerAsApp);
    resumeRoutes(routerAsApp);
    roleRoutes(routerAsApp);
    permissionRoutes(routerAsApp);
    rolePermissionRoutes(routerAsApp);
    return router;
}

export const initRoutes = (app: Application) => {
    const v1Router = initV1Routes();
    app.use(API_VERSION.V1, v1Router);
};