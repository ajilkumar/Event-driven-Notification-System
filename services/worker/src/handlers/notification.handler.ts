import { createLogger } from "@shared/logger";

const logger = createLogger("worker");

// Functions to handle sending notifications via email
export async function sendEmail(event: any) {
  logger.info("Attempting to send EMAIL...", {
    eventId: event.id,
    eventType: event.type,
  });

  // UNCOMMENT the line below to simulate a crash (and test Retries/DLQ)
  // throw new Error("Manually triggered crash for testing");

  // Simulation of random failure (controlled by env)
  const failureProbability = Number(process.env.FAILURE_PROBABILITY) || 0;
  if (Math.random() < failureProbability) {
    logger.error("Failed to send EMAIL (Simulated Network Error)", {
      eventId: event.id,
      eventType: event.type,
    });
    throw new Error("Simulated Network Error: SMTP Unavailable");
  }

  logger.info("EMAIL sent successfully", {
    eventId: event.id,
    eventType: event.type,
  });
}

// Functions to handle sending notifications via webhooks
export async function sendWebhook(event: any) {
  logger.info("Attempting to send WEBHOOK...", {
    eventId: event.id,
    eventType: event.type,
  });

  // Simulate standard processing time
  await new Promise((resolve) => setTimeout(resolve, 50));

  // UNCOMMENT to fail Webhooks
  // throw new Error("Webhook crashed!");

  logger.info("WEBHOOK sent successfully", {
    eventId: event.id,
    eventType: event.type,
  });
}
