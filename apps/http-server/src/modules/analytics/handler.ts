import type { Application } from "express";
import {
    getStatsController,
    getDepartmentsAnalyticsController,
    getRecentActivityController,
    getUpcomingEventsController,
} from "./controller";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";
import { zodValidator } from "../../middlewares/zodValidator";
import { AnalyticsQuerySchema } from "@repo/zod";

export const analyticsRoutes = (app: Application) => {
    app.get(
        ROUTES.ANALYTICS.STATS,
        permissionMiddleware("READ_REPORTS"),
        getStatsController
    );
    app.get(
        ROUTES.ANALYTICS.DEPARTMENTS,
        permissionMiddleware("READ_REPORTS"),
        getDepartmentsAnalyticsController
    );
    app.get(
        ROUTES.ANALYTICS.RECENT_ACTIVITY,
        permissionMiddleware("READ_REPORTS"),
        getRecentActivityController
    );
    app.get(
        ROUTES.ANALYTICS.UPCOMING_EVENTS,
        permissionMiddleware("READ_REPORTS"),
        getUpcomingEventsController
    );
};
