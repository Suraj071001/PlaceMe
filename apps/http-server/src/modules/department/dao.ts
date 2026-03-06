import prisma from "@repo/db";
import type { CreateDepartmentPayload, UpdateDepartmentPayload } from "@repo/zod";

export const createDepartment = async (payload: CreateDepartmentPayload) => {
  return await prisma.department.create({
    data: {
      name: payload.name,
      companyId: payload.companyId,
    },
  });
};

export const getDepartmentsByCompany = async (companyId: string) => {
  return await prisma.department.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getDepartmentById = async (id: string, companyId: string) => {
  return await prisma.department.findFirst({
    where: {
      id,
      companyId,
      deletedAt: null,
    },
  });
};

export const updateDepartment = async (id: string, payload: UpdateDepartmentPayload) => {
  return await prisma.department.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
};

export const deleteDepartment = async (id: string) => {
  return await prisma.department.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
