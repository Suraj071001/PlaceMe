import type { Request, Response } from "express";
import {
  getApplicationFormResponseService,
  getJobApplicationsByStageService,
  updateApplicationStageService,
} from "./service";

export const getJobApplicationsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const jobId = req.params.jobId as string;
    const { branch, batch, stage, status } = req.query as {
      branch?: string;
      batch?: string;
      stage?: string;
      status?: string;
    };
    const applications = await getJobApplicationsByStageService(jobId, {
      branch,
      batch,
      stage,
      status,
    });
    res.status(200).json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplicationStageController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const stageId = req.body.stageId as string;
    const status = req.body.status as string | undefined;

    const application = await updateApplicationStageService(
      id,
      stageId,
      status,
    );
    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationFormResponseController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const applicationId = req.params.id as string;
    const response = await getApplicationFormResponseService(applicationId);
    res.status(200).json({ success: true, data: response });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};
