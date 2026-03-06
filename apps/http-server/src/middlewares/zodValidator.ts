import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import logger from "../utils/logger";

export const zodValidator =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      logger.warn(JSON.stringify({
        reason: "validation_failed",
        errors: result.error.flatten().fieldErrors,
      }));
      return res.status(400).json({
        message: "Validation error",
        errors: result.error.message,
      });
    }

    next();
  };
