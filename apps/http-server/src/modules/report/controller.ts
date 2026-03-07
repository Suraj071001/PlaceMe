import type { Request, Response } from "express";
import { getReportsService, generateReportService } from "./service";

export const getReportsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await getReportsService();
        res.status(200).json({ success: true, data: reports });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const generateReportController = async (req: Request, res: Response): Promise<void> => {
    try {
        const report = await generateReportService(req.body);
        res.status(201).json({ success: true, data: report });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
