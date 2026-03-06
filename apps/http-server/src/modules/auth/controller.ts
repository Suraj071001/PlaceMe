import { type Request, type Response } from "express";
import { otpRequestService, otpVerifyService, loginService } from "./services";
import { OtpRequestSchema, OtpVerifySchema, LoginSchema } from "@repo/zod";
import { ERROR, SUCCESS, LOG } from "../../constants";
import logger from "../../utils/logger";

export const otpRequestController = async (req: Request, res: Response) => {
  try {
    const payload = OtpRequestSchema.parse(req.body);
    const result = await otpRequestService(payload);

    res.status(200).json(result);
  } catch (error: any) {
    logger.error("OTP request failed", {
      error: error.message || ERROR.INTERNAL_SERVER_ERROR,
    });
    return res
      .status(400)
      .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
  }
};

export const otpVerifyController = async (req: Request, res: Response) => {
  try {
    const payload = OtpVerifySchema.parse(req.body);
    const token = await otpVerifyService(payload);

    res.status(200).json({ message: "Account activated successfully", token });
  } catch (error: any) {
    logger.error("OTP verify failed", {
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
