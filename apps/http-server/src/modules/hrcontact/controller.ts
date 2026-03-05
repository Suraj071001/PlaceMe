import { type Request, type Response } from "express";
import { CreateHRContactSchema, UpdateHRContactSchema } from "@repo/zod";
import { ERROR, SUCCESS, LOG } from "../../constants";
import logger from "../../utils/logger";
import {
    createHRContactService,
    getHRContactsService,
    getHRContactByIdService,
    updateHRContactService,
    deleteHRContactService,
} from "./service";

export const createHRContactController = async (req: Request, res: Response) => {
    try {
        const payload = CreateHRContactSchema.parse(req.body);
        const contact = await createHRContactService(payload);

        return res.status(201).json({ message: SUCCESS.RESOURCE_CREATED, data: contact });
    } catch (error: any) {
        logger.error("HR_CONTACT_CREATE_FAILED", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getHRContactsController = async (req: Request, res: Response) => {
    try {
        const contacts = await getHRContactsService();
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: contacts });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getHRContactByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const contact = await getHRContactByIdService(id);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: contact });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const updateHRContactController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const payload = UpdateHRContactSchema.parse(req.body);
        const contact = await updateHRContactService(id, payload);

        return res.status(200).json({ message: SUCCESS.RESOURCE_UPDATED, data: contact });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const deleteHRContactController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await deleteHRContactService(id);

        return res.status(200).json({ message: SUCCESS.RESOURCE_DELETED });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
