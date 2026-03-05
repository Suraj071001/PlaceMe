import type { NextFunction, Request, Response } from "express";
import Jwt, { type JwtPayload } from "jsonwebtoken";
import JWT_SECRET from "../config/auth";
import logger from "../utils/logger";
import { LOG } from "../constants";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token

    if (!token) {
        logger.warn(LOG.AUTH_MISSING_TOKEN);
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
        const { id, role } = decoded;
        req.user = { id, role };
        next();
    } catch {
        logger.warn(LOG.AUTH_INVALID_TOKEN);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
