import {
    createCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    getCompanyByDomain,
} from "./dao";
import type { CreateCompanyPayload, UpdateCompanyPayload } from "@repo/zod";
import { ERROR, LOG } from "../../constants";
import logger from "../../utils/logger";

export const createCompanyService = async (payload: CreateCompanyPayload) => {
    logger.info(LOG.COMPANY_CREATE_START, { name: payload.name });

    if (payload.domain) {
        const existingDomain = await getCompanyByDomain(payload.domain);
        if (existingDomain) {
            logger.warn(LOG.COMPANY_CREATE_FAILED, { reason: ERROR.COMPANY_EXISTS });
            throw new Error(ERROR.COMPANY_EXISTS);
        }
    }

    const company = await createCompany(payload);
    logger.info(LOG.COMPANY_CREATE_SUCCESS, { companyId: company.id });
    return company;
};

export const getCompaniesService = async () => {
    logger.info(LOG.COMPANY_FETCH_START);
    const companies = await getCompanies();
    logger.info(LOG.COMPANY_FETCH_SUCCESS, { count: companies.length });
    return companies;
};

export const getCompanyByIdService = async (id: string) => {
    logger.info(LOG.COMPANY_FETCH_START, { id });
    const company = await getCompanyById(id);
    if (!company) {
        throw new Error(ERROR.COMPANY_NOT_FOUND);
    }
    logger.info(LOG.COMPANY_FETCH_SUCCESS, { id });
    return company;
};

export const updateCompanyService = async (id: string, payload: UpdateCompanyPayload) => {
    logger.info(LOG.COMPANY_UPDATE_START, { id });

    const company = await getCompanyById(id);
    if (!company) {
        throw new Error(ERROR.COMPANY_NOT_FOUND);
    }

    if (payload.domain && payload.domain !== company.domain) {
        const existingDomain = await getCompanyByDomain(payload.domain);
        if (existingDomain) {
            throw new Error(ERROR.COMPANY_EXISTS);
        }
    }

    const updated = await updateCompany(id, payload);
    logger.info(LOG.COMPANY_UPDATE_SUCCESS, { id });
    return updated;
};

export const deleteCompanyService = async (id: string) => {
    logger.info(LOG.COMPANY_DELETE_START, { id });
    const company = await getCompanyById(id);
    if (!company) {
        throw new Error(ERROR.COMPANY_NOT_FOUND);
    }

    const deleted = await deleteCompany(id);
    logger.info(LOG.COMPANY_DELETE_SUCCESS, { id });
    return deleted;
};
