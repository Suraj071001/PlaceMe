import type { Application } from "express";
import {
    createCompanyController,
    getCompaniesController,
    getCompanyByIdController,
    updateCompanyController,
    deleteCompanyController,
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { CreateCompanySchema, UpdateCompanySchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const companyRoutes = (app: Application) => {
    app.post(ROUTES.COMPANY.BASE, zodValidator(CreateCompanySchema), permissionMiddleware("CREATE_COMPANY"), createCompanyController);
    app.get(ROUTES.COMPANY.BASE, permissionMiddleware("READ_COMPANY"), getCompaniesController);
    app.get(ROUTES.COMPANY.BY_ID, permissionMiddleware("READ_COMPANY"), getCompanyByIdController);
    app.patch(ROUTES.COMPANY.BY_ID, zodValidator(UpdateCompanySchema), permissionMiddleware("UPDATE_COMPANY"), updateCompanyController);
    app.delete(ROUTES.COMPANY.BY_ID, permissionMiddleware("DELETE_COMPANY"), deleteCompanyController);
};