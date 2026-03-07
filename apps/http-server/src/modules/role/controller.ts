import { type Request, type Response } from "express";
import { CreateRoleSchema, UpdateRoleSchema } from "@repo/zod";
import { ERROR, SUCCESS } from "../../constants";
import logger from "../../utils/logger";
import {
    createRoleService,
    deleteRoleService,
    getRoleByIdService,
    getRolesService,
    updateRoleService,
} from "./service";

export const createRoleController = async (req: Request, res: Response) => {
    try {
        const payload = CreateRoleSchema.parse(req.body);
        const role = await createRoleService(payload);
        return res.status(201).json({ message: SUCCESS.RESOURCE_CREATED, data: role });
    } catch (error: any) {
        logger.error("ROLE_CREATE_FAILED", { error: error.message || ERROR.INTERNAL_SERVER_ERROR });
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getRolesController = async (req: Request, res: Response) => {
    try {
        const roles = await getRolesService();
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: roles });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getRoleByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const role = await getRoleByIdService(id);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: role });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const updateRoleController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const payload = UpdateRoleSchema.parse(req.body);
        const role = await updateRoleService(id, payload);
        return res.status(200).json({ message: SUCCESS.RESOURCE_UPDATED, data: role });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const deleteRoleController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await deleteRoleService(id);
        return res.status(200).json({ message: SUCCESS.RESOURCE_DELETED });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
