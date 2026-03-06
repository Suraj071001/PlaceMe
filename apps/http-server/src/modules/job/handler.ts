import type { Application } from "express";
import {
    createJobController,
    getJobsController,
    getJobByIdController,
    updateJobController,
    deleteJobController,
} from "./controller";
import { zodValidator } from "../../middlewares/zodValidator";
import { CreateJobSchema, UpdateJobSchema } from "@repo/zod";
import { ROUTES } from "../../constants/routes";
import { permissionMiddleware } from "../../middlewares/permissionValidator";

export const jobRoutes = (app: Application) => {
    app.post(ROUTES.JOB.BASE, zodValidator(CreateJobSchema), permissionMiddleware("CREATE_JOB"), createJobController);
    app.get(ROUTES.JOB.BASE, permissionMiddleware("READ_JOBS"), getJobsController);
    app.get(ROUTES.JOB.BY_ID, permissionMiddleware("READ_JOBS"), getJobByIdController);
    app.patch(ROUTES.JOB.BY_ID, zodValidator(UpdateJobSchema), permissionMiddleware("UPDATE_JOBS"), updateJobController);
    app.delete(ROUTES.JOB.BY_ID, permissionMiddleware("DELETE_JOB"), deleteJobController);
};
