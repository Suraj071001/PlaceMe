import type { Request, Response } from "express";
import {
    createApplicationFormService,
    getApplicationFormsService,
    getApplicationFormByIdService,
    updateApplicationFormService,
    deleteApplicationFormService,
} from "./service";
import logger from "../../utils/logger";
import { ApplicationFormQuerySchema } from "@repo/zod";
import { ERROR, SUCCESS } from "../../constants";

export const createApplicationFormController = async (req: Request, res: Response) => {
    try {
        const data = await createApplicationFormService(req.body);
        res.status(201).json({ message: SUCCESS.RESOURCE_CREATED, data });
    } catch (error: any) {
        logger.error("Error creating application form", { error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const getApplicationFormsController = async (req: Request, res: Response) => {
    try {
        const query = ApplicationFormQuerySchema.parse({
            ...req.query,
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
        });
        const result = await getApplicationFormsService(query);
        res.status(200).json({ message: SUCCESS.DATA_FETCHED, ...result });
    } catch (error: any) {
        logger.error("Error fetching application forms", { error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const getApplicationFormByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const data = await getApplicationFormByIdService(req.params.id);
        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data });
    } catch (error: any) {
        logger.error("Error fetching application form", { error: error.message });
        res.status(404).json({ error: error.message });
    }
};

export const updateApplicationFormController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const data = await updateApplicationFormService(req.params.id, req.body);
        res.status(200).json({ message: SUCCESS.RESOURCE_UPDATED, data });
    } catch (error: any) {
        logger.error("Error updating application form", { error: error.message });
        res.status(400).json({ error: error.message });
    }
};

export const deleteApplicationFormController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const data = await deleteApplicationFormService(req.params.id);
        res.status(200).json({ message: SUCCESS.RESOURCE_DELETED, data });
    } catch (error: any) {
        logger.error("Error deleting application form", { error: error.message });
        res.status(400).json({ error: error.message });
    }
};
