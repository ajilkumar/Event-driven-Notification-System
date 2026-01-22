import { db } from "./index";

export async function markNotificationSent(
  eventId: string,
  channel: "EMAIL" | "WEBHOOK"
) {
  await db.query(
    `
    UPDATE notifications
    SET status = 'SENT',
        last_attempt_at = NOW()
    WHERE event_id = $1 AND channel = $2
    `,
    [eventId, channel]
  );
}

export async function markNotificationFailed(
  eventId: string,
  channel: "EMAIL" | "WEBHOOK"
) {
  await db.query(
    `
    UPDATE notifications
    SET status = 'FAILED',
        retry_count = retry_count + 1,
        last_attempt_at = NOW()
    WHERE event_id = $1 AND channel = $2
    `,
    [eventId, channel]
  );
}


export async function createNotificationIfNotExists(){
    // Implementation goes here
}