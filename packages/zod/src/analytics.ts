import { z } from "zod";

export const AnalyticsQuerySchema = z.object({
    dateRange: z.string().optional(),
    department: z.string().optional(),
    jobType: z.string().optional(),
    placementTier: z.string().optional(),
    compareYears: z.string().optional(),
});
