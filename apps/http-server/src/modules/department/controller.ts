import { type Request, type Response } from "express";
import {
    createDepartmentService,
    getDepartmentsService,
    getDepartmentByIdService,
    updateDepartmentService,
    deleteDepartmentService,
} from "./service";
import { CreateDepartmentSchema, UpdateDepartmentSchema } from "@repo/zod";
import { ERROR, SUCCESS } from "../../constants";
import logger from "../../utils/logger";

export const createDepartmentController = async (req: Request, res: Response) => {
    try {
        const payload = CreateDepartmentSchema.parse(req.body);
        const department = await createDepartmentService(payload);

        logger.info("Department created successfully", { departmentId: department.id });
        res.status(201).json({ message: "Department created successfully", data: department });
    } catch (error: any) {
        logger.error("Create department failed", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getDepartmentsController = async (req: Request, res: Response) => {
    try {
        const companyId = req.query.companyId as string;
        if (!companyId) {
            return res.status(400).json({ error: "companyId query parameter is required" });
        }

        const departments = await getDepartmentsService(companyId);

        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: departments });
    } catch (error: any) {
        logger.error("Get departments failed", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getDepartmentByIdController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const companyId = req.query.companyId as string;
        if (!companyId) {
            return res.status(400).json({ error: "companyId query parameter is required" });
        }

        const department = await getDepartmentByIdService(id as string, companyId);
        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: department });
    } catch (error: any) {
        logger.error("Get department by id failed", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const updateDepartmentController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const companyId = req.query.companyId as string;
        if (!companyId) {
            return res.status(400).json({ error: "companyId query parameter is required" });
        }

        const payload = UpdateDepartmentSchema.parse(req.body);
        const department = await updateDepartmentService(id as string, companyId, payload);

        logger.info("Department updated successfully", { departmentId: department.id });
        res.status(200).json({ message: "Department updated successfully", data: department });
    } catch (error: any) {
        logger.error("Update department failed", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const deleteDepartmentController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const companyId = req.query.companyId as string;
        if (!companyId) {
            return res.status(400).json({ error: "companyId query parameter is required" });
        }

        await deleteDepartmentService(id as string, companyId);

        logger.info("Department deleted successfully", { departmentId: id });
        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error: any) {
        logger.error("Delete department failed", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
