import "dotenv/config";
import * as z from "zod";

const eventSchema = z.object({
  DATABASE_URL: z.string(),
  RABBITMQ_URL: z.string(),
  FAILURE_PROBABILITY: z.coerce.number().min(0).max(1).default(0),
});


export const env = eventSchema.parse(process.env)