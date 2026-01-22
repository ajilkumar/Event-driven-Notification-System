import { Channel, ConsumeMessage } from "amqplib";
import { getRetryCount, incrementRetry } from "../utils/retry";
import { sendEmail, sendWebhook } from "../handlers/notification.handler";
import {
  createNotificationIfNotExists,
  markNotificationSent,
  markNotificationFailed,
} from "../db/notification.repo";

const MAX_RETRIES = 5;

export async function startConsumer(channel: Channel) {
  channel.consume("events.main.queue", async (msg) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());

      // Simulate notification handling
      await processEvent(event);

      channel.ack(msg);
    } catch (err) {
      const retryCount = getRetryCount(msg);

      if (retryCount >= MAX_RETRIES) {
        channel.sendToQueue(
          "events.dlq.queue",
          msg.content,
          { headers: msg.properties.headers }
        );
        channel.ack(msg);
      } else {
        channel.publish(
          "events.retry.exchange",
          "",
          msg.content,
          {
            headers: incrementRetry(msg.properties.headers),
            persistent: true
          }
        );
        channel.ack(msg);
      }
    }
  });
}

async function processEvent(event: any) {
  const eventId = event.id;

  const channels: Array<"EMAIL" | "WEBHOOK"> = ["EMAIL", "WEBHOOK"];

  for (const channel of channels) {
    try {
      // await createNotificationIfNotExists(eventId, channel);

      if (channel === "EMAIL") {
        await sendEmail(event);
      } else {
        await sendWebhook(event);
      }

      await markNotificationSent(eventId, channel);
    } catch (err) {
      await markNotificationFailed(eventId, channel);
      throw err; // triggers retry logic from Phase 3
    }
  }
}
