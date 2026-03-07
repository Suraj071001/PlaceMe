import { z } from "zod";

export const PermissionQuerySchema = z.object({
    name: z.string().optional(),
});

export type PermissionQuery = z.infer<typeof PermissionQuerySchema>;
