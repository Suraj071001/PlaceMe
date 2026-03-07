import type { StudentResumeProfile, ResumeTemplateId } from "./resume-data";

export type UpdateResumeProfilePayload = {
  cgpa?: string;
  skills?: string[];
  education?: { degree: string; institution: string; year: string }[];
  experience?: {
    role: string;
    company: string;
    duration: string;
    points: string[];
  }[];
  projects?: { name: string; description: string; tech: string }[];
};

export type GenerateAiResumePayload = {
  targetRole: string;
  targetCompany?: string;
  tone: "concise" | "impact" | "ats";
  includeProjects: boolean;
  includeExperience: boolean;
  extraContext?: string;
};

export type GeneratedAiResume = {
  cgpa: string;
  skills: string[];
  education: { degree: string; institution: string; year: string }[];
  experience: { role: string; company: string; duration: string; points: string[] }[];
  projects: { name: string; description: string; tech: string }[];
};

const API_BASE = typeof window !== "undefined" ? "http://localhost:5501/api/v1" : "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export type ResumeListItem = {
  id: string;
  templateId: string;
  name: string | null;
  createdAt: string;
};

export async function getResumeProfile(): Promise<StudentResumeProfile | null> {
  const token = getToken();
  if (!token) {
    throw new Error("Login token missing. Please login again.");
  }
  const res = await fetch(`${API_BASE}/student/resume-profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    let message = `Failed to load resume profile (${res.status})`;
    try {
      const json = await res.json();
      if (typeof json?.message === "string" && json.message.trim()) {
        message = json.message;
      } else if (typeof json?.error === "string" && json.error.trim()) {
        message = json.error;
      }
    } catch {
      const text = await res.text();
      if (text.trim()) {
        message = text.slice(0, 400);
      }
    }
    throw new Error(message);
  }
  return res.json();
}

export async function updateResumeProfile(payload: UpdateResumeProfilePayload): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(`${API_BASE}/student/resume-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

export async function generateAiResume(payload: GenerateAiResumePayload): Promise<GeneratedAiResume | null> {
  const token = getToken();
  if (!token) {
    throw new Error("Login token missing. Please login again.");
  }
  const res = await fetch(`${API_BASE}/student/resume/ai-generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let message = `AI generation failed (${res.status})`;
    try {
      const json = await res.json();
      if (typeof json?.message === "string" && json.message.trim()) {
        message = json.message;
      }
    } catch {
      const text = await res.text();
      if (text.trim()) {
        message = text.slice(0, 400);
      }
    }
    throw new Error(message);
  }
  const data = await res.json();
  if (!data?.data) {
    throw new Error("AI response payload missing.");
  }
  return data.data as GeneratedAiResume;
}

export async function downloadResumePdf(templateId: ResumeTemplateId): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(`${API_BASE}/student/resume/generate-pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ templateId }),
  });
  if (!res.ok) {
    try {
      const json = await res.json();
      throw new Error(json?.message || json?.error || `Failed to generate PDF (${res.status})`);
    } catch {
      throw new Error(`Failed to generate PDF (${res.status})`);
    }
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-${templateId}-${Date.now()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}

export async function uploadResumeFile(file: File): Promise<void> {
  const token = getToken();
  if (!token) throw new Error("Login token missing. Please login again.");
  const form = new FormData();
  form.append("resume", file);
  const res = await fetch(`${API_BASE}/student/resumes/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  if (!res.ok) {
    let message = `Failed to upload resume (${res.status})`;
    try {
      const json = await res.json();
      message = json?.message || json?.error || message;
    } catch {}
    throw new Error(message);
  }
}

export async function listResumes(): Promise<ResumeListItem[]> {
  const token = getToken();
  if (!token) return [];
  const res = await fetch(`${API_BASE}/student/resumes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((r: { id: string; templateId: string; name: string | null; createdAt: string }) => ({
    ...r,
    createdAt: r.createdAt,
  }));
}

/** Fetch resume PDF and return blob URL (call URL.revokeObjectURL when done). */
export async function fetchResumeFileUrl(id: string): Promise<string | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_BASE}/student/resumes/${id}/file`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/** Open resume PDF in new tab. */
export async function openResumeInNewTab(id: string): Promise<boolean> {
  const url = await fetchResumeFileUrl(id);
  if (!url) return false;
  window.open(url, "_blank");
  return true;
}

/** Download resume PDF. */
export async function downloadResumeById(id: string, filename?: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  const res = await fetch(`${API_BASE}/student/resumes/${id}/file`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return false;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename ?? `resume-${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
