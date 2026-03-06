import client from "@repo/db/index";
import type { CreateHRContactPayload, UpdateHRContactPayload } from "@repo/zod";

export const createHRContact = async (data: CreateHRContactPayload) => {
    return await client.hRContact.create({
        data,
    });
};

export const getHRContactById = async (id: string) => {
    return await client.hRContact.findFirst({
        where: { id },
        include: { company: true },
    });
};

export const getHRContacts = async (skip: number, take: number, filters: any = {}) => {
    const where: any = {};

    if (filters.companyId) {
        where.companyId = filters.companyId;
    }
    if (filters.designation) {
        where.designation = filters.designation;
    }

    const [data, total] = await Promise.all([
        client.hRContact.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: { company: true },
            skip,
            take,
        }),
        client.hRContact.count({ where }),
    ]);

    return { data, total };
};

export const getHRContactsByCompanyId = async (companyId: string) => {
    return await client.hRContact.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" },
    });
};

export const updateHRContact = async (id: string, data: UpdateHRContactPayload) => {
    return await client.hRContact.update({
        where: { id },
        data,
    });
};

export const deleteHRContact = async (id: string) => {
    return await client.hRContact.delete({
        where: { id },
    });
};
