import type { Request, Response } from "express";
import { studentApplicationQuerySchema } from "@repo/zod";
import { applyJobService, getApplicationByIdService, getJobApplicationFormService, getMyApplicationsService } from "./service";
import logger from "../../utils/logger";
import { getAuthenticatedStudentId } from "../../utils/student-auth";

export const applyJobController = async (req: Request, res: Response) => {
  try {
    const studentId = await getAuthenticatedStudentId(req);
    const result = await applyJobService(studentId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    logger.error("Error applying for job:", error);
    res.status(400).json({ success: false, message: error.message || "Failed to apply for job" });
  }
};

export const getApplicationByIdController = async (req: Request, res: Response) => {
  try {
    const studentId = await getAuthenticatedStudentId(req);
    const result = await getApplicationByIdService(req.params.id as string, studentId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error("Error fetching application:", error);
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getMyApplicationsController = async (req: Request, res: Response) => {
  try {
    const studentId = await getAuthenticatedStudentId(req);
    const filters = studentApplicationQuerySchema.parse(req.query);
    const result = await getMyApplicationsService(studentId, filters);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error("Error fetching applications:", error);
    res.status(400).json({ success: false, message: error.message || "Failed to fetch applications" });
  }
};

export const getJobApplicationFormController = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId as string;
    const result = await getJobApplicationFormService(jobId);
    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    logger.error("Error fetching job application form:", error);
    res.status(400).json({ success: false, message: error.message || "Failed to fetch job form" });
  }
};
