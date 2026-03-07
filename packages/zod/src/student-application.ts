import { z } from 'zod';

export const applyJobSchema = z.object({
    jobId: z.string().uuid("Invalid job ID"),
});

export type ApplyJobPayload = z.infer<typeof applyJobSchema>;
