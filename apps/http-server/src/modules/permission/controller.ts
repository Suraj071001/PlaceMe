import { type Request, type Response } from "express";
import { PermissionQuerySchema } from "@repo/zod";
import { ERROR, SUCCESS } from "../../constants";
import { getPermissionByIdService, getPermissionsService } from "./service";

export const getPermissionsController = async (req: Request, res: Response) => {
    try {
        const query = PermissionQuerySchema.parse(req.query);
        const permissions = await getPermissionsService(query);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: permissions });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getPermissionByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const permission = await getPermissionByIdService(id);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: permission });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
