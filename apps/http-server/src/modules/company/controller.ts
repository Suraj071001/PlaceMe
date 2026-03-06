import { type Request, type Response } from "express";
import { CreateCompanySchema, UpdateCompanySchema, CompanyQuerySchema, PaginationQuerySchema } from "@repo/zod";
import { ERROR, SUCCESS, LOG } from "../../constants";
import logger from "../../utils/logger";
import {
    createCompanyService,
    getCompaniesService,
    getCompanyByIdService,
    updateCompanyService,
    deleteCompanyService,
} from "./service";

export const createCompanyController = async (req: Request, res: Response) => {
    try {
        const payload = CreateCompanySchema.parse(req.body);
        const company = await createCompanyService(payload);

        return res.status(201).json({ message: SUCCESS.RESOURCE_CREATED, data: company });
    } catch (error: any) {
        logger.error(LOG.COMPANY_CREATE_FAILED, {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getCompaniesController = async (req: Request, res: Response) => {
    try {
        const pagination = PaginationQuerySchema.parse(req.query);
        const filters = CompanyQuerySchema.parse(req.query);
        const result = await getCompaniesService({ ...pagination, ...filters });
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, ...result });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getCompanyByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const company = await getCompanyByIdService(id);
        return res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: company });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const updateCompanyController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const payload = UpdateCompanySchema.parse(req.body);
        const company = await updateCompanyService(id, payload);

        return res.status(200).json({ message: SUCCESS.RESOURCE_UPDATED, data: company });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const deleteCompanyController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        await deleteCompanyService(id);

        return res.status(200).json({ message: SUCCESS.RESOURCE_DELETED });
    } catch (error: any) {
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
