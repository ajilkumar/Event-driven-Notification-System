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
