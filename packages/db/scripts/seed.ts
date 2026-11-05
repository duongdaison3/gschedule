import { getValidatedEnv, createSqlClient, assertDestructiveOperationAllowed } from "../src";

async function runSeed() {
  const env = getValidatedEnv();
  const targetUrl = env.DATABASE_URL;

  console.log("[db:seed] Đang kiểm tra an toàn mục tiêu database...");
  assertDestructiveOperationAllowed(targetUrl, "pnpm db:seed");

  console.log(`[db:seed] Rào an toàn thông qua. Bắt đầu seed database: ${targetUrl.replace(/:[^:@]+@/, ":***@")}`);
  const sql = createSqlClient(targetUrl, env);

  try {
    // Sẽ được cập nhật ở các phiên tiếp theo (P01 trở đi) khi có schema và dữ liệu mẫu ẩn danh
    console.log("[db:seed] Hiện chưa có dữ liệu seed nào cần nạp. Chuẩn bị hoàn tất.");
  } finally {
    await sql.end();
  }
}

runSeed().catch((err) => {
  console.error("[db:seed] Lỗi thực thi seed:", err.message || err);
  process.exit(1);
});
