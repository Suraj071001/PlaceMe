import type { StudentResumeProfile, ResumeTemplateId } from "./resume-data";

const API_BASE = typeof window !== "undefined" ? "http://localhost:5000/api/v1" : "";

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
  if (!token) return null;
  const res = await fetch(`${API_BASE}/student/resume-profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
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
  if (!res.ok) return false;
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-${templateId}-${Date.now()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
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
