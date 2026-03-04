import { Router } from "express";
import { signupController, loginController } from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { SignupSchema, LoginSchema } from "@repo/zod";

const router = Router();

router.post("/signup", zodValidator(SignupSchema), signupController);
router.post("/login", zodValidator(LoginSchema), loginController);

export default router;