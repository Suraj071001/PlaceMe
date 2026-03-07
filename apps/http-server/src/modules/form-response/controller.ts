import type { Request, Response } from "express";
import {
    submitFormResponseService,
    getFormResponseService
} from "./service";
import logger from "../../utils/logger";

export const submitFormResponseController = async (req: Request, res: Response) => {
    try {
        const studentId = (req as any).user.student.id;
        const result = await submitFormResponseService(studentId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error submitting form response:", error);
        res.status(400).json({ success: false, message: error.message || "Failed to submit form" });
    }
};

export const getFormResponseController = async (req: Request, res: Response) => {
    try {
        const studentId = (req as any).user.student.id;
        const result = await getFormResponseService(studentId, req.params.applicationId as string);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error fetching form response:", error);
        res.status(404).json({ success: false, message: error.message });
    }
};
