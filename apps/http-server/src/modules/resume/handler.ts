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
  app.get(ROUTES.STUDENT.RESUME_PROFILE, authMiddleware, getResumeProfileController);
  app.put(ROUTES.STUDENT.RESUME_PROFILE, authMiddleware, zodValidator(UpdateResumeProfileSchema), updateResumeProfileController);
  app.post(ROUTES.STUDENT.RESUME_GENERATE_PDF, authMiddleware, zodValidator(GenerateResumePdfSchema), generateResumePdfController);
  app.get(ROUTES.STUDENT.RESUMES_LIST, authMiddleware, listResumesController);
  app.get(ROUTES.STUDENT.RESUME_FILE, authMiddleware, getResumeFileController);
};
