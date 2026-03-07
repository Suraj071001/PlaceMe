import { z } from "zod";

export const ResumeTemplateIdSchema = z.enum(["modern", "classic", "minimal", "professional", "nit"]);
export type ResumeTemplateId = z.infer<typeof ResumeTemplateIdSchema>;

export const ResumeEducationEntrySchema = z.object({
  degree: z.string(),
  institution: z.string(),
  year: z.string(),
});

export const ResumeExperienceEntrySchema = z.object({
  role: z.string(),
  company: z.string(),
  duration: z.string(),
  points: z.array(z.string()),
});

export const ResumeProjectEntrySchema = z.object({
  name: z.string(),
  description: z.string(),
  tech: z.string(),
});

export const UpdateResumeProfileSchema = z.object({
  cgpa: z.string().optional(),
  skills: z.array(z.string()).optional(),
  education: z.array(ResumeEducationEntrySchema).optional(),
  experience: z.array(ResumeExperienceEntrySchema).optional(),
  projects: z.array(ResumeProjectEntrySchema).optional(),
});

export const GenerateResumePdfSchema = z.object({
  templateId: ResumeTemplateIdSchema,
});

export const GenerateResumeAiSchema = z.object({
  targetRole: z.string().min(2).max(120),
  targetCompany: z.string().max(120).optional(),
  tone: z.enum(["concise", "impact", "ats"]).default("impact"),
  includeProjects: z.boolean().default(true),
  includeExperience: z.boolean().default(true),
  extraContext: z.string().max(3000).optional(),
});

export type UpdateResumeProfilePayload = z.infer<typeof UpdateResumeProfileSchema>;
export type GenerateResumePdfPayload = z.infer<typeof GenerateResumePdfSchema>;
export type GenerateResumeAiPayload = z.infer<typeof GenerateResumeAiSchema>;
