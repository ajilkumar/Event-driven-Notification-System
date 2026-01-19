import { Pool } from "pg";
import { env } from "../config/env";

// if (!env.DATABASE_URL) {
//   throw new Error(`Database URL is not defined in the environment variable`);
// }

export const db = new Pool({
  connectionString: env.DATABASE_URL,
});

export async function verifyDatabaseConnection() {
  await db.query("SELECT 1");
}
