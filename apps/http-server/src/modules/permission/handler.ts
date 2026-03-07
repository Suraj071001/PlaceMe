import type { Application } from "express";
import { getPermissionByIdController, getPermissionsController } from "./controller";
import { ROUTES } from "../../constants/routes";
import {
    anyPermissionMiddleware,
    permissionMiddleware,
} from "../../middlewares/permissionValidator";

export const permissionRoutes = (app: Application) => {
    app.get(
        ROUTES.PERMISSION.BASE,
        anyPermissionMiddleware([
            "READ_PERMISSION",
            "MANAGE_USERS",
            "READ_ROLE_PERMISSION",
            "MANAGE_ROLE_PERMISSION",
        ]),
        getPermissionsController,
    );
    app.get(
        ROUTES.PERMISSION.BY_ID,
        anyPermissionMiddleware([
            "READ_PERMISSION",
            "MANAGE_USERS",
            "READ_ROLE_PERMISSION",
            "MANAGE_ROLE_PERMISSION",
        ]),
        getPermissionByIdController,
    );
};
