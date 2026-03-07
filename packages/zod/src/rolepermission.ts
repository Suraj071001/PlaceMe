import { z } from "zod";

export const AssignPermissionSchema = z.object({
    roleId: z.string().uuid("Invalid role ID"),
    permissionId: z.string().uuid("Invalid permission ID"),
});

export const RevokePermissionSchema = z.object({
    roleId: z.string().uuid("Invalid role ID"),
    permissionId: z.string().uuid("Invalid permission ID"),
});

export type AssignPermissionPayload = z.infer<typeof AssignPermissionSchema>;
export type RevokePermissionPayload = z.infer<typeof RevokePermissionSchema>;
