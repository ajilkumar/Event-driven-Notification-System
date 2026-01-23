import "dotenv/config";
import * as z from "zod";

const eventSchema = z.object({
  DATABASE_URL: z.string(),
  RABBITMQ_URL: z.string(),
});


export const env = eventSchema.parse(process.env)