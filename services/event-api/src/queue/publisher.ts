import amqp from "amqplib";
import { env } from "../config/env";

let channel: amqp.Channel;

export async function initPublisher() {
  const conn = await amqp.connect(env.RABBITMQ_URL);
  channel = await conn.createChannel();

  await channel.assertExchange("events", "fanout", { durable: true });
}

export function publishEvent(event: unknown) {
  channel.publish(
    "events",
    "",
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
}
