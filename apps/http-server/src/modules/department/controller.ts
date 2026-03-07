import { type Request, type Response } from "express";
import {
    createDepartmentService,
    getDepartmentsService,
    getDepartmentByIdService,
    updateDepartmentService,
    deleteDepartmentService,
} from "./service";
import { CreateDepartmentSchema, UpdateDepartmentSchema } from "@repo/zod";
import { ERROR, SUCCESS, LOG } from "../../constants";
import logger from "../../utils/logger";

export const createDepartmentController = async (req: Request, res: Response) => {
    try {
        const payload = CreateDepartmentSchema.parse(req.body);
        const department = await createDepartmentService(payload);

        res.status(201).json({ message: "Department created successfully", data: department });
    } catch (error: any) {
        logger.error(LOG.DEPARTMENT_CREATE_FAILED, {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getDepartmentsController = async (req: Request, res: Response) => {
    try {
        const includeHierarchy = String(req.query.includeHierarchy ?? "").toLowerCase() === "true";
        const departments = await getDepartmentsService(includeHierarchy);

        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: departments });
    } catch (error: any) {
        logger.error(LOG.DEPARTMENT_FETCH_FAILED, {
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

        const department = await getDepartmentByIdService(id as string);

        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: department });
    } catch (error: any) {
        logger.error(LOG.DEPARTMENT_FETCH_FAILED, {
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

        const payload = UpdateDepartmentSchema.parse(req.body);
        const department = await updateDepartmentService(id as string, payload);

        res.status(200).json({ message: "Department updated successfully", data: department });
    } catch (error: any) {
        logger.error(LOG.DEPARTMENT_UPDATE_FAILED, {
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

        await deleteDepartmentService(id as string);

        res.status(200).json({ message: "Department deleted successfully" });
    } catch (error: any) {
        logger.error(LOG.DEPARTMENT_DELETE_FAILED, {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
