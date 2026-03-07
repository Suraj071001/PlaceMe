import type { Application } from "express";
import {
    assignPermissionController,
    getPermissionsByRoleController,
    getRolesByPermissionController,
    revokePermissionController,
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { AssignPermissionSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import {
    anyPermissionMiddleware,
    permissionMiddleware,
} from "../../middlewares/permissionValidator";

export const rolePermissionRoutes = (app: Application) => {
    app.post(ROUTES.ROLE_PERMISSION.BASE, zodValidator(AssignPermissionSchema), permissionMiddleware("MANAGE_ROLE_PERMISSION"), assignPermissionController);
    app.delete(ROUTES.ROLE_PERMISSION.BASE, permissionMiddleware("MANAGE_ROLE_PERMISSION"), revokePermissionController);
    app.get(
        ROUTES.ROLE_PERMISSION.BY_ROLE,
        anyPermissionMiddleware([
            "READ_ROLE_PERMISSION",
            "MANAGE_ROLE_PERMISSION",
            "MANAGE_USERS",
        ]),
        getPermissionsByRoleController,
    );
    app.get(
        ROUTES.ROLE_PERMISSION.BY_PERMISSION,
        anyPermissionMiddleware([
            "READ_ROLE_PERMISSION",
            "MANAGE_ROLE_PERMISSION",
            "MANAGE_USERS",
        ]),
        getRolesByPermissionController,
    );
};
