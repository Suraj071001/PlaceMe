import type { NextFunction, Request, Response } from "express";
import Jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "@repo/db";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: string;
            };
        }
    }
}

import JWT_SECRET from "../config/auth";
import logger from "../utils/logger";
import { LOG } from "../constants";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token

    if (!token) {
        logger.warn(LOG.AUTH_MISSING_TOKEN);
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        const { id, role } = decoded;
        if (!id || typeof id !== "string") {
            logger.warn(LOG.AUTH_INVALID_TOKEN, { reason: "missing_user_id_in_token" });
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, isActive: true },
        });
        if (!user || !user.isActive) {
            logger.warn(LOG.AUTH_INVALID_TOKEN, { reason: "user_missing_or_inactive", userId: id });
            return res.status(401).json({ message: "Session expired. Please login again." });
        }

        req.user = { id, role };
        next();
    } catch {
        logger.warn(LOG.AUTH_INVALID_TOKEN);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
