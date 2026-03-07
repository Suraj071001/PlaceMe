import type { Request, Response } from "express";
import { getJobApplicationsByStageService, updateApplicationStageService } from "./service";

export const getJobApplicationsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const jobId = req.params.jobId as string;
        const applications = await getJobApplicationsByStageService(jobId);
        res.status(200).json({ success: true, data: applications });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateApplicationStageController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const stageId = req.body.stageId as string;
        const status = req.body.status as string | undefined;

        const application = await updateApplicationStageService(id, stageId, status);
        res.status(200).json({ success: true, data: application });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
