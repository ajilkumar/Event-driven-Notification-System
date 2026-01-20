import { createChannel } from "./queue/connection";
import { startConsumer } from "./queue/consumer";

async function start() {
  const channel = await createChannel();
  await startConsumer(channel);

  console.log("Worker started and consuming messages");
}

start().catch((err) => {
  console.error("Worker failed to start", err);
  process.exit(1);
});
