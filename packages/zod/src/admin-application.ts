import { z } from "zod";

export const UpdateAdminApplicationStageSchema = z.object({
    stageId: z.string().uuid(),
    status: z.enum(["DRAFT", "APPLIED", "SCREENING", "PHONE_SCREEN", "INTERVIEW", "OFFER", "HIRED", "REJECTED", "ARCHIVED"]).optional(),
});
