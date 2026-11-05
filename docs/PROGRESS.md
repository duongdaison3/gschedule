# Bàn giao tiến độ — GSchedule (VP Hà Nội)

## Phiên hiện tại: P00b — Điều chỉnh môi trường Aiven PostgreSQL + Windows/PowerShell
- **Ngày hoàn thành:** 2026-11-05
- **Trạng thái `pnpm check`:** XANH (Typecheck + Lint + 32 Unit Tests Vitest).

### Những việc đã hoàn thành
1. **Biến môi trường & cấu hình kết nối DB**:
   - `DATABASE_URL`: Aiven PostgreSQL (`gschedule_dev`) dùng role `gschedule_app` quyền tối thiểu, `sslmode=require`.
   - `DATABASE_MIGRATE_URL`: Kết nối trực tiếp dành cho migration (role owner `avnadmin`); tự fallback về `DATABASE_URL` nếu để trống.
   - `DATABASE_TEST_URL`: Dành riêng cho test tích hợp (mặc định Docker `localhost:5433/gschedule_test` hoặc DB có hậu tố `_test`), từ chối khi rỗng hoặc trùng `DATABASE_URL`.
   - `DB_POOL_MAX` (mặc định 5, phù hợp gói free Aiven ≤ 20 kết nối), hỗ trợ `PG_CA_CERT`, cấm `rejectUnauthorized: false` trên production.
2. **Rào an toàn DB (`packages/db/src/safety.ts`)**:
   - Chặn `pnpm db:reset`, `pnpm db:seed`, truncate/drop trên host không phải localhost VÀ không có hậu tố `_dev`/`_test` (trừ khi có `ALLOW_DESTRUCTIVE_DB=1`).
   - Đã có 19 unit test kiểm thử toàn diện các điều kiện an toàn (`packages/db/src/__tests__/safety.test.ts`).
3. **Phân quyền & vai trò DB (`packages/db/scripts/create-app-role.ts`)**:
   - Script idempotent tạo role `gschedule_app`, cấp quyền CONNECT, USAGE schema public, SELECT/INSERT/UPDATE/DELETE trên các bảng và sequence, thiết lập DEFAULT PRIVILEGES, chặn UPDATE/DELETE trên `audit_logs`.
4. **Môi trường Windows/PowerShell & Chuẩn hóa Git**:
   - Thêm `.gitattributes` (`* text=auto eol=lf`), `.editorconfig`, `"packageManager": "pnpm@11.5.1"`.
   - Viết tài liệu toàn diện `docs/DB_ENVIRONMENTS.md` ghi nhận giới hạn Aiven (kết nối, auto-sleep, IP allowlist).
   - Bổ sung câu hỏi `P1-09` vào `docs/OPEN_QUESTIONS.md`.

### File chính thay đổi
- `packages/db/src/safety.ts`, `packages/db/src/env.ts`, `packages/db/src/index.ts`, `packages/db/src/__tests__/safety.test.ts`
- `packages/db/scripts/create-app-role.ts`, `migrate.ts`, `reset.ts`, `seed.ts`
- `docs/DB_ENVIRONMENTS.md`, `docs/OPEN_QUESTIONS.md`, `AGENTS.md`, `.gitattributes`, `.editorconfig`, `.env.example`, `package.json`

### Quyết định & Phân bổ môi trường DB
- **Dev:** Aiven PostgreSQL cloud (`gschedule_dev`) với role `gschedule_app`, dữ liệu fixture ẩn danh.
- **Test:** Docker Postgres local cổng 5433 (`gschedule_test`) hoặc container CI; không đưa secret Aiven vào CI.
- **Việc treo:** P1-09 (Chốt vị trí lưu trữ, SLA, PITR và gói dịch vụ chính thức trước khi nhập dữ liệu thật).
