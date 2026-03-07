import db from "@repo/db";

export const createAdminUserDAO = async (data: any) => {
    // Hash password 
    const hashedPassword = await Bun.password.hash(data.password);

    return await db.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            firstName: data.firstName,
            lastName: data.lastName,
            roleId: data.roleId,
            isActive: true,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: { select: { id: true, name: true } },
            isActive: true,
            createdAt: true,
        }
    });
};

export const getAdminUsersDAO = async () => {
    return await db.user.findMany({
        where: {
            // Include only users with roles (typically admins/staff/coordinators)
            // exclude basic students if they dont have a specific role assigned
            roleId: { not: null },
            deletedAt: null
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: { select: { id: true, name: true } },
            isActive: true,
            createdAt: true,
        }
    });
};

export const getAdminUserByIdDAO = async (id: string) => {
    return await db.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: { select: { id: true, name: true } },
            isActive: true,
            createdAt: true,
        }
    });
};

export const updateAdminUserDAO = async (id: string, data: any) => {
    return await db.user.update({
        where: { id },
        data,
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: { select: { id: true, name: true } },
            isActive: true,
            createdAt: true,
        }
    });
};

export const deleteAdminUserDAO = async (id: string) => {
    return await db.user.update({
        where: { id },
        data: {
            deletedAt: new Date(),
            isActive: false
        }
    });
};
