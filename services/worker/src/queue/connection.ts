import amqp from "amqplib";
import { env } from "../config/env";

export async function createChannel() {
  const connection = await amqp.connect(env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange("events.exchange", "fanout", { durable: true });

  await channel.assertQueue("events.main.queue", {
    durable: true,
    deadLetterExchange: "events.retry.exchange",
  });

  await channel.assertExchange("events.retry.exchange", "fanout", {
    durable: true,
  });

  await channel.assertQueue("events.retry.queue", {
    durable: true,
    messageTtl: 10000,
    deadLetterExchange: "events.exchange",
  });

  await channel.assertQueue("events.dlq.queue", {
    durable: true,
  });

  await channel.bindQueue("events.main.queue", "events.exchange", "");
  await channel.bindQueue("events.retry.queue", "events.retry.exchange", "");

  return channel;
}
