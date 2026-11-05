import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

// Nạp file .env từ root dự án nếu có
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config(); // fallback nạp tại cwd

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { getValidatedEnv, type Env } from "./env";

export * from "./env";
export * from "./safety";

export function resolveSslConfig(url: string, caCert?: string, nodeEnv: string = "development") {
  const isSslRequested = url.includes("sslmode=require") || url.includes("ssl=true");

  let ca: string | undefined;
  if (caCert && caCert.trim() !== "") {
    if (caCert.includes("-----BEGIN CERTIFICATE-----")) {
      ca = caCert.trim();
    } else if (fs.existsSync(caCert)) {
      ca = fs.readFileSync(caCert, "utf-8");
    } else {
      console.warn(`[DB] CẢNH BÁO: Không tìm thấy file PG_CA_CERT tại đường dẫn: ${caCert}`);
    }
  }

  if (ca) {
    return {
      rejectUnauthorized: true,
      ca,
    };
  }

  if (!isSslRequested) {
    return false;
  }

  if (nodeEnv !== "production" && process.env.ALLOW_INSECURE_SSL === "1") {
    console.warn("[DB] CẢNH BÁO: rejectUnauthorized=false đang được bật cho môi trường dev/debug!");
    return { rejectUnauthorized: false };
  }

  return "require";
}

const globalForDb = globalThis as unknown as {
  _db?: ReturnType<typeof drizzle>;
  _sql?: ReturnType<typeof postgres>;
};

export function createSqlClient(customUrl?: string, env?: Env) {
  const currentEnv = env ?? getValidatedEnv();
  const targetUrl = customUrl ?? currentEnv.DATABASE_URL;
  const sslConfig = resolveSslConfig(targetUrl, currentEnv.PG_CA_CERT, currentEnv.NODE_ENV);

  return postgres(targetUrl, {
    max: currentEnv.DB_POOL_MAX,
    ssl: sslConfig,
    connect_timeout: 10,
    idle_timeout: 20,
  });
}

export function getDb() {
  if (!globalForDb._db) {
    const env = getValidatedEnv();
    globalForDb._sql = createSqlClient(env.DATABASE_URL, env);
    globalForDb._db = drizzle(globalForDb._sql);
  }
  return globalForDb._db;
}

export function getSqlClient() {
  if (!globalForDb._sql) {
    getDb();
  }
  return globalForDb._sql!;
}

export async function closeDb() {
  if (globalForDb._sql) {
    await globalForDb._sql.end();
    globalForDb._sql = undefined;
    globalForDb._db = undefined;
  }
}
