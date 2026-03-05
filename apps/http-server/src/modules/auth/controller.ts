import { type Request, type Response } from "express";
import { signupService, loginService } from "./services";
import { SignupSchema, LoginSchema } from "@repo/zod";
import { ERROR, SUCCESS, LOG } from "../../constants";
import logger from "../../utils/logger";

export const signupController = async (req: Request, res: Response) => {
  try {
    const payload = SignupSchema.parse(req.body);

    const token = await signupService(payload);

    logger.info(LOG.AUTH_REGISTER_SUCCESS, { result: "created" });
    res.status(201).json({ message: SUCCESS.USER_REGISTERED, token });
  } catch (error: any) {
    logger.error(LOG.AUTH_REGISTER_FAILED, {
      error: error.message || ERROR.INTERNAL_SERVER_ERROR,
    });
    return res
      .status(400)
      .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const payload = LoginSchema.parse(req.body);
    const result = await loginService(payload);

    // const role  = req.user.role;

    logger.info(LOG.AUTH_LOGIN_SUCCESS, { userId: result.user.id });
    res
      .status(200)
      .json({ message: SUCCESS.USER_LOGGED_IN, token: result.token });
  } catch (error: any) {
    logger.error(LOG.AUTH_LOGIN_FAILED, {
      error: error.message || ERROR.INTERNAL_SERVER_ERROR,
    });
    return res
      .status(400)
      .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
  }
};




