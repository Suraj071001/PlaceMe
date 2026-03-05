import client from "@repo/db/index";
import type { CreateCompanyPayload, UpdateCompanyPayload } from "@repo/zod";

export const createCompany = async (data: CreateCompanyPayload) => {
    return await client.company.create({
        data,
    });
};

export const getCompanyById = async (id: string) => {
    return await client.company.findFirst({
        where: { id, deletedAt: null },
    });
};

export const getCompanyByDomain = async (domain: string) => {
    return await client.company.findFirst({
        where: { domain, deletedAt: null },
    });
};

export const getCompanies = async () => {
    return await client.company.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
    });
};

export const updateCompany = async (id: string, data: UpdateCompanyPayload) => {
    return await client.company.update({
        where: { id },
        data,
    });
};

export const deleteCompany = async (id: string) => {
    return await client.company.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};
