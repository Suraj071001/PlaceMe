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
<<<<<<< HEAD
import { studentApplicationRoutes } from "../modules/student-application/handler";
import { formResponseRoutes } from "../modules/form-response/handler";
=======
import { resumeRoutes } from "../modules/resume/handler";
>>>>>>> 68a0815ea8e6c033939536440a8126e8603c2ca9

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
<<<<<<< HEAD
    studentApplicationRoutes(routerAsApp);
    formResponseRoutes(routerAsApp);
=======
    resumeRoutes(routerAsApp);
>>>>>>> 68a0815ea8e6c033939536440a8126e8603c2ca9
    return router;
}

export const initRoutes = (app: Application) => {
    const v1Router = initV1Routes();
    app.use(API_VERSION.V1, v1Router);
};