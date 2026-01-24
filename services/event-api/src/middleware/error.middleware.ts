import { Request, Response, NextFunction } from "express";
import { createLogger } from "@shared/logger";

const logger = createLogger("event-api");

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err.name === "ZodError") {
    logger.warn("Validation failed", { errors: err.errors });
    return res.status(400).json({ error: "Invalid event payload", details: err.errors });
  }

  if (err.code === "23505") {
    logger.warn("Duplicate event detected");
    return res.status(409).json({ error: "Duplicate event" });
  }

  logger.error("Internal Server Error", { error: err });
  res.status(500).json({ error: "Internal server error" });
}
