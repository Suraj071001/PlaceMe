import type { Application } from "express";
import { getProfileController, updateProfileController, getStudentByIdController, getNotificationsController, markNotificationAsReadController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { UpdateStudentProfileSchema } from "@repo/zod";
import { permissionMiddleware } from "../../middlewares/permissionValidator";
import { ROUTES } from "../../constants/routes";

export const studentRoutes = (app: Application) => {
    app.get(ROUTES.STUDENT.PROFILE, permissionMiddleware("READ_PROFILE"), getProfileController);
    app.get(ROUTES.STUDENT.NOTIFICATIONS, permissionMiddleware("READ_PROFILE"), getNotificationsController);
    app.post(ROUTES.STUDENT.NOTIFICATION_READ, permissionMiddleware("READ_PROFILE"), markNotificationAsReadController);
    app.patch(ROUTES.STUDENT.NOTIFICATION_READ, permissionMiddleware("READ_PROFILE"), markNotificationAsReadController);
    app.get(ROUTES.STUDENT.BY_ID, permissionMiddleware("READ_PROFILE"), getStudentByIdController);
    app.put(ROUTES.STUDENT.PROFILE, zodValidator(UpdateStudentProfileSchema), permissionMiddleware("UPDATE_PROFILE"), updateProfileController);
    app.patch(ROUTES.STUDENT.PROFILE, zodValidator(UpdateStudentProfileSchema), permissionMiddleware("UPDATE_PROFILE"), updateProfileController);
}
