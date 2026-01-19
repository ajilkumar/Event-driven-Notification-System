import { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err.name === "ZodError") {
    return res.status(400).json({ error: "Invalid event payload" });
  }

  if (err.code === "23505") {
    return res.status(409).json({ error: "Duplicate event" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
