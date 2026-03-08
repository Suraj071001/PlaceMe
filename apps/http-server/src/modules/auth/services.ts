import jwt from "jsonwebtoken";
import { findUserByEmail, createUser, createOTP, verifyOTP, activateUserAndSetPassword } from "./dao";
import type { OtpRequestPayload, OtpVerifyPayload, LoginPayload } from "@repo/zod";
import { ERROR, LOG } from "../../constants";
import logger from "../../utils/logger";
import JWT_SECRET from "../../config/auth";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "placementcell@dsadev.me";

const sendOtpEmail = async (to: string, otp: string) => {
  if (!RESEND_API_KEY) {
    logger.error("OTP email send failed", {
      email: to,
      reason: "RESEND_API_KEY is not configured",
    });
    throw new Error("OTP email service is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to: [to],
      subject: "Your PlaceMe OTP",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("OTP email send failed", {
      email: to,
      status: response.status,
      response: errorBody,
    });
    throw new Error("Failed to send OTP email. Please try again.");
  }
};

export const otpRequestService = async (payload: OtpRequestPayload) => {
  logger.info("OTP request start", { email: payload.email });

  const user = await findUserByEmail(payload.email);
  if (!user) {
    logger.warn("OTP request failed", { email: payload.email, reason: ERROR.USER_NOT_FOUND });
    throw new Error("This email is not registered in our institute records. Please contact the placement cell.");
  }

  if (user.isActive) {
    logger.warn("OTP request failed", { email: payload.email, reason: "User is already active" });
    throw new Error("User is already active. Please login.");
  }

  const otp = generateOTP();
  await createOTP(payload.email, otp);
  await sendOtpEmail(payload.email, otp);
  logger.info("OTP email sent", { email: payload.email });

  return { message: "OTP sent successfully" };
};

export const otpVerifyService = async (payload: OtpVerifyPayload) => {
  logger.info("OTP verify start", { email: payload.email });

  const isValidOtp = await verifyOTP(payload.email, payload.otp);
  if (!isValidOtp) {
    logger.warn("OTP verify failed", { email: payload.email, reason: "Invalid or expired OTP" });
    throw new Error("Invalid or expired OTP");
  }

  const hashedPassword = await Bun.password.hash(payload.password, {
    algorithm: "bcrypt"
  });

  const user = await activateUserAndSetPassword(payload.email, hashedPassword);

  const permissions = (user.role as any)?.permissions?.map((rp: any) => rp.permission.name) || [];

  const token = jwt.sign(
    { id: user.id, role: (user.role as any)?.name, permissions },
    JWT_SECRET as string,
    { expiresIn: "1d" },
  );

  logger.info(LOG.AUTH_REGISTER_SUCCESS, { userId: user.id });
  return token;
};

export const loginService = async (payload: LoginPayload) => {
  logger.info(LOG.AUTH_LOGIN_START, { email: payload.email });

  const user = await findUserByEmail(payload.email);
  if (!user) {
    logger.warn(LOG.AUTH_LOGIN_FAILED, { email: payload.email, reason: ERROR.USER_NOT_FOUND });
    throw new Error(ERROR.USER_NOT_FOUND);
  }

  if (!user.isActive) {
    logger.warn(LOG.AUTH_LOGIN_FAILED, { email: payload.email, reason: "User is not active" });
    throw new Error("Account is not active. Please sign up to verify your email first.");
  }

  const isPasswordValid = await Bun.password.verify(payload.password, user.password);
  if (!isPasswordValid) {
    logger.warn(LOG.AUTH_LOGIN_FAILED, { email: payload.email, reason: ERROR.INVALID_CREDENTIALS });
    throw new Error(ERROR.INVALID_CREDENTIALS);
  }
  const permissions = (user.role as any)?.permissions?.map((rp: any) => rp.permission.name) || [];

  const token = jwt.sign(
    { id: user.id, role: (user.role as any)?.name, permissions },
    JWT_SECRET as string,
    { expiresIn: "1d" },
  );

  logger.info(LOG.AUTH_LOGIN_SUCCESS, { userId: user.id });
  return { user: { id: user.id, email: user.email, role: (user.role as any)?.name, permissions }, token };
};
