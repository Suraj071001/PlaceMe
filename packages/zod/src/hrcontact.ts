import { z } from "zod";

export const HRDesignationEnum = z.enum([
    "HR",
    "TALENT_ACQUISITION",
    "RECRUITER",
    "SENIOR_RECRUITER",
    "HR_MANAGER",
    "HR_HEAD",
    "CAMPUS_RECRUITER",
    "TECH_RECRUITER",
    "OTHER",
]);

export const CreateHRContactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    designation: HRDesignationEnum,
    linkedin: z.string().url("Invalid LinkedIn URL").optional(),
    companyId: z.string().uuid("Invalid company ID"),
});

export const UpdateHRContactSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().optional(),
    designation: HRDesignationEnum.optional(),
    linkedin: z.string().url("Invalid LinkedIn URL").optional(),
    companyId: z.string().uuid("Invalid company ID").optional(),
});

export type CreateHRContactPayload = z.infer<typeof CreateHRContactSchema>;
export type UpdateHRContactPayload = z.infer<typeof UpdateHRContactSchema>;

export const HRContactQuerySchema = z.object({
    companyId: z.string().uuid("Invalid company ID").optional(),
    designation: HRDesignationEnum.optional(),
});

export type HRContactQuery = z.infer<typeof HRContactQuerySchema>;
