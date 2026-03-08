export type StudentJob = {
  id: string;
  company: string;
  role: string;
  salary: number;
  location: string;
  type: string;
  deadline: string;
  skills: string[];
  description: string;
  minCgpa: number;
  eligible: boolean;
  applied: boolean;
};

type BackendJob = {
  id: string;
  title?: string | null;
  role?: string | null;
  ctc?: string | null;
  location?: string | null;
  workMode?: string | null;
  employmentType?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "TEMPORARY" | "INTERNSHIP" | null;
  applicationDeadline?: string | null;
  closeAt?: string | null;
  minimumCGPA?: number | null;
  description?: string | null;
  additionalDetails?: unknown;
  company?: {
    name?: string | null;
  } | null;
};

type JobsResponse = {
  data?: BackendJob[];
};

type MyApplicationsResponse = {
  data?: Array<{
    jobId?: string;
    job?: {
      id?: string;
    };
  }>;
};

type StudentProfileResponse = {
  data?: {
    cgpa?: string | number | null;
  };
};

const API_BASE = typeof window !== "undefined" ? "http://localhost:5501/api/v1" : "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function parseSalaryLpa(ctc?: string | null): number {
  if (!ctc) return 0;
  const match = ctc.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function formatDeadline(value?: string | null): string {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEmploymentType(value?: BackendJob["employmentType"]): string {
  if (!value) return "N/A";
  switch (value) {
    case "FULL_TIME":
      return "Full-time";
    case "PART_TIME":
      return "Part-time";
    case "CONTRACT":
      return "Contract";
    case "TEMPORARY":
      return "Temporary";
    case "INTERNSHIP":
      return "Internship";
    default:
      return "N/A";
  }
}

function extractSkills(additionalDetails: unknown): string[] {
  if (!additionalDetails || typeof additionalDetails !== "object") return [];
  const details = additionalDetails as { skills?: unknown };
  if (!Array.isArray(details.skills)) return [];
  return details.skills.filter((skill): skill is string => typeof skill === "string");
}

function toNumberCgpa(raw: string | number | null | undefined): number | null {
  if (raw === null || raw === undefined) return null;
  const numeric = typeof raw === "number" ? raw : Number(raw);
  if (Number.isNaN(numeric)) return null;
  return numeric;
}

function mapJob(job: BackendJob, studentCgpa: number | null, appliedJobIds: Set<string>): StudentJob {
  const minCgpa = job.minimumCGPA ?? 0;
  const eligible = job.minimumCGPA == null ? true : studentCgpa != null ? studentCgpa >= job.minimumCGPA : false;

  return {
    id: job.id,
    company: job.company?.name ?? "Unknown Company",
    role: job.title || job.role || "Untitled Role",
    salary: parseSalaryLpa(job.ctc),
    location: job.location || job.workMode || "N/A",
    type: formatEmploymentType(job.employmentType),
    deadline: formatDeadline(job.applicationDeadline || job.closeAt),
    skills: extractSkills(job.additionalDetails),
    description: job.description || "No description provided",
    minCgpa,
    eligible,
    applied: appliedJobIds.has(job.id),
  };
}

async function fetchStudentCgpa(token: string): Promise<number | null> {
  const res = await fetch(`${API_BASE}/student/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  const body = (await res.json()) as StudentProfileResponse;
  return toNumberCgpa(body.data?.cgpa);
}

async function fetchJobs(token: string): Promise<BackendJob[]> {
  const query = new URLSearchParams({ page: "1", limit: "100", status: "ACTIVE" });
  const res = await fetch(`${API_BASE}/job?${query.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    let message = "Failed to load jobs";
    try {
      const body = await res.json();
      if (typeof body?.message === "string") message = body.message;
      if (typeof body?.error === "string") message = body.error;
    } catch {
      // ignore JSON parse errors and use generic message
    }
    throw new Error(message);
  }

  const body = (await res.json()) as JobsResponse;
  return body.data ?? [];
}

async function fetchAppliedJobIds(token: string): Promise<Set<string>> {
  const res = await fetch(`${API_BASE}/student-application/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return new Set<string>();

  const body = (await res.json()) as MyApplicationsResponse;
  const ids = (body.data ?? [])
    .map((application) => application.jobId ?? application.job?.id)
    .filter((jobId): jobId is string => Boolean(jobId));

  return new Set(ids);
}

export async function getStudentJobs(): Promise<StudentJob[]> {
  const token = getToken();
  if (!token) return [];

  const [jobs, studentCgpa, appliedJobIds] = await Promise.all([
    fetchJobs(token),
    fetchStudentCgpa(token),
    fetchAppliedJobIds(token),
  ]);

  return jobs.map((job) => mapJob(job, studentCgpa, appliedJobIds));
}
