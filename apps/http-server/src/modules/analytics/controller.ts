import type { Request, Response } from "express";
import { getStatsService, getDepartmentsAnalyticsService, getRecentActivityService, getUpcomingEventsService } from "./service";

export const getStatsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const stats = await getStatsService(req.query);
        res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDepartmentsAnalyticsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getDepartmentsAnalyticsService(req.query);
        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getRecentActivityController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getRecentActivityService();
        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUpcomingEventsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getUpcomingEventsService();
        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
