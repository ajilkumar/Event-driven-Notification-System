export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/events_db",
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672"
};