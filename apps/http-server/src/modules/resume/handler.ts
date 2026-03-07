import type { Application } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { zodValidator } from "../../middlewares/zodValidator";
import { GenerateResumeAiSchema, GenerateResumePdfSchema, UpdateResumeProfileSchema } from "@repo/zod";
import multer from "multer";
import {
  getResumeProfileController,
  updateResumeProfileController,
  generateResumePdfController,
  generateAiResumeController,
  uploadResumeFileController,
  listResumesController,
  getResumeFileController,
} from "./controller";
import { ROUTES } from "../../constants/routes";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

export const resumeRoutes = (app: Application) => {
  app.get(ROUTES.RESUME.PROFILE, authMiddleware, getResumeProfileController);
  app.put(ROUTES.RESUME.PROFILE, authMiddleware, zodValidator(UpdateResumeProfileSchema), updateResumeProfileController);
  app.post(ROUTES.RESUME.GENERATE_PDF, authMiddleware, zodValidator(GenerateResumePdfSchema), generateResumePdfController);
  app.post(ROUTES.RESUME.AI_GENERATE, authMiddleware, zodValidator(GenerateResumeAiSchema), generateAiResumeController);
  app.get(ROUTES.RESUME.RESUMES_LIST, authMiddleware, listResumesController);
  app.post(ROUTES.RESUME.UPLOAD_FILE, authMiddleware, upload.single("resume"), uploadResumeFileController);
  app.get(ROUTES.RESUME.RESUME_FILE, authMiddleware, getResumeFileController);
};
