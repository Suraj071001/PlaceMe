import { createDepartment, getDepartmentsByCompany, getDepartmentById, updateDepartment, deleteDepartment } from "./dao";
import { getCompanyById } from "../company/dao";
import type { CreateDepartmentPayload, UpdateDepartmentPayload } from "@repo/zod";
import { LOG } from "../../constants";
import logger from "../../utils/logger";

export const createDepartmentService = async (payload: CreateDepartmentPayload) => {
  logger.info(LOG.DEPARTMENT_CREATE_START, { companyId: payload.companyId });
  const company = await getCompanyById(payload.companyId);
  if (!company) {
    logger.warn(LOG.DEPARTMENT_CREATE_FAILED, { reason: "Company not found" });
    throw new Error("Company not found");
  }

  const department = await createDepartment(payload);
  logger.info(LOG.DEPARTMENT_CREATE_SUCCESS, { departmentId: department.id });
  return department;
};

export const getDepartmentsService = async (companyId: string) => {
  logger.info(LOG.DEPARTMENT_FETCH_START, { companyId });
  const departments = await getDepartmentsByCompany(companyId);
  logger.info(LOG.DEPARTMENT_FETCH_SUCCESS, { companyId, count: departments.length });
  return departments;
};

export const getDepartmentByIdService = async (id: string, companyId: string) => {
  logger.info(LOG.DEPARTMENT_FETCH_START, { id, companyId });
  const department = await getDepartmentById(id, companyId);
  if (!department) {
    logger.warn(LOG.DEPARTMENT_FETCH_FAILED, { reason: "Department not found", id });
    throw new Error("Department not found");
  }
  logger.info(LOG.DEPARTMENT_FETCH_SUCCESS, { id, companyId });
  return department;
};

export const updateDepartmentService = async (id: string, companyId: string, payload: UpdateDepartmentPayload) => {
  logger.info(LOG.DEPARTMENT_UPDATE_START, { id, companyId });
  const department = await getDepartmentById(id, companyId);
  if (!department) {
    logger.warn(LOG.DEPARTMENT_UPDATE_FAILED, { reason: "Department not found", id });
    throw new Error("Department not found");
  }

  const updated = await updateDepartment(id, payload);
  logger.info(LOG.DEPARTMENT_UPDATE_SUCCESS, { id, companyId });
  return updated;
};

export const deleteDepartmentService = async (id: string, companyId: string) => {
  logger.info(LOG.DEPARTMENT_DELETE_START, { id, companyId });
  const department = await getDepartmentById(id, companyId);
  if (!department) {
    logger.warn(LOG.DEPARTMENT_DELETE_FAILED, { reason: "Department not found", id });
    throw new Error("Department not found");
  }

  const deleted = await deleteDepartment(id);
  logger.info(LOG.DEPARTMENT_DELETE_SUCCESS, { id, companyId });
  return deleted;
};
