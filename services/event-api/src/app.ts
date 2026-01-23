import express from "express";
import { json } from "body-parser";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { eventsRouter } from "./routes/event.route";
import { errorMiddleware } from "./middleware/error.middleware";

import { createLogger } from "@shared/logger";

const logger = createLogger("event-api");

export function createApp() {
  const app = express();

  app.use(json());
  app.use(requestIdMiddleware);

  // Health check endpoint
  app.get("/health", (_req, res) => {
    logger.info("Health check request received");
    res.status(200).json({ status: "ok" });
  });

  app.use(`/events`, eventsRouter);

  app.use(errorMiddleware);

  return app;
}
