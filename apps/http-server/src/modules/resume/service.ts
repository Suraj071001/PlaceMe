import { mkdir } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import {
  getStudentByUserId,
  updateStudentResume,
  createResume,
  getResumesByStudentId,
  getResumeById,
  type ResumeDataJson,
} from "./dao";
import { getResumeHtml, type ResumeProfile, type ResumeTemplateId } from "./resume-html";

const RESUME_UPLOADS_DIR = path.join(process.cwd(), "uploads", "resumes");

function buildProfileFromStudent(student: {
  user: { firstName: string | null; lastName: string | null; email: string; phone: string | null };
  enrollment: string;
  branch: { name: string };
  batch: { name: string };
  email: string | null;
  cgpa: string | null;
  resumeData: unknown;
}): ResumeProfile {
  const rd = (student.resumeData as ResumeDataJson) || {};
  const fullName = [student.user.firstName, student.user.lastName].filter(Boolean).join(" ") || student.user.email;
  const year = student.batch?.name ?? "—";
  return {
    fullName,
    email: student.user.email,
    phone: student.user.phone ?? "",
    rollNumber: student.enrollment,
    branch: student.branch?.name ?? "",
    year,
    cgpa: student.cgpa ?? "",
    skills: rd.skills ?? [],
    education: rd.education ?? [],
    experience: rd.experience ?? [],
    projects: rd.projects ?? [],
  };
}

export async function getResumeProfileForUser(userId: string): Promise<ResumeProfile | null> {
  const student = await getStudentByUserId(userId);
  if (!student) return null;
  return buildProfileFromStudent(student as any);
}

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

export async function updateResumeProfileForUser(userId: string, payload: UpdateResumeProfilePayload): Promise<boolean> {
  const student = await getStudentByUserId(userId);
  if (!student) return false;
  const existing = (student.resumeData as ResumeDataJson) || {};
  const resumeData: ResumeDataJson = {
    skills: payload.skills ?? existing.skills,
    education: payload.education ?? existing.education,
    experience: payload.experience ?? existing.experience,
    projects: payload.projects ?? existing.projects,
  };
  await updateStudentResume(student.id, {
    ...(payload.cgpa !== undefined && { cgpa: payload.cgpa }),
    resumeData,
  });
  return true;
}

export async function generateResumePdf(userId: string, templateId: ResumeTemplateId): Promise<Buffer | null> {
  const student = await getStudentByUserId(userId);
  if (!student) return null;
  const profile = buildProfileFromStudent(student as any);
  const html = getResumeHtml(profile, templateId);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  let pdfBuffer: Buffer;
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
    });
    pdfBuffer = Buffer.from(pdf);
  } finally {
    await browser.close();
  }

  const studentId = student.id;
  const relativePath = path.join(studentId, `${crypto.randomUUID()}.pdf`);
  const fullPath = path.join(RESUME_UPLOADS_DIR, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await Bun.write(fullPath, pdfBuffer);

  const templateName = templateId.charAt(0).toUpperCase() + templateId.slice(1);
  const name = `Resume - ${templateName} - ${new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;
  await createResume({
    studentId,
    templateId,
    filePath: relativePath,
    name,
  });

  return pdfBuffer;
}

export async function listResumesForUser(userId: string): Promise<{ id: string; templateId: string; name: string | null; createdAt: Date }[]> {
  const student = await getStudentByUserId(userId);
  if (!student) return [];
  const resumes = await getResumesByStudentId(student.id);
  return resumes.map((r: { id: string; templateId: string; name: string | null; createdAt: Date }) => ({
    id: r.id,
    templateId: r.templateId,
    name: r.name,
    createdAt: r.createdAt,
  }));
}

export async function getResumeFilePathForUser(userId: string, resumeId: string): Promise<string | null> {
  const resume = await getResumeById(resumeId);
  if (!resume) return null;
  const student = await getStudentByUserId(userId);
  if (!student || resume.studentId !== student.id) return null;
  return path.join(RESUME_UPLOADS_DIR, resume.filePath);
}
