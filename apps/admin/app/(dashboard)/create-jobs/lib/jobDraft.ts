export type JobDraft = {
  companyId?: string;
  companyName?: string;
  title?: string;
  role?: string;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP";
  tier?: "BASIC" | "STANDARD" | "DREAM";
  workMode?: string;
  ctc?: string;
  minimumCGPA?: number;
  passingYear?: number;
  applicationDeadline?: string; // ISO date string
  closeAt?: string; // ISO date string
  departmentId?: string;
  departmentNames?: string[];
  description?: string;
  additionalDetails?: Record<string, unknown>;
  google_chat?: boolean;
  email?: boolean;
  applicationForm?: {
    title: string;
    sections?: {
      title: string;
      order: number;
      description?: string | null;
      questions?: {
        label: string;
        type:
          | "SHORT_TEXT"
          | "LONG_TEXT"
          | "EMAIL"
          | "PHONE"
          | "YES_NO"
          | "CHECKBOX"
          | "MULTIPLE_CHOICE"
          | "DATE"
          | "FILE_UPLOAD"
          | "URL";
        order: number;
        required?: boolean;
        isPrivate?: boolean;
        description?: string | null;
        systemNote?: string | null;
        options?: { label: string; value: string }[];
      }[];
    }[];
  };
};

const STORAGE_KEY = "placeme:createJobDraft:v1";

export function loadJobDraft(): JobDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as JobDraft;
    return {};
  } catch {
    return {};
  }
}

export function saveJobDraft(draft: JobDraft) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearJobDraft() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

