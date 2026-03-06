import { type Request, type Response } from "express";
import { CreateJobSchema, UpdateJobSchema, JobQuerySchema, PaginationQuerySchema } from "@repo/zod";
import { ERROR, SUCCESS } from "../../constants";
import logger from "../../utils/logger";
import {
    createJobService,
    getJobsService,
    getJobByIdService,
    updateJobService,
    deleteJobService,
} from "./service";

export const createJobController = async (req: Request, res: Response) => {
    try {
        const payload = CreateJobSchema.parse(req.body);
        const job = await createJobService(payload);

        return res.status(201).json({ message: SUCCESS.RESOURCE_CREATED, data: job });
    } catch (error: any) {
        logger.error("JOB_CREATE_FAILED", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getJobsController = async (req: Request, res: Response) => {
    try {
        const pagination = PaginationQuerySchema.parse(req.query);
        const filters = JobQuerySchema.parse(req.query);
        const result = await getJobsService({ ...pagination, ...filters });
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, ...result });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getJobByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const job = await getJobByIdService(id);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: job });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const updateJobController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const payload = UpdateJobSchema.parse(req.body);
        const job = await updateJobService(id, payload);

        return res.status(200).json({ message: SUCCESS.RESOURCE_UPDATED, data: job });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const deleteJobController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await deleteJobService(id);

        return res.status(200).json({ message: SUCCESS.RESOURCE_DELETED });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
