import type { Request, Response } from "express";
import { getIntegrationsService, connectIntegrationService, disconnectIntegrationService } from "./service";

export const getIntegrationsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const integrations = await getIntegrationsService();
        res.status(200).json({ success: true, data: integrations });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const connectIntegrationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const provider = req.params.provider as string;
        const result = await connectIntegrationService(provider, req.body);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const disconnectIntegrationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const provider = req.params.provider as string;
        const result = await disconnectIntegrationService(provider);
        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
