import { z } from "zod";

export const CompanyStatusEnum = z.enum(["CONTACTED", "INTERESTED", "NOT_INTERESTED", "DRIVE_COMPLETED", "OFFER_RELEASED", "ON_HOLD", "BLACKLISTED"]);

export const CreateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  domain: z.string().optional(),
  industry: z.string().min(1, "Industry is required"),
  faculty_coordinator: z.string().min(1, "Faculty coordinator is required"),
  status: CompanyStatusEnum,
  branchId: z.string().uuid("Invalid branch ID"),
});

export const UpdateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").optional(),
  domain: z.string().optional(),
  industry: z.string().min(1, "Industry is required").optional(),
  faculty_coordinator: z.string().min(1, "Faculty coordinator is required").optional(),
  status: CompanyStatusEnum.optional(),
});

export type CreateCompanyPayload = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyPayload = z.infer<typeof UpdateCompanySchema>;

export const CompanyQuerySchema = z.object({
  name: z.string().optional(),
  status: CompanyStatusEnum.optional(),
  industry: z.string().optional(),
  faculty_coordinator: z.string().optional(),
  branchId: z.string().uuid("Invalid branch ID").optional(),
});

export type CompanyQuery = z.infer<typeof CompanyQuerySchema>;
