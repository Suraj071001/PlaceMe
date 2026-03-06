import type { Application } from "express";
import {
    createDepartmentController,
    getDepartmentsController,
    getDepartmentByIdController,
    updateDepartmentController,
    deleteDepartmentController,
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { CreateDepartmentSchema, UpdateDepartmentSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const departmentRoutes = (app: Application) => {
    app.post(ROUTES.DEPARTMENT.BASE, zodValidator(CreateDepartmentSchema), permissionMiddleware("CREATE_DEPARTMENT"), createDepartmentController);
    app.get(ROUTES.DEPARTMENT.BASE, permissionMiddleware("READ_DEPARTMENT"), getDepartmentsController);
    app.get(ROUTES.DEPARTMENT.BY_ID, permissionMiddleware("READ_DEPARTMENT"), getDepartmentByIdController);
    app.patch(ROUTES.DEPARTMENT.BY_ID, zodValidator(UpdateDepartmentSchema), permissionMiddleware("UPDATE_DEPARTMENT"), updateDepartmentController);
    app.delete(ROUTES.DEPARTMENT.BY_ID, permissionMiddleware("DELETE_DEPARTMENT"), deleteDepartmentController);
};
