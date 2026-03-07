import { assignPermission, getPermissionsByRole, getRolesByPermission, revokePermission } from "./dao";
import type { AssignPermissionPayload } from "@repo/zod";
import logger from "../../utils/logger";

export const assignPermissionService = async (payload: AssignPermissionPayload) => {
    logger.info("ROLE_PERMISSION_ASSIGN_START", { roleId: payload.roleId, permissionId: payload.permissionId });
    const rolePermission = await assignPermission(payload);
    logger.info("ROLE_PERMISSION_ASSIGN_SUCCESS", { roleId: payload.roleId, permissionId: payload.permissionId });
    return rolePermission;
};

export const revokePermissionService = async (roleId: string, permissionId: string) => {
    logger.info("ROLE_PERMISSION_REVOKE_START", { roleId, permissionId });
    const deleted = await revokePermission(roleId, permissionId);
    logger.info("ROLE_PERMISSION_REVOKE_SUCCESS", { roleId, permissionId });
    return deleted;
};

export const getPermissionsByRoleService = async (roleId: string) => {
    logger.info("ROLE_PERMISSION_FETCH_BY_ROLE_START", { roleId });
    const permissions = await getPermissionsByRole(roleId);
    logger.info("ROLE_PERMISSION_FETCH_BY_ROLE_SUCCESS", { roleId, count: permissions.length });
    return permissions;
};

export const getRolesByPermissionService = async (permissionId: string) => {
    logger.info("ROLE_PERMISSION_FETCH_BY_PERMISSION_START", { permissionId });
    const roles = await getRolesByPermission(permissionId);
    logger.info("ROLE_PERMISSION_FETCH_BY_PERMISSION_SUCCESS", { permissionId, count: roles.length });
    return roles;
};
