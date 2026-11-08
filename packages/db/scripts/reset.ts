import { getValidatedEnv, getMigrateUrl, createSqlClient, assertDestructiveOperationAllowed } from "../src";

async function runReset() {
  const env = getValidatedEnv();
  const targetUrl = getMigrateUrl(env);

  console.log("[db:reset] Đang kiểm tra an toàn mục tiêu database...");
  assertDestructiveOperationAllowed(targetUrl, "pnpm db:reset");

  console.log(`[db:reset] Rào an toàn thông qua. Bắt đầu reset database: ${targetUrl.replace(/:[^:@]+@/, ":***@")}`);
  const sql = createSqlClient(targetUrl, env);

  try {
    // Lấy danh sách các bảng người dùng trong schema public
    const tables = await sql<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public' AND tablename NOT LIKE 'pg_%';
    `;

    if (tables.length === 0) {
      console.log("[db:reset] Không có bảng nào trong schema public để drop.");
    } else {
      console.log(`[db:reset] Tìm thấy ${tables.length} bảng. Đang xóa toàn bộ dữ liệu/bảng...`);
      for (const { tablename } of tables) {
        console.log(`-> DROP TABLE IF EXISTS "${tablename}" CASCADE;`);
        await sql.unsafe(`DROP TABLE IF EXISTS "${tablename}" CASCADE;`);
      }
    }
    console.log("[db:reset] Reset cơ sở dữ liệu thành công!");
  } finally {
    await sql.end();
  }
}

runReset().catch((err) => {
  console.error("[db:reset] Lỗi thực thi reset:", err.message || err);
  process.exit(1);
});

