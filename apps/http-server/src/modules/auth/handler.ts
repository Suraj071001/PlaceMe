import type { Application } from "express";
import { otpRequestController, otpVerifyController, loginController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { OtpRequestSchema, OtpVerifySchema, LoginSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";

export const authRoutes = (app: Application) => {
    app.post(ROUTES.AUTH.SIGNUP + "/request-otp", zodValidator(OtpRequestSchema), otpRequestController);
    app.post(ROUTES.AUTH.SIGNUP + "/verify", zodValidator(OtpVerifySchema), otpVerifyController);
    app.post(ROUTES.AUTH.SIGNIN, zodValidator(LoginSchema), loginController);
}
