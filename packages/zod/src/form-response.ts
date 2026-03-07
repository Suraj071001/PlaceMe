import { z } from 'zod';

export const formAnswerSchema = z.object({
    questionId: z.string().uuid("Invalid question ID"),
    value: z.string().optional(),
    values: z.array(z.string()).optional(),
    fileUrl: z.string().url().optional(),
});

export const submitFormResponseSchema = z.object({
    applicationId: z.string().uuid("Invalid application ID"),
    answers: z.array(formAnswerSchema),
});

export type FormAnswerPayload = z.infer<typeof formAnswerSchema>;
export type SubmitFormResponsePayload = z.infer<typeof submitFormResponseSchema>;
