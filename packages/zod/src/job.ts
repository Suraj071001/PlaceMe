import { z } from "zod";

export const EmploymentTypeEnum = z.enum([
    "FULL_TIME",
    "PART_TIME",
    "CONTRACT",
    "TEMPORARY",
    "INTERNSHIP",
]);

export const JobStatusEnum = z.enum([
    "ACTIVE",
    "CLOSED",
    "DRAFT",
    "PAUSED",
    "ARCHIVED",
]);

export const TierEnum = z.enum([
    "BASIC",
    "STANDARD",
    "DREAM",
]);

export const CreateJobSchema = z.object({
    companyId: z.string().uuid("Invalid company ID"),
    title: z.string().min(1, "Title is required"),
    slug: z.string().optional(),
    description: z.string().optional(),
    departmentId: z.string().uuid("Invalid department ID").optional(),
    locationId: z.string().uuid("Invalid location ID").optional(),
    employmentType: EmploymentTypeEnum.optional(),
    isOpen: z.boolean().optional(),
    status: JobStatusEnum.optional(),
    openAt: z.coerce.date().optional(),
    closeAt: z.coerce.date(),
    role: z.string().min(1, "Role is required"),
    tier: TierEnum.optional(),
});

export const UpdateJobSchema = z.object({
    companyId: z.string().uuid("Invalid company ID").optional(),
    title: z.string().min(1, "Title is required").optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    departmentId: z.string().uuid("Invalid department ID").optional(),
    locationId: z.string().uuid("Invalid location ID").optional(),
    employmentType: EmploymentTypeEnum.optional(),
    isOpen: z.boolean().optional(),
    status: JobStatusEnum.optional(),
    openAt: z.coerce.date().optional(),
    closeAt: z.coerce.date().optional(),
    role: z.string().min(1, "Role is required").optional(),
    tier: TierEnum.optional(),
});

export type CreateJobPayload = z.infer<typeof CreateJobSchema>;
export type UpdateJobPayload = z.infer<typeof UpdateJobSchema>;
