import type { Request, Response } from "express";
import {
    applyJobService,
    getApplicationByIdService,
    getMyApplicationsService,
    getJobApplicationFormService,
} from "./service";
import logger from "../../utils/logger";

export const applyJobController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const result = await applyJobService(userId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error applying for job:", error);
        res.status(400).json({ success: false, message: error.message || "Failed to apply for job" });
    }
};

export const getApplicationByIdController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const result = await getApplicationByIdService(req.params.id as string, userId);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error fetching application:", error);
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getMyApplicationsController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const result = await getMyApplicationsService(userId);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error fetching applications:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
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
