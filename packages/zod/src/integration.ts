import { z } from "zod";

export const ConnectIntegrationSchema = z.object({
    webhookUrl: z.string().url().optional(),
    apiToken: z.string().optional(),
});
