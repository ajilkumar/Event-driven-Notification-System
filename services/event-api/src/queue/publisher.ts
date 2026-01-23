import amqp from "amqplib";
import { env } from "../config/env";

let channel: amqp.Channel;

export async function initPublisher() {
  const conn = await amqp.connect(env.RABBITMQ_URL);
  channel = await conn.createChannel();

  await channel.assertExchange("events.exchange", "fanout", { durable: true });
}

export function publishEvent(event: unknown) {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  channel.publish(
    "events.exchange",
    "",
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
}
