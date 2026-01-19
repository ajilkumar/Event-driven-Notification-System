import express from "express";
import { json } from "body-parser";
import { requestIdMiddleware } from "./midddleware/request-id.middleware";
import { eventsRouter } from "./routes/event.route";
import { errorMiddleware } from "./midddleware/error.middleware";

export function createApp() {
  const app = express();

  app.use(json());
  app.use(requestIdMiddleware);

  app.use(`/events`, eventsRouter);

  app.use(errorMiddleware);

  return app;
}
