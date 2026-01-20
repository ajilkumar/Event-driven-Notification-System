import { Channel, ConsumeMessage } from "amqplib";
import { getRetryCount, incrementRetry } from "../utils/retry";

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
  // placeholder – real logic in Phase 4
  console.log("Processing event:", event.type);
}
