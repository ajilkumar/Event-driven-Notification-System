import { db } from "../db";
import { publishEvent } from "../queue/publisher";

export async function createEvent(event: any) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `
      INSERT INTO events (id, type, version, payload, occurred_at, correlation_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      `,
      [
        event.id,
        event.type,
        event.version,
        event.payload,
        event.occurredAt,
        event.correlationId
      ]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  // publish AFTER commit
  publishEvent(event);
}
