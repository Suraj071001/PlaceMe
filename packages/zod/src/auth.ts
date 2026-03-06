import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const OtpRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const OtpVerifySchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupPayload = z.infer<typeof SignupSchema>;
export type OtpRequestPayload = z.infer<typeof OtpRequestSchema>;
export type OtpVerifyPayload = z.infer<typeof OtpVerifySchema>;
export type LoginPayload = z.infer<typeof LoginSchema>;
