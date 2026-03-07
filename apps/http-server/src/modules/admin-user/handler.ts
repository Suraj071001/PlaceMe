import type { Application } from "express";
import {
    createAdminUserController,
    getAdminUsersController,
    getAdminUserByIdController,
    updateAdminUserController,
    deleteAdminUserController
} from "./controller";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";
import { zodValidator } from "../../middlewares/zodValidator";
import { CreateAdminUserSchema, UpdateAdminUserSchema } from "@repo/zod";

export const adminUserRoutes = (app: Application) => {
    app.post(
        ROUTES.ADMIN_USER.BASE,
        zodValidator(CreateAdminUserSchema),
        permissionMiddleware("MANAGE_USERS"),
        createAdminUserController
    );
    app.get(
        ROUTES.ADMIN_USER.BASE,
        permissionMiddleware("MANAGE_USERS"),
        getAdminUsersController
    );
    app.get(
        ROUTES.ADMIN_USER.BY_ID,
        permissionMiddleware("MANAGE_USERS"),
        getAdminUserByIdController
    );
    app.patch(
        ROUTES.ADMIN_USER.BY_ID,
        zodValidator(UpdateAdminUserSchema),
        permissionMiddleware("MANAGE_USERS"),
        updateAdminUserController
    );
    app.delete(
        ROUTES.ADMIN_USER.BY_ID,
        permissionMiddleware("MANAGE_USERS"),
        deleteAdminUserController
    );
};
