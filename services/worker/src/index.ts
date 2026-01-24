import "dotenv/config";
import { createChannel } from "./queue/connection";
import { startConsumer } from "./queue/consumer";
import { createLogger } from "@shared/logger";

const logger = createLogger("worker");

async function start() {
  const channel = await createChannel();
  await startConsumer(channel);

  logger.info("Worker started and consuming messages");

  // Graceful Shutdown
  const shutdown = async () => {
    logger.info("Shutting down worker...");
    await channel.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start().catch((err) => {
  logger.error("Worker failed to start", { error: err });
  process.exit(1);
});
