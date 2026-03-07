import type { Application } from "express";
import {
    createRoleController,
    deleteRoleController,
    getRoleByIdController,
    getRolesController,
    updateRoleController,
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { CreateRoleSchema, UpdateRoleSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import {
    anyPermissionMiddleware,
    permissionMiddleware,
} from "../../middlewares/permissionValidator";

export const roleRoutes = (app: Application) => {
    app.post(ROUTES.ROLE.BASE, zodValidator(CreateRoleSchema), permissionMiddleware("CREATE_ROLE"), createRoleController);
    app.get(
        ROUTES.ROLE.BASE,
        anyPermissionMiddleware([
            "READ_ROLE",
            "MANAGE_USERS",
            "READ_ROLE_PERMISSION",
            "MANAGE_ROLE_PERMISSION",
        ]),
        getRolesController,
    );
    app.get(
        ROUTES.ROLE.BY_ID,
        anyPermissionMiddleware([
            "READ_ROLE",
            "MANAGE_USERS",
            "READ_ROLE_PERMISSION",
            "MANAGE_ROLE_PERMISSION",
        ]),
        getRoleByIdController,
    );
    app.patch(ROUTES.ROLE.BY_ID, zodValidator(UpdateRoleSchema), permissionMiddleware("UPDATE_ROLE"), updateRoleController);
    app.delete(ROUTES.ROLE.BY_ID, permissionMiddleware("DELETE_ROLE"), deleteRoleController);
};
