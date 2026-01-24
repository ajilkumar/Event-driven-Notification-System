import { createApp } from "./app";
import { env } from "./config/env";
import { verifyDatabaseConnection } from "./db";

import { initPublisher } from "./queue/publisher";

async function startServer() {
  try {
    await verifyDatabaseConnection();
    console.log(`Database connected successfully`);

    await initPublisher();
    console.log("RabbitMQ Publisher initialized"); // debug log

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`Event API running on port ${env.PORT}`);
    });
 
    process.on("SIGTERM", () => {
      server.close(() => {
        console.log("Server closed gracefully");
      });
    });
  } catch (error) {
    console.error(`Failed to start server`, error);
    process.exit(1);
  }
}

startServer();
