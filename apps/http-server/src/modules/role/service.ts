import { createRole, deleteRole, getRoleById, getRoles, updateRole } from "./dao";
import type { CreateRolePayload, UpdateRolePayload } from "@repo/zod";
import logger from "../../utils/logger";

export const createRoleService = async (payload: CreateRolePayload) => {
    logger.info("ROLE_CREATE_START", { name: payload.name });
    const role = await createRole(payload);
    logger.info("ROLE_CREATE_SUCCESS", { roleId: role.id });
    return role;
};

export const getRolesService = async () => {
    logger.info("ROLE_FETCH_START");
    const roles = await getRoles();
    logger.info("ROLE_FETCH_SUCCESS", { count: roles.length });
    return roles;
};

export const getRoleByIdService = async (id: string) => {
    logger.info("ROLE_FETCH_BY_ID_START", { id });
    const role = await getRoleById(id);
    if (!role) {
        throw new Error("Role not found");
    }
    logger.info("ROLE_FETCH_BY_ID_SUCCESS", { id });
    return role;
};

export const updateRoleService = async (id: string, payload: UpdateRolePayload) => {
    logger.info("ROLE_UPDATE_START", { id });
    const role = await getRoleById(id);
    if (!role) {
        throw new Error("Role not found");
    }
    const updated = await updateRole(id, payload);
    logger.info("ROLE_UPDATE_SUCCESS", { id });
    return updated;
};

export const deleteRoleService = async (id: string) => {
    logger.info("ROLE_DELETE_START", { id });
    const role = await getRoleById(id);
    if (!role) {
        throw new Error("Role not found");
    }
    const deleted = await deleteRole(id);
    logger.info("ROLE_DELETE_SUCCESS", { id });
    return deleted;
};
