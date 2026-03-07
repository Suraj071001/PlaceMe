import type { Request, Response } from "express";
import { existsSync } from "fs";
import {
  getResumeProfileForUser,
  updateResumeProfileForUser,
  generateResumePdf,
  listResumesForUser,
  getResumeFilePathForUser,
} from "./service";
import type { UpdateResumeProfilePayload, GenerateResumePdfPayload } from "@repo/zod";

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
}

export async function listResumesController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const list = await listResumesForUser(userId);
  return res.status(200).json(list);
}

export async function getResumeFileController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const id = req.params.id as string;
  if (!id) return res.status(400).json({ message: "Resume id required" });
  const filePath = await getResumeFilePathForUser(userId, id);
  if (!filePath || !existsSync(filePath)) {
    return res.status(404).json({ message: "Resume not found" });
  }
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="resume-${id}.pdf"`);
  return res.sendFile(filePath);
}
