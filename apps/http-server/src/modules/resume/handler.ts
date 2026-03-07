import type { Application } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { zodValidator } from "../../middlewares/zodValidator";
import { GenerateResumePdfSchema, UpdateResumeProfileSchema } from "@repo/zod";
import {
  getResumeProfileController,
  updateResumeProfileController,
  generateResumePdfController,
  listResumesController,
  getResumeFileController,
} from "./controller";
import { ROUTES } from "../../constants/routes";

export const resumeRoutes = (app: Application) => {
  app.get(ROUTES.RESUME.PROFILE, authMiddleware, getResumeProfileController);
  app.put(ROUTES.RESUME.PROFILE, authMiddleware, zodValidator(UpdateResumeProfileSchema), updateResumeProfileController);
  app.post(ROUTES.RESUME.GENERATE_PDF, authMiddleware, zodValidator(GenerateResumePdfSchema), generateResumePdfController);
  app.get(ROUTES.RESUME.RESUMES_LIST, authMiddleware, listResumesController);
  app.get(ROUTES.RESUME.RESUME_FILE, authMiddleware, getResumeFileController);
};
