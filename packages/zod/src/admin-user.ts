import { z } from "zod";

export const CreateAdminUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    roleId: z.string().uuid(),
});

export const UpdateAdminUserSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    roleId: z.string().uuid().optional(),
    isActive: z.boolean().optional(),
});
