import { Router } from "express";
import { createEventHandler } from "../controllers/events.controller";

export const eventsRouter = Router();

eventsRouter.post("/", createEventHandler);
