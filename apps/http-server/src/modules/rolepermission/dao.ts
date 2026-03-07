import prisma from "@repo/db";
import type { AssignPermissionPayload } from "@repo/zod";

export const assignPermission = async (payload: AssignPermissionPayload) => {
    return await prisma.rolePermission.create({
        data: {
            roleId: payload.roleId,
            permissionId: payload.permissionId,
        },
        include: {
            role: true,
            permission: true,
        },
    });
};

export const revokePermission = async (roleId: string, permissionId: string) => {
    return await prisma.rolePermission.delete({
        where: {
            roleId_permissionId: { roleId, permissionId },
        },
    });
};

export const getPermissionsByRole = async (roleId: string) => {
    return await prisma.rolePermission.findMany({
        where: { roleId },
        include: { permission: true },
    });
};

export const getRolesByPermission = async (permissionId: string) => {
    return await prisma.rolePermission.findMany({
        where: { permissionId },
        include: { role: true },
    });
};
