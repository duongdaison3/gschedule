import { getValidatedEnv, getMigrateUrl, createSqlClient } from "../src";

async function createAppRole() {
  const env = getValidatedEnv();
  const migrateUrl = getMigrateUrl(env);
  const appPassword = process.env.APP_ROLE_PASSWORD || "gschedule_app_dev_password";

  console.log(`[db:create-app-role] Kết nối bằng owner URL: ${migrateUrl.replace(/:[^:@]+@/, ":***@")}`);
  const ownerSql = createSqlClient(migrateUrl, env);

  try {
    const [info] = await ownerSql<[{ current_user: string; current_db: string }]>`
      SELECT current_user AS current_user, current_database() AS current_db;
    `;
    const ownerName = info.current_user;
    const dbName = info.current_db;

    console.log(`[db:create-app-role] Database: ${dbName}, Owner: ${ownerName}`);

    // 1. Tạo hoặc cập nhật role gschedule_app (idempotent)
    console.log("[db:create-app-role] Đảm bảo role 'gschedule_app' tồn tại và thiết lập mật khẩu...");
    await ownerSql.unsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'gschedule_app') THEN
          CREATE ROLE gschedule_app WITH LOGIN PASSWORD ${escapeLiteral(appPassword)};
        ELSE
          ALTER ROLE gschedule_app WITH LOGIN PASSWORD ${escapeLiteral(appPassword)};
        END IF;
      END
      $$;
    `);

    // 2. Cấp quyền cơ sở dữ liệu và schema
    console.log("[db:create-app-role] Phân quyền CONNECT và USAGE schema public...");
    await ownerSql.unsafe(`GRANT CONNECT ON DATABASE "${dbName}" TO gschedule_app;`);
    await ownerSql.unsafe(`GRANT USAGE ON SCHEMA public TO gschedule_app;`);

    // 3. Phân quyền trên bảng và sequence hiện có
    console.log("[db:create-app-role] Phân quyền SELECT, INSERT, UPDATE, DELETE trên bảng hiện hữu...");
    await ownerSql.unsafe(`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO gschedule_app;`);
    await ownerSql.unsafe(`GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO gschedule_app;`);

    // 4. Thiết lập quyền mặc định cho các bảng và sequence tạo trong tương lai bởi owner
    console.log(`[db:create-app-role] Thiết lập DEFAULT PRIVILEGES cho role ${ownerName}...`);
    await ownerSql.unsafe(
      `ALTER DEFAULT PRIVILEGES FOR ROLE "${ownerName}" IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO gschedule_app;`
    );
    await ownerSql.unsafe(
      `ALTER DEFAULT PRIVILEGES FOR ROLE "${ownerName}" IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO gschedule_app;`
    );
    // Dự phòng khi phiên tạo bảng không chỉ định explicit FOR ROLE
    await ownerSql.unsafe(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO gschedule_app;`
    );
    await ownerSql.unsafe(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO gschedule_app;`
    );

    // 5. Nếu bảng audit_logs đã tồn tại, thu hồi UPDATE/DELETE
    await ownerSql.unsafe(`
      DO $$
      BEGIN
        IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'audit_logs') THEN
          REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_logs FROM gschedule_app;
        END IF;
      END
      $$;
    `);

    console.log("[db:create-app-role] Hoàn tất thiết lập role gschedule_app thành công!");

    // 6. Kiểm tra kết nối thử bằng gschedule_app
    const appUrlObj = new URL(migrateUrl);
    appUrlObj.username = "gschedule_app";
    appUrlObj.password = appPassword;
    const testAppSql = createSqlClient(appUrlObj.toString(), env);

    const [testResult] = await testAppSql<[{ current_user: string }]>`SELECT current_user;`;
    console.log(`[db:create-app-role] Xác thực kiểm tra: Kết nối thành công bằng role '${testResult.current_user}'!`);
    await testAppSql.end();
  } finally {
    await ownerSql.end();
  }
}

function escapeLiteral(str: string): string {
  return "'" + str.replace(/'/g, "''") + "'";
}

createAppRole().catch((err) => {
  console.error("[db:create-app-role] Lỗi khởi tạo role:", err);
  process.exit(1);
});
