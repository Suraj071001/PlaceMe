import { z } from "zod";

export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
