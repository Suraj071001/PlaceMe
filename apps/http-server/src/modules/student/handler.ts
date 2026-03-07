import type { Application } from "express";
import { getProfileController, updateProfileController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { UpdateStudentProfileSchema } from "@repo/zod";
import { permissionMiddleware } from "../../middlewares/permissionValidator";
import { ROUTES } from "../../constants/routes";

export const studentRoutes = (app: Application) => {
    app.get(ROUTES.STUDENT.PROFILE, permissionMiddleware("READ_PROFILE"), getProfileController);
    app.put(ROUTES.STUDENT.PROFILE, zodValidator(UpdateStudentProfileSchema), permissionMiddleware("UPDATE_PROFILE"), updateProfileController);
    app.patch(ROUTES.STUDENT.PROFILE, zodValidator(UpdateStudentProfileSchema), permissionMiddleware("UPDATE_PROFILE"), updateProfileController);
}
