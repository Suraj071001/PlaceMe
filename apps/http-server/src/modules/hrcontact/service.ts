import {
    createHRContact,
    getHRContacts,
    getHRContactById,
    updateHRContact,
    deleteHRContact,
    getHRContactsByCompanyId
} from "./dao";
import type { CreateHRContactPayload, UpdateHRContactPayload } from "@repo/zod";
import { ERROR, LOG } from "../../constants";
import logger from "../../utils/logger";

export const createHRContactService = async (payload: CreateHRContactPayload) => {
    logger.info("HR_CONTACT_CREATE_START", { email: payload.email });

    const contact = await createHRContact(payload);
    logger.info("HR_CONTACT_CREATE_SUCCESS", { contactId: contact.id });
    return contact;
};

export const getHRContactsService = async () => {
    logger.info("HR_CONTACT_FETCH_START");
    const contacts = await getHRContacts();
    logger.info("HR_CONTACT_FETCH_SUCCESS", { count: contacts.length });
    return contacts;
};

export const getHRContactByIdService = async (id: string) => {
    logger.info("HR_CONTACT_FETCH_START", { id });
    const contact = await getHRContactById(id);
    if (!contact) {
        throw new Error("HR Contact not found");
    }
    logger.info("HR_CONTACT_FETCH_SUCCESS", { id });
    return contact;
};

export const getHRContactsByCompanyIdService = async (companyId: string) => {
    logger.info("HR_CONTACT_FETCH_BY_COMPANY_START", { companyId });
    const contacts = await getHRContactsByCompanyId(companyId);
    logger.info("HR_CONTACT_FETCH_BY_COMPANY_SUCCESS", { companyId, count: contacts.length });
    return contacts;
};

export const updateHRContactService = async (id: string, payload: UpdateHRContactPayload) => {
    logger.info("HR_CONTACT_UPDATE_START", { id });

    const contact = await getHRContactById(id);
    if (!contact) {
        throw new Error("HR Contact not found");
    }

    const updated = await updateHRContact(id, payload);
    logger.info("HR_CONTACT_UPDATE_SUCCESS", { id });
    return updated;
};

export const deleteHRContactService = async (id: string) => {
    logger.info("HR_CONTACT_DELETE_START", { id });
    const contact = await getHRContactById(id);
    if (!contact) {
        throw new Error("HR Contact not found");
    }

    const deleted = await deleteHRContact(id);
    logger.info("HR_CONTACT_DELETE_SUCCESS", { id });
    return deleted;
};
