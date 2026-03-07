import type { Request, Response } from "express";
import {
    submitFormResponseService,
    getFormResponseService
} from "./service";
import logger from "../../utils/logger";

export const submitFormResponseController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const result = await submitFormResponseService(userId, req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error submitting form response:", error);
        res.status(400).json({ success: false, message: error.message || "Failed to submit form" });
    }
};

export const getFormResponseController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const result = await getFormResponseService(userId, req.params.applicationId as string);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        logger.error("Error fetching form response:", error);
        res.status(404).json({ success: false, message: error.message });
    }
};
