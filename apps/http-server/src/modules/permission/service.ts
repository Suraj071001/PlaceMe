import { getPermissionById, getPermissions } from "./dao";
import type { PermissionQuery } from "@repo/zod";
import logger from "../../utils/logger";

export const getPermissionsService = async (query: PermissionQuery) => {
    logger.info("PERMISSION_FETCH_START");
    const permissions = await getPermissions(query.name);
    logger.info("PERMISSION_FETCH_SUCCESS", { count: permissions.length });
    return permissions;
};

export const getPermissionByIdService = async (id: string) => {
    logger.info("PERMISSION_FETCH_BY_ID_START", { id });
    const permission = await getPermissionById(id);
    if (!permission) {
        throw new Error("Permission not found");
    }
    logger.info("PERMISSION_FETCH_BY_ID_SUCCESS", { id });
    return permission;
};
