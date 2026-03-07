import type { Request, Response } from "express";
import {
    applyJobService,
    getApplicationByIdService,
    getMyApplicationsService
} from "./service";
import logger from "../../utils/logger";

export const applyJobController = async (req: Request, res: Response) => {
    try {
        const studentId = (req as any).user.student.id;
        const result = await applyJobService(studentId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error applying for job:", error);
        res.status(400).json({ success: false, message: error.message || "Failed to apply for job" });
    }
};

export const getApplicationByIdController = async (req: Request, res: Response) => {
    try {
        const studentId = (req as any).user.student.id;
        const result = await getApplicationByIdService(req.params.id as string, studentId);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error fetching application:", error);
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getMyApplicationsController = async (req: Request, res: Response) => {
    try {
        const studentId = (req as any).user.student.id;
        const result = await getMyApplicationsService(studentId);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error fetching applications:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
