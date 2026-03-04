import type { Request, Response } from "express";
import { signupService, loginService } from "./services";
import { SignupSchema, LoginSchema } from "@repo/zod";
import { ERROR, SUCCESS, LOG } from "../../constants";
import logger from "../../utils/logger";

export const signupController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const payload = SignupSchema.parse(req.body);
    const result = await signupService(payload);
    res.status(201).json({ message: SUCCESS.USER_REGISTERED, ...result });
  } catch (error: any) {
    if (error.errors) {
      res
        .status(400)
        .json({ error: ERROR.VALIDATION_FAILURE, details: error.errors });
    } else {
      res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
  }
};

export const loginController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const payload = LoginSchema.parse(req.body);
    const result = await loginService(payload);
    res.status(200).json({ message: SUCCESS.USER_LOGGED_IN, ...result });
  } catch (error: any) {
    if (error.errors) {
      res
        .status(400)
        .json({ error: ERROR.VALIDATION_FAILURE, details: error.errors });
    } else {
      res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
  }
};
