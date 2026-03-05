import { z } from "zod";
import { Role } from "@repo/db/generated/prisma/enums";

export const SignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(Role).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignupPayload = z.infer<typeof SignupSchema>;
export type LoginPayload = z.infer<typeof LoginSchema>;
