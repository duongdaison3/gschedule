import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { getValidatedEnv } from "./env";

export * from "./env";

let _db: ReturnType<typeof drizzle> | null = null;
let _sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (!_db) {
    const env = getValidatedEnv();
    _sql = postgres(env.DATABASE_URL, { max: env.NODE_ENV === "production" ? 10 : 2 });
    _db = drizzle(_sql);
  }
  return _db;
}

export function getSqlClient() {
  if (!_sql) {
    getDb();
  }
  return _sql!;
}
