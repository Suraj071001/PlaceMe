import { type Request, type Response } from "express";
import { getStudentNotificationsService, getStudentProfileService, markStudentNotificationAsReadService, updateStudentProfileService } from "./services";
import { UpdateStudentProfileSchema } from "@repo/zod";
import { ERROR, SUCCESS, LOG } from "../../constants";
import logger from "../../utils/logger";

export const getProfileController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const profile = await getStudentProfileService(userId);
        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: profile });
    } catch (error: any) {
        logger.error(LOG.STUDENT_FETCH_START, {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getStudentByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const profile = await getStudentProfileService(id);
        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: profile });
    } catch (error: any) {
        logger.error(LOG.STUDENT_FETCH_START, {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const updateProfileController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const payload = UpdateStudentProfileSchema.parse(req.body);
        const updatedProfile = await updateStudentProfileService(userId, payload);

        res.status(200).json({ message: SUCCESS.RESOURCE_UPDATED, data: updatedProfile });
    } catch (error: any) {
        logger.error(LOG.STUDENT_UPDATE_FAILED, {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const getNotificationsController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const notifications = await getStudentNotificationsService(userId);
        res.status(200).json({ message: SUCCESS.DATA_FETCHED, data: notifications });
    } catch (error: any) {
        logger.error("STUDENT_NOTIFICATIONS_FETCH_FAILED", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        return res
            .status(400)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};

export const markNotificationAsReadController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const { id } = req.params;
        const updated = await markStudentNotificationAsReadService(userId, id);
        return res.status(200).json({ message: SUCCESS.RESOURCE_UPDATED, data: updated });
    } catch (error: any) {
        logger.error("STUDENT_NOTIFICATION_MARK_READ_FAILED", {
            error: error.message || ERROR.INTERNAL_SERVER_ERROR,
        });
        const statusCode = error.message === "Notification not found" ? 404 : 400;
        return res
            .status(statusCode)
            .json({ error: error.message || ERROR.INTERNAL_SERVER_ERROR });
    }
};
