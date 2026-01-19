import * as z from "zod";

const eventSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string(),
  RABBITMQ_URL: z.string(),
});


export const env = eventSchema.parse(process.env)