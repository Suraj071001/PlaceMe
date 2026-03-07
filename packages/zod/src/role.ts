import { z } from "zod";

export const CreateRoleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    isDefault: z.boolean().optional().default(false),
});

export const UpdateRoleSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    description: z.string().optional(),
    isDefault: z.boolean().optional(),
});

export type CreateRolePayload = z.infer<typeof CreateRoleSchema>;
export type UpdateRolePayload = z.infer<typeof UpdateRoleSchema>;
