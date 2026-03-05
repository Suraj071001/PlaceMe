import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "./dao";
import type { SignupPayload, LoginPayload } from "@repo/zod";
import { ERROR, LOG } from "../../constants";
import logger from "../../utils/logger";
import JWT_SECRET from "../../config/auth";


export const signupService = async (payload: SignupPayload) => {
  logger.info(LOG.AUTH_REGISTER_START, { email: payload.email });

  const existingUser = await findUserByEmail(payload.email);
  if (existingUser) {
    logger.warn(LOG.AUTH_REGISTER_FAILED, { email: payload.email, reason: ERROR.USER_EXISTS });
    throw new Error(ERROR.USER_EXISTS);
  }

  const hashedPassword = await Bun.password.hash(payload.password, {
    algorithm: "bcrypt"
  });

  const user = await createUser({
    ...payload,
    password: hashedPassword,
  });



  const token = jwt.sign(
    { id: user.id,  role: user.role },
    JWT_SECRET as string,
    { expiresIn: "1d" },
  );

  logger.info(LOG.AUTH_REGISTER_SUCCESS, { userId: user.id });
  return  token ;
};

export const loginService = async (payload: LoginPayload) => {
  logger.info(LOG.AUTH_LOGIN_START, { email: payload.email });

  const user = await findUserByEmail(payload.email);
  if (!user) {
    logger.warn(LOG.AUTH_LOGIN_FAILED, { email: payload.email, reason: ERROR.USER_NOT_FOUND });
    throw new Error(ERROR.USER_NOT_FOUND);
  }

  const isPasswordValid = await Bun.password.verify(payload.password, user.password);
  if (!isPasswordValid) {
    logger.warn(LOG.AUTH_LOGIN_FAILED, { email: payload.email, reason: ERROR.INVALID_CREDENTIALS });
    throw new Error(ERROR.INVALID_CREDENTIALS);
  }
  // add permssion in this jwt token 
  const token = jwt.sign(
    { id: user.id , role: user.role },
    JWT_SECRET as string ,
    { expiresIn: "1d" },
  );

  logger.info(LOG.AUTH_LOGIN_SUCCESS, { userId: user.id });
  return { user: { id: user.id, email: user.email, role: user.role }, token };
};
