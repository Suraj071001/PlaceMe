import prisma from "@repo/db";

export const getPermissions = async (name?: string) => {
    return await prisma.permission.findMany({
        where: name ? { name: { contains: name, mode: "insensitive" } } : {},
        orderBy: { name: "asc" },
    });
};

export const getPermissionById = async (id: string) => {
    return await prisma.permission.findFirst({
        where: { id },
    });
};
