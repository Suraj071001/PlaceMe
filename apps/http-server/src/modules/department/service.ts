import { createDepartment, getDepartmentsByCompany, getDepartmentById, updateDepartment, deleteDepartment } from "./dao";
import { getCompanyById } from "../company/dao";
import type { CreateDepartmentPayload, UpdateDepartmentPayload } from "@repo/zod";

export const createDepartmentService = async (payload: CreateDepartmentPayload) => {
  const company = await getCompanyById(payload.companyId);
  if (!company) {
    throw new Error("Company not found");
  }

  return await createDepartment(payload);
};

export const getDepartmentsService = async (companyId: string) => {
  return await getDepartmentsByCompany(companyId);
};

export const getDepartmentByIdService = async (id: string, companyId: string) => {
  const department = await getDepartmentById(id, companyId);
  if (!department) {
    throw new Error("Department not found");
  }
  return department;
};

export const updateDepartmentService = async (id: string, companyId: string, payload: UpdateDepartmentPayload) => {
  const department = await getDepartmentById(id, companyId);
  if (!department) {
    throw new Error("Department not found");
  }

  return await updateDepartment(id, payload);
};

export const deleteDepartmentService = async (id: string, companyId: string) => {
  const department = await getDepartmentById(id, companyId);
  if (!department) {
    throw new Error("Department not found");
  }

  return await deleteDepartment(id);
};
