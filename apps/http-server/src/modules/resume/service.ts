import { mkdir } from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import * as BunnyStorageSDK from "@bunny.net/storage-sdk";
import {
  getOrCreateStudentByUserId,
  updateStudentResume,
  createResume,
  getResumesByStudentId,
  getResumeById,
  type ResumeDataJson,
} from "./dao";
import { getResumeHtml, type ResumeProfile, type ResumeTemplateId } from "./resume-html";
import type { GenerateResumeAiPayload } from "@repo/zod";

const RESUME_UPLOADS_DIR = path.join(process.cwd(), "uploads", "resumes");

type BunnyConfig = {
  zone: string;
  accessKey: string;
  cdnBaseUrl: string;
  region: BunnyStorageSDK.regions.StorageRegion;
};

function mapStorageRegion(regionRaw: string | undefined): BunnyStorageSDK.regions.StorageRegion {
  const region = (regionRaw || "de").trim().toLowerCase();
  if (region === "de" || region === "falkenstein") return BunnyStorageSDK.regions.StorageRegion.Falkenstein;
  if (region === "uk" || region === "london") return BunnyStorageSDK.regions.StorageRegion.London;
  if (region === "ny" || region === "newyork" || region === "new-york") return BunnyStorageSDK.regions.StorageRegion.NewYork;
  if (region === "la" || region === "losangeles" || region === "los-angeles") return BunnyStorageSDK.regions.StorageRegion.LosAngeles;
  if (region === "sg" || region === "singapore") return BunnyStorageSDK.regions.StorageRegion.Singapore;
  if (region === "se" || region === "stockholm") return BunnyStorageSDK.regions.StorageRegion.Stockholm;
  if (region === "br" || region === "saopaulo" || region === "sao-paulo") return BunnyStorageSDK.regions.StorageRegion.SaoPaulo;
  if (region === "jh" || region === "johannesburg") return BunnyStorageSDK.regions.StorageRegion.Johannesburg;
  if (region === "syd" || region === "sydney") return BunnyStorageSDK.regions.StorageRegion.Sydney;
  return BunnyStorageSDK.regions.StorageRegion.Falkenstein;
}

function getBunnyConfig(): BunnyConfig | null {
  const zone = process.env.BUNNY_STORAGE_ZONE?.trim();
  const accessKey = process.env.BUNNY_STORAGE_ACCESS_KEY?.trim();
  const cdnBaseUrl = process.env.BUNNY_CDN_BASE_URL?.trim();
  const storageRegion = process.env.BUNNY_STORAGE_REGION?.trim();

  if (!zone || !accessKey || !cdnBaseUrl) return null;
  return { zone, accessKey, cdnBaseUrl, region: mapStorageRegion(storageRegion) };
}

async function uploadResumeToBunny(relativePath: string, pdfBuffer: Buffer): Promise<string | null> {
  const bunny = getBunnyConfig();
  if (!bunny) return null;

  const normalizedPath = `/${relativePath.replace(/^\/+/, "")}`;
  const storageZone = BunnyStorageSDK.zone.connect_with_accesskey(
    bunny.region,
    bunny.zone,
    bunny.accessKey
  );
  const uploadStream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new Uint8Array(pdfBuffer));
      controller.close();
    },
  });

  try {
    await BunnyStorageSDK.file.upload(
      storageZone,
      normalizedPath,
      uploadStream,
      { contentType: "application/pdf" }
    );
  } catch (error: any) {
    throw new Error(`Bunny upload failed: ${error?.message || "unknown error"}`);
  }

  const cdnBase = bunny.cdnBaseUrl.replace(/\/+$/, "");
  return `${cdnBase}${normalizedPath}`;
}

type AiGeneratedResume = {
  cgpa: string;
  skills: string[];
  education: { degree: string; institution: string; year: string }[];
  experience: { role: string; company: string; duration: string; points: string[] }[];
  projects: { name: string; description: string; tech: string }[];
};

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
  const student = await getOrCreateStudentByUserId(userId);
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
  const student = await getOrCreateStudentByUserId(userId);
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
  const student = await getOrCreateStudentByUserId(userId);
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
  const storedFilePath = await persistResumeBuffer(studentId, pdfBuffer);

  const templateName = templateId.charAt(0).toUpperCase() + templateId.slice(1);
  const name = `Resume - ${templateName} - ${new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" })}`;
  await createResume({
    studentId,
    templateId,
    filePath: storedFilePath,
    name,
  });

  return pdfBuffer;
}

async function persistResumeBuffer(studentId: string, fileBuffer: Buffer): Promise<string> {
  const relativePath = `${studentId}/${crypto.randomUUID()}.pdf`;
  const bunnyFileUrl = await uploadResumeToBunny(relativePath, fileBuffer);
  if (bunnyFileUrl) {
    return bunnyFileUrl;
  }

  const fullPath = path.join(RESUME_UPLOADS_DIR, relativePath);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await Bun.write(fullPath, fileBuffer);
  return relativePath;
}

export async function uploadResumeFileForUser(
  userId: string,
  fileBuffer: Buffer,
  originalName: string
): Promise<boolean> {
  const student = await getOrCreateStudentByUserId(userId);
  if (!student) return false;

  const filePath = await persistResumeBuffer(student.id, fileBuffer);
  await createResume({
    studentId: student.id,
    templateId: "uploaded",
    filePath,
    name: originalName ? `Uploaded - ${originalName.replace(/\.pdf$/i, "")}` : "Uploaded Resume",
  });
  return true;
}

export async function listResumesForUser(userId: string): Promise<{ id: string; templateId: string; name: string | null; createdAt: Date }[]> {
  const student = await getOrCreateStudentByUserId(userId);
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
  const student = await getOrCreateStudentByUserId(userId);
  if (!student || resume.studentId !== student.id) return null;
  return resume.filePath;
}

export function getLocalResumePath(storedPath: string): string {
  return path.join(RESUME_UPLOADS_DIR, storedPath);
}

export async function downloadResumeFromBunny(storedPath: string): Promise<Buffer | null> {
  const bunny = getBunnyConfig();
  if (!bunny) return null;

  let objectPath = storedPath;
  if (storedPath.startsWith("http://") || storedPath.startsWith("https://")) {
    try {
      objectPath = new URL(storedPath).pathname;
    } catch {
      objectPath = storedPath;
    }
  }

  const normalizedPath = `/${objectPath.replace(/^\/+/, "")}`;
  const storageZone = BunnyStorageSDK.zone.connect_with_accesskey(
    bunny.region,
    bunny.zone,
    bunny.accessKey
  );

  try {
    const { stream } = await BunnyStorageSDK.file.download(storageZone, normalizedPath);
    const arr = await new Response(stream).arrayBuffer();
    return Buffer.from(arr);
  } catch {
    return null;
  }
}

function coerceStringArray(value: unknown, maxItems: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => (typeof v === "string" ? v.trim() : ""))
    .filter(Boolean)
    .slice(0, maxItems);
}

function sanitizeAiResume(raw: any, fallback: ResumeProfile): AiGeneratedResume {
  return {
    cgpa: typeof raw?.cgpa === "string" && raw.cgpa.trim() ? raw.cgpa.trim() : fallback.cgpa,
    skills: coerceStringArray(raw?.skills, 24),
    education: Array.isArray(raw?.education)
      ? raw.education
          .map((e: any) => ({
            degree: String(e?.degree ?? "").trim(),
            institution: String(e?.institution ?? "").trim(),
            year: String(e?.year ?? "").trim(),
          }))
          .filter((e: any) => e.degree || e.institution || e.year)
          .slice(0, 6)
      : fallback.education,
    experience: Array.isArray(raw?.experience)
      ? raw.experience
          .map((e: any) => ({
            role: String(e?.role ?? "").trim(),
            company: String(e?.company ?? "").trim(),
            duration: String(e?.duration ?? "").trim(),
            points: coerceStringArray(e?.points, 6),
          }))
          .filter((e: any) => e.role || e.company || e.duration || e.points.length > 0)
          .slice(0, 6)
      : fallback.experience,
    projects: Array.isArray(raw?.projects)
      ? raw.projects
          .map((p: any) => ({
            name: String(p?.name ?? "").trim(),
            description: String(p?.description ?? "").trim(),
            tech: String(p?.tech ?? "").trim(),
          }))
          .filter((p: any) => p.name || p.description || p.tech)
          .slice(0, 8)
      : fallback.projects,
  };
}

function extractJsonObject(text: string): any {
  const cleaned = text.trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI did not return valid JSON");
    return JSON.parse(match[0]);
  }
}

export async function generateAiResumeForUser(
  userId: string,
  payload: GenerateResumeAiPayload
): Promise<AiGeneratedResume | null> {
  const student = await getOrCreateStudentByUserId(userId);
  if (!student) return null;

  const openAiApiKey = process.env.OPENAI_API_KEY;
  if (!openAiApiKey) {
    throw new Error("OPENAI_API_KEY is missing on server");
  }

  const profile = buildProfileFromStudent(student as any);
  const model = process.env.OPENAI_RESUME_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini";

  const system = [
    "You are an elite resume strategist and ATS optimization expert.",
    "You only return strict JSON with no markdown.",
    "Maximize interview conversion while staying truthful to provided profile details.",
    "Write concise, quantified, impact-focused bullet points.",
  ].join(" ");

  const user = JSON.stringify(
    {
      task: "Generate polished resume content for a student.",
      tone: payload.tone,
      targetRole: payload.targetRole,
      targetCompany: payload.targetCompany ?? "",
      includeProjects: payload.includeProjects,
      includeExperience: payload.includeExperience,
      extraContext: payload.extraContext ?? "",
      profile,
      outputSchema: {
        cgpa: "string",
        skills: ["string"],
        education: [{ degree: "string", institution: "string", year: "string" }],
        experience: [{ role: "string", company: "string", duration: "string", points: ["string"] }],
        projects: [{ name: "string", description: "string", tech: "string" }],
      },
      rules: [
        "Do not invent employers or projects not implied by profile/context.",
        "Rephrase and strengthen language, keep facts plausible.",
        "Each experience bullet should be <= 20 words and action-oriented.",
        "Prioritize ATS keywords for target role.",
      ],
    },
    null,
    2
  );

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiApiKey}`,
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.45,
      max_tokens: 1800,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${details}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Invalid OpenAI response content");
  }

  const parsed = extractJsonObject(content);
  const sanitized = sanitizeAiResume(parsed, profile);
  return {
    ...sanitized,
    experience: payload.includeExperience ? sanitized.experience : [],
    projects: payload.includeProjects ? sanitized.projects : [],
  };
}
