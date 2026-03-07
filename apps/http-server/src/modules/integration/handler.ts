import type { Application } from "express";
import { getIntegrationsController, connectIntegrationController, disconnectIntegrationController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { ConnectIntegrationSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const integrationRoutes = (app: Application) => {
    app.get(
        ROUTES.INTEGRATION.BASE,
        permissionMiddleware("MANAGE_USERS"),
        getIntegrationsController
    );
    app.post(
        ROUTES.INTEGRATION.CONNECT,
        zodValidator(ConnectIntegrationSchema),
        permissionMiddleware("MANAGE_USERS"),
        connectIntegrationController
    );
    app.delete(
        ROUTES.INTEGRATION.DISCONNECT,
        permissionMiddleware("MANAGE_USERS"),
        disconnectIntegrationController
    );
};
