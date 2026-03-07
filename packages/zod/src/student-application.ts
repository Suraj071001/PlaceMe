import { z } from "zod";

export const applyJobSchema = z.object({
  jobId: z.string().uuid("Invalid job ID"),
});

const optionalStringQuery = z.preprocess((value) => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}, z.string().optional());

const optionalNumberQuery = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? value : numeric;
}, z.number().nonnegative().optional());

const optionalDateQuery = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") return undefined;
  return new Date(String(value));
}, z.date().optional());

export const studentApplicationQuerySchema = z.object({
  search: optionalStringQuery,
  jobType: optionalStringQuery,
  status: optionalStringQuery,
  tier: optionalStringQuery,
  location: optionalStringQuery,
  minPackage: optionalNumberQuery,
  maxPackage: optionalNumberQuery,
  appliedFrom: optionalDateQuery,
  appliedTo: optionalDateQuery,
});

export type ApplyJobPayload = z.infer<typeof applyJobSchema>;
export type StudentApplicationQuery = z.infer<typeof studentApplicationQuerySchema>;
