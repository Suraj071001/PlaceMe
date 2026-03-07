import client from "@repo/db/index";
import type { CreateCompanyPayload, UpdateCompanyPayload } from "@repo/zod";

export const createCompany = async (data: CreateCompanyPayload) => {
  return await client.company.create({
    data,
  });
};

export const getCompanyBranchOptions = async () => {
  return await client.branch.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
};

export const getCompanyById = async (id: string) => {
  return await client.company.findFirst({
    where: { id, deletedAt: null },
    include: {
      branch: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getCompanyByDomain = async (domain: string) => {
  return await client.company.findFirst({
    where: { domain, deletedAt: null },
  });
};

export const getCompanies = async (skip: number, take: number, filters: any = {}) => {
  const where: any = { deletedAt: null };

  if (filters.name) {
    where.name = { contains: filters.name, mode: "insensitive" };
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.industry) {
    where.industry = { contains: filters.industry, mode: "insensitive" };
  }
  if (filters.faculty_coordinator) {
    where.faculty_coordinator = { contains: filters.faculty_coordinator, mode: "insensitive" };
  }
  if (filters.branchId) {
    where.branchId = filters.branchId;
  }

  const [data, total] = await Promise.all([
    client.company.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take,
    }),
    client.company.count({ where }),
  ]);

  return { data, total };
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
