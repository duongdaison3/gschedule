import fs from "node:fs";
import path from "node:path";
import { getValidatedEnv, getMigrateUrl, createSqlClient } from "../src";

async function runMigrate() {
  const env = getValidatedEnv();
  const migrateUrl = getMigrateUrl(env);

  console.log(`Bắt đầu chạy migration với URL: ${migrateUrl.replace(/:[^:@]+@/, ":***@")}`);
  const sql = createSqlClient(migrateUrl, env);

  const migrationsDir = path.resolve(__dirname, "../migrations");
  if (!fs.existsSync(migrationsDir)) {
    console.log("Thư mục migrations không tồn tại. Bỏ qua.");
    await sql.end();
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  console.log(`Tìm thấy ${files.length} file migration...`);
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
