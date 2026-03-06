import { z } from "zod";

export const CreateDepartmentSchema = z.object({
    companyId: z.string().uuid("Invalid company ID"),
    name: z.string().min(1, "Name is required"),
});

export const UpdateDepartmentSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
});

export type CreateDepartmentPayload = z.infer<typeof CreateDepartmentSchema>;
export type UpdateDepartmentPayload = z.infer<typeof UpdateDepartmentSchema>;
