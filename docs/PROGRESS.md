# Bàn giao tiến độ — GSchedule (VP Hà Nội)

## Phiên hiện tại: P00 — Bootstrap nền tảng monorepo, DB, CI, shell UI, tiện ích nền
- **Ngày hoàn thành:** 2026-11-05
- **Trạng thái `pnpm check`:** XANH (Typecheck + Lint + 13 Unit Tests Vitest).

### Những việc đã hoàn thành
1. **Monorepo setup**: Chuyển đổi thành pnpm workspaces gồm 3 package/app:
   - `apps/web`: Next.js 16 (App Router), TypeScript strict, Tailwind v4, shadcn, Lucide icon.
   - `packages/domain`: Thư viện tính toán thuần túy không I/O, Vitest.
   - `packages/db`: Drizzle ORM, postgres driver, drizzle-kit, migration script.
2. **PostgreSQL Cloud (Aiven) & Migration 0000**:
   - Chuyển cấu hình kết nối sang Aiven PostgreSQL (`sslmode=require`).
   - Đã thực thi migration `0000_init_extensions.sql` thành công lên Aiven: kích hoạt đủ 4 extension `btree_gist`, `pgcrypto`, `pg_trgm`, `unaccent`.
   - Vẫn lưu giữ `docker-compose.yml` (port 5432 / 5433) làm phương án dự phòng/local offline.
   - Script chạy migration tự động qua TS: `pnpm db:migrate`.
3. **Tiện ích nền tảng Domain & Unit Tests**:
   - `money.ts`: Kiểu `MoneyVND` integer VND, format chuẩn Việt Nam (`1.234.000 ₫`), từ chối số thập phân và số âm.
   - `credits.ts`: Kiểu `CentiCredits` integer (0.40 -> 40 centi-tiết), hàm so sánh/cộng không dùng float.
   - `time.ts`: Quản lý timezone `Asia/Ho_Chi_Minh` (UTC+7), `getTeachingDate`, weekday ISO, tuần giao thoa tháng (30/04 - 01/05).
   - `result.ts` & `errors.ts`: Result monad (`ok`, `err`) và `DomainError` với mã định danh nghiệp vụ.
4. **App Shell & NFR-UX-001**:
   - Giao diện tiếng Việt: Sidebar cố định desktop + Bottom nav trên mobile (375px), hỗ trợ outline focus bàn phím rõ ràng.
   - Error boundary (`error.tsx`), skeleton loading (`loading.tsx`), trang 404 (`not-found.tsx`), API health check ping database (`/api/health`).
5. **CI/CD**:
   - `.github/workflows/ci.yml`: Chạy tự động `pnpm check` kết nối service container Postgres 17.

### Phiên bản thực tế các thư viện chính
- `next`: `16.4.5`
- `react`: `19.3.0`
- `drizzle-orm`: `^0.45.4`
- `drizzle-kit`: `^0.31.11`
- `postgres`: `^4.0.0`
- `vitest`: `^3.0.7`
- `typescript`: `^5.9.3`
- `pnpm`: `11.5.1`

### Việc tồn đọng / Kế hoạch phiên tiếp theo
- Chuẩn bị bước vào **P01 — Schema nhân sự, hợp đồng & xác thực (Better Auth)**.

