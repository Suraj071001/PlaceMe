import type { Request, Response } from "express";
import { existsSync } from "fs";
import {
  getResumeProfileForUser,
  updateResumeProfileForUser,
  generateResumePdf,
  generateAiResumeForUser,
  uploadResumeFileForUser,
  listResumesForUser,
  downloadResumeFromBunny,
  getLocalResumePath,
  getResumeFilePathForUser,
} from "./service";
import type { UpdateResumeProfilePayload, GenerateResumePdfPayload, GenerateResumeAiPayload } from "@repo/zod";

export async function getResumeProfileController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const profile = await getResumeProfileForUser(userId);
  if (!profile) {
    return res.status(403).json({ message: "Student profile not found" });
  }
  return res.status(200).json(profile);
}

export async function updateResumeProfileController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const payload = req.body as UpdateResumeProfilePayload;
  const ok = await updateResumeProfileForUser(userId, payload);
  if (!ok) {
    return res.status(403).json({ message: "Student profile not found" });
  }
  return res.status(200).json({ message: "Resume profile updated" });
}

export async function generateResumePdfController(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { templateId } = req.body as GenerateResumePdfPayload;
    const pdf = await generateResumePdf(userId, templateId);
    if (!pdf) {
      return res.status(403).json({ message: "Student profile not found" });
    }
    const filename = `resume-${templateId}-${Date.now()}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(pdf);
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message || "Failed to generate resume PDF",
    });
  }
}

export async function listResumesController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const list = await listResumesForUser(userId);
  return res.status(200).json(list);
}

export async function generateAiResumeController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const payload = req.body as GenerateResumeAiPayload;
    const generated = await generateAiResumeForUser(userId, payload);
    if (!generated) {
      return res.status(403).json({ message: "Student profile not found" });
    }
    return res.status(200).json({ success: true, data: generated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message || "AI generation failed" });
  }
}

export async function uploadResumeFileController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Resume file is required" });
  }
  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({ message: "Only PDF files are allowed" });
  }

  try {
    const ok = await uploadResumeFileForUser(userId, file.buffer, file.originalname);
    if (!ok) {
      return res.status(403).json({ message: "Student profile not found" });
    }
    return res.status(201).json({ message: "Resume uploaded successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error?.message || "Failed to upload resume" });
  }
}

export async function getResumeFileController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "Resume id required" });
  const filePath = await getResumeFilePathForUser(userId, id);
  if (!filePath) {
    return res.status(404).json({ message: "Resume not found" });
  }

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    const remoteRes = await fetch(filePath);
    if (remoteRes.ok) {
      const contentType = remoteRes.headers.get("content-type") || "application/pdf";
      const fileBuffer = Buffer.from(await remoteRes.arrayBuffer());
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `inline; filename="resume-${id}.pdf"`);
      return res.send(fileBuffer);
    }

    const bunnyBuffer = await downloadResumeFromBunny(filePath);
    if (bunnyBuffer) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="resume-${id}.pdf"`);
      return res.send(bunnyBuffer);
    }
    return res.status(404).json({ message: "Resume file not found on CDN/storage" });
  }

  const localFilePath = getLocalResumePath(filePath);
  if (existsSync(localFilePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="resume-${id}.pdf"`);
    return res.sendFile(localFilePath);
  }

  const bunnyBuffer = await downloadResumeFromBunny(filePath);
  if (!bunnyBuffer) {
    return res.status(404).json({ message: "Resume not found" });
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="resume-${id}.pdf"`);
  return res.send(bunnyBuffer);
}
