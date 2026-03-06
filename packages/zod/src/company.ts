import { z } from "zod";

export const CompanyStatusEnum = z.enum([
    "CONTACTED",
    "INTERESTED",
    "NOT_INTERESTED",
    "DRIVE_COMPLETED",
    "OFFER_RELEASED",
    "ON_HOLD",
    "BLACKLISTED",
]);

export const CompanyTierEnum = z.enum(["BASIC", "STANDARD", "DREAM"]);

export const CreateCompanySchema = z.object({
    name: z.string().min(1, "Company name is required"),
    domain: z.string().optional(),
    status: CompanyStatusEnum,
    tier: CompanyTierEnum.optional(),
});

export const UpdateCompanySchema = z.object({
    name: z.string().min(1, "Company name is required").optional(),
    domain: z.string().optional(),
    status: CompanyStatusEnum.optional(),
    tier: CompanyTierEnum.optional(),
});

export type CreateCompanyPayload = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyPayload = z.infer<typeof UpdateCompanySchema>;

export const CompanyQuerySchema = z.object({
    name: z.string().optional(),
    status: CompanyStatusEnum.optional(),
    tier: CompanyTierEnum.optional(),
});

export type CompanyQuery = z.infer<typeof CompanyQuerySchema>;
