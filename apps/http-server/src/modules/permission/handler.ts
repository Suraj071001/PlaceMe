import type { Application } from "express";
import { getPermissionByIdController, getPermissionsController } from "./controller";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const permissionRoutes = (app: Application) => {
    app.get(ROUTES.PERMISSION.BASE, permissionMiddleware("READ_PERMISSION"), getPermissionsController);
    app.get(ROUTES.PERMISSION.BY_ID, permissionMiddleware("READ_PERMISSION"), getPermissionByIdController);
};
