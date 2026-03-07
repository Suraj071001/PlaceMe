import prisma from "@repo/db";
import type { CreateRolePayload, UpdateRolePayload } from "@repo/zod";

export const createRole = async (payload: CreateRolePayload) => {
    return await prisma.role.create({
        data: {
            name: payload.name,
            description: payload.description,
            isDefault: payload.isDefault,
        },
    });
};

export const getRoles = async () => {
    return await prisma.role.findMany({
        orderBy: { createdAt: "desc" },
        include: { permissions: { include: { permission: true } } },
    });
};

export const getRoleById = async (id: string) => {
    return await prisma.role.findFirst({
        where: { id },
        include: { permissions: { include: { permission: true } } },
    });
};

export const updateRole = async (id: string, payload: UpdateRolePayload) => {
    return await prisma.role.update({
        where: { id },
        data: { ...payload },
    });
};

export const deleteRole = async (id: string) => {
    return await prisma.role.delete({
        where: { id },
    });
};
