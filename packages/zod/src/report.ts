import { z } from "zod";

export const GenerateReportSchema = z.object({
    type: z.enum(["Placement", "Department", "Company"]),
    filters: z.any().optional(),
});
