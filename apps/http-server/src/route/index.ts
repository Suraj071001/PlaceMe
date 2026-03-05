import express from "express";
import { type Application } from "express";
import { API_VERSION } from "../constants/routes";
import { authRoutes } from "../modules/auth/handler";
import { companyRoutes } from "../modules/company/handler";
import { hrcontactRoutes } from "../modules/hrcontact/handler";


const initV1Routes = (): express.Router => {
    const router = express.Router();
    const routerAsApp = router as Application;
    authRoutes(routerAsApp);
    companyRoutes(routerAsApp);
    hrcontactRoutes(routerAsApp);
    return router;
}

export const initRoutes = (app: Application) => {
    const v1Router = initV1Routes();
    app.use(API_VERSION.V1, v1Router);
};