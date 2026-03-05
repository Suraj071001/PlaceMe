import type { NextFunction, Request, Response } from "express";
import  Jwt, { type JwtPayload }  from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    let isAuthenticated =  Jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (!isAuthenticated) { 
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { id, role } = isAuthenticated;
    req.user = { id, role };
    next();
}
