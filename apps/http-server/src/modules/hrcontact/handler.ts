import type { Application } from "express";
import {
    createHRContactController,
    getHRContactsController,
    getHRContactByIdController,
    updateHRContactController,
    deleteHRContactController,
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { CreateHRContactSchema, UpdateHRContactSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const hrcontactRoutes = (app: Application) => {
    app.post(ROUTES.HR_CONTACT.BASE, zodValidator(CreateHRContactSchema), permissionMiddleware("CREATE_HR_CONTACT"), createHRContactController);
    app.get(ROUTES.HR_CONTACT.BASE, permissionMiddleware("READ_HR_CONTACT"), getHRContactsController);
    app.get(ROUTES.HR_CONTACT.BY_ID, permissionMiddleware("READ_HR_CONTACT"), getHRContactByIdController);
    app.patch(ROUTES.HR_CONTACT.BY_ID, zodValidator(UpdateHRContactSchema), permissionMiddleware("UPDATE_HR_CONTACT"), updateHRContactController);
    app.delete(ROUTES.HR_CONTACT.BY_ID, permissionMiddleware("DELETE_HR_CONTACT"), deleteHRContactController);
};
