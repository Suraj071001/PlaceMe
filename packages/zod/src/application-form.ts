import { z } from "zod";
import { PaginationQuerySchema } from "./common";

export const QuestionTypeEnum = z.enum([
    "SHORT_TEXT",
    "LONG_TEXT",
    "EMAIL",
    "PHONE",
    "YES_NO",
    "CHECKBOX",
    "MULTIPLE_CHOICE",
    "DATE",
    "FILE_UPLOAD",
    "URL"
]);

export const QuestionOptionSchema = z.object({
    label: z.string().min(1, "Option label is required"),
    value: z.string().min(1, "Option value is required"),
});

export const FormQuestionSchema = z.object({
    label: z.string().min(1, "Question label is required"),
    type: QuestionTypeEnum,
    order: z.number().int().min(0, "Order must be a non-negative number"),
    required: z.boolean().default(false),
    isPrivate: z.boolean().default(false),
    description: z.string().optional().nullable(),
    systemNote: z.string().optional().nullable(),
    options: z.array(QuestionOptionSchema).optional(),
});

export const FormSectionSchema = z.object({
    title: z.string().min(1, "Section title is required"),
    order: z.number().int().min(0, "Order must be a non-negative number"),
    description: z.string().optional().nullable(),
    questions: z.array(FormQuestionSchema).optional().default([]),
});

export const CreateApplicationFormSchema = z.object({
    title: z.string().min(1, "Form title is required"),
    isDefault: z.boolean().default(false),
    departmentId: z.string().uuid("Invalid department ID").min(1, "Department ID is required"),
});

export const UpdateApplicationFormSchema = z.object({
    title: z.string().min(1, "Form title is required"),
    isDefault: z.boolean().default(false),
    departmentId: z.string().uuid("Invalid department ID").min(1, "Department ID is required"),
    sections: z.array(FormSectionSchema).optional(),
});

export const ApplicationFormQuerySchema = PaginationQuerySchema.extend({
    departmentId: z.string().uuid("Invalid department ID format").optional(),
});

export type CreateApplicationFormPayload = z.infer<typeof CreateApplicationFormSchema>;
export type UpdateApplicationFormPayload = z.infer<typeof UpdateApplicationFormSchema>;
export type ApplicationFormQueryPayload = z.infer<typeof ApplicationFormQuerySchema>;
