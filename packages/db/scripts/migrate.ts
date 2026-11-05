import fs from "node:fs";
import path from "node:path";
import { getSqlClient } from "../src";

async function runMigrate() {
  const sql = getSqlClient();
  const migrationsDir = path.resolve(__dirname, "../migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  console.log(`Bắt đầu chạy ${files.length} migrations...`);
  for (const file of files) {
    const filePath = path.join(migrationsDir, file);
    const content = fs.readFileSync(filePath, "utf-8");
    console.log(`-> Thực thi migration: ${file}`);
    await sql.unsafe(content);
  }
  console.log("Migration hoàn tất thành công!");
  await sql.end();
}

runMigrate().catch((err) => {
  console.error("Migration thất bại:", err);
  process.exit(1);
});
