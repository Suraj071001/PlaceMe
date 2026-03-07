import { createDepartment, getDepartments, getDepartmentById, updateDepartment, deleteDepartment } from "./dao";

import type { CreateDepartmentPayload, UpdateDepartmentPayload } from "@repo/zod";
import { LOG } from "../../constants";
import logger from "../../utils/logger";

export const createDepartmentService = async (payload: CreateDepartmentPayload) => {
  logger.info(LOG.DEPARTMENT_CREATE_START);

  const department = await createDepartment(payload);
  logger.info(LOG.DEPARTMENT_CREATE_SUCCESS, { departmentId: department.id });
  return department;
};

export const getDepartmentsService = async () => {
  logger.info(LOG.DEPARTMENT_FETCH_START);
  const departments = await getDepartments();
  logger.info(LOG.DEPARTMENT_FETCH_SUCCESS, { count: departments.length });
  return departments;
};

export const getDepartmentByIdService = async (id: string) => {
  logger.info(LOG.DEPARTMENT_FETCH_START, { id });
  const department = await getDepartmentById(id);
  if (!department) {
    logger.warn(LOG.DEPARTMENT_FETCH_FAILED, { reason: "Department not found", id });
    throw new Error("Department not found");
  }
  logger.info(LOG.DEPARTMENT_FETCH_SUCCESS, { id });
  return department;
};

export const updateDepartmentService = async (id: string, payload: UpdateDepartmentPayload) => {
  logger.info(LOG.DEPARTMENT_UPDATE_START, { id });
  const department = await getDepartmentById(id);
  if (!department) {
    logger.warn(LOG.DEPARTMENT_UPDATE_FAILED, { reason: "Department not found", id });
    throw new Error("Department not found");
  }

  const updated = await updateDepartment(id, payload);
  logger.info(LOG.DEPARTMENT_UPDATE_SUCCESS, { id });
  return updated;
};

export const deleteDepartmentService = async (id: string) => {
  logger.info(LOG.DEPARTMENT_DELETE_START, { id });
  const department = await getDepartmentById(id);
  if (!department) {
    logger.warn(LOG.DEPARTMENT_DELETE_FAILED, { reason: "Department not found", id });
    throw new Error("Department not found");
  }

  const deleted = await deleteDepartment(id);
  logger.info(LOG.DEPARTMENT_DELETE_SUCCESS, { id });
  return deleted;
};
