import { type Request, type Response } from "express";
import { AssignPermissionSchema } from "@repo/zod";
import { ERROR, SUCCESS } from "../../constants";
import logger from "../../utils/logger";
import {
    assignPermissionService,
    getPermissionsByRoleService,
    getRolesByPermissionService,
    revokePermissionService,
} from "./service";

export const assignPermissionController = async (req: Request, res: Response) => {
    try {
        const payload = AssignPermissionSchema.parse(req.body);
        const rolePermission = await assignPermissionService(payload);
        return res.status(201).json({ message: SUCCESS.RESOURCE_CREATED, data: rolePermission });
    } catch (error: any) {
        logger.error("ROLE_PERMISSION_ASSIGN_FAILED", { error: error.message || ERROR.INTERNAL_SERVER_ERROR });
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const revokePermissionController = async (req: Request, res: Response) => {
    try {
        const { roleId, permissionId } = req.body;
        await revokePermissionService(roleId, permissionId);
        return res.status(200).json({ message: SUCCESS.RESOURCE_DELETED });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getPermissionsByRoleController = async (req: Request<{ roleId: string }>, res: Response) => {
    try {
        const { roleId } = req.params;
        const permissions = await getPermissionsByRoleService(roleId);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: permissions });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getRolesByPermissionController = async (req: Request<{ permissionId: string }>, res: Response) => {
    try {
        const { permissionId } = req.params;
        const roles = await getRolesByPermissionService(permissionId);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: roles });
    } catch (error: any) {
        return res.status(400).json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
