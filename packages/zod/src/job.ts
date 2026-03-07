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
    location: z.string().optional(),
    workMode: z.string().min(1, "Work mode is required"),
    ctc: z.string().optional(),
    minimumCGPA: z.number().optional(),
    passingYear: z.number().int().optional(),
    applicationDeadline: z.coerce.date().optional(),
    additionalDetails: z.any().optional(),
    employmentType: EmploymentTypeEnum.optional(),
    isOpen: z.boolean().optional(),
    status: JobStatusEnum.optional(),
    openAt: z.coerce.date().optional(),
    closeAt: z.coerce.date(),
    role: z.string().min(1, "Role is required"),
    tier: TierEnum.optional(),
    batchIds: z.array(z.string().uuid("Invalid batch ID")).optional(),
    google_chat: z.boolean().optional(),
    email: z.boolean().optional(),
    applicationForm: z.object({
        title: z.string().min(1, "Form title is required"),
        sections: z.array(z.object({
            title: z.string().min(1, "Section title is required"),
            order: z.number().int().min(0, "Order must be a non-negative number"),
            description: z.string().optional().nullable(),
            questions: z.array(z.object({
                label: z.string().min(1, "Question label is required"),
                type: z.enum([
                    "SHORT_TEXT", "LONG_TEXT", "EMAIL", "PHONE", "YES_NO",
                    "CHECKBOX", "MULTIPLE_CHOICE", "DATE", "FILE_UPLOAD", "URL"
                ]),
                order: z.number().int().min(0, "Order must be a non-negative number"),
                required: z.boolean().default(false),
                isPrivate: z.boolean().default(false),
                description: z.string().optional().nullable(),
                systemNote: z.string().optional().nullable(),
                options: z.array(z.object({
                    label: z.string().min(1, "Option label is required"),
                    value: z.string().min(1, "Option value is required"),
                })).optional(),
            })).optional().default([]),
        })).optional(),
    }).optional(),
});

export const UpdateJobSchema = z.object({
    companyId: z.string().uuid("Invalid company ID").optional(),
    title: z.string().min(1, "Title is required").optional(),
    slug: z.string().optional(),
    description: z.string().optional(),
    departmentId: z.string().uuid("Invalid department ID").optional(),
    location: z.string().optional(),
    workMode: z.string().optional(),
    ctc: z.string().optional(),
    minimumCGPA: z.number().optional(),
    passingYear: z.number().int().optional(),
    applicationDeadline: z.coerce.date().optional(),
    additionalDetails: z.any().optional(),
    employmentType: EmploymentTypeEnum.optional(),
    isOpen: z.boolean().optional(),
    status: JobStatusEnum.optional(),
    openAt: z.coerce.date().optional(),
    closeAt: z.coerce.date().optional(),
    role: z.string().min(1, "Role is required").optional(),
    tier: TierEnum.optional(),
    batchIds: z.array(z.string().uuid("Invalid batch ID")).optional(),
    google_chat: z.boolean().optional(),
    email: z.boolean().optional(),
});

export type CreateJobPayload = z.infer<typeof CreateJobSchema>;
export type UpdateJobPayload = z.infer<typeof UpdateJobSchema>;

export const JobQuerySchema = z.object({
    companyId: z.string().uuid("Invalid company ID").optional(),
    status: JobStatusEnum.optional(),
    employmentType: EmploymentTypeEnum.optional(),
    role: z.string().optional(),
    tier: TierEnum.optional(),
});

export type JobQuery = z.infer<typeof JobQuerySchema>;
