import type { Application } from "express";
import { signupController, loginController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { SignupSchema, LoginSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
export const authRoutes = (app: Application) => {
    app.post(ROUTES.AUTH.SIGNUP, zodValidator(SignupSchema), signupController);
    app.post(ROUTES.AUTH.SIGNIN, zodValidator(LoginSchema), loginController);
}

