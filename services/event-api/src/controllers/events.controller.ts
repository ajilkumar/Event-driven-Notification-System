import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { createEvent } from "../services/event.service";

const eventSchema = z.object({
  id: z.uuid(),
  type: z.string().min(1),
  version: z.number().int(),
  payload: z.unknown(),
  occurredAt: z.iso.datetime(),
  correlationId: z.string().optional(),
});

export async function createEventHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const event = eventSchema.parse(req.body);

    await createEvent(event);

    return res.status(202).json({
      message: "Event accepted for processing",
    });
  } catch (err) {
    next(err);
  }
}
