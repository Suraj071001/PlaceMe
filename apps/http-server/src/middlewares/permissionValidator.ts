import type { NextFunction, Request, Response } from "express";
import Jwt, { type JwtPayload } from "jsonwebtoken";
import JWT_SECRET from "../config/auth";
import logger from "../utils/logger";
import { LOG } from "../constants";

export const permissionMiddleware = (permission: string) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1]; // Assuming Bearer token

        if (!token) {
            logger.warn(LOG.AUTH_MISSING_TOKEN);
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            // Verify and decode the JWT payload
            const decoded = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
            req.user = {
                id: decoded.id as string,
                role: decoded.role as string,
            };

            // Extract the permissions array we added earlier
            const permissions: string[] = decoded.permissions || [];

            // Check if the required permission is present
            const havePermission = permissions.includes(permission);

            if (havePermission) {
                next();
            } else {
                // Forbidden: User is authenticated but doesn't have the right permission
                logger.warn("AUTH_FORBIDDEN", { required: permission, actual: permissions });
                res.status(403).json({ message: "Forbidden: You don't have the required permission" });
            }
        } catch (error: any) {
            logger.warn(LOG.AUTH_INVALID_TOKEN, { error: error.message });
            res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
    };
};

export const anyPermissionMiddleware = (requiredPermissions: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            logger.warn(LOG.AUTH_MISSING_TOKEN);
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        try {
            const decoded = Jwt.verify(token, JWT_SECRET as string) as JwtPayload;
            req.user = {
                id: decoded.id as string,
                role: decoded.role as string,
            };

            const permissions: string[] = decoded.permissions || [];
            const hasAnyPermission = requiredPermissions.some((permission) => permissions.includes(permission));

            if (hasAnyPermission) {
                next();
            } else {
                logger.warn("AUTH_FORBIDDEN", { requiredAny: requiredPermissions, actual: permissions });
                res.status(403).json({ message: "Forbidden: You don't have the required permission" });
            }
        } catch (error: any) {
            logger.warn(LOG.AUTH_INVALID_TOKEN, { error: error.message });
            res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
        }
    };
};
