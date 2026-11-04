---
description: "P00 — Bootstrap monorepo, DB, CI, shell UI, tiện ích nền (tiền/tiết/thời gian)"
agent: agent
---
# P00 — Bootstrap nền tảng
**Model gợi ý:** Gemini 3.8 Flash (thinking Low). **Đọc:** AGENTS.md; SRS §8.1, §12 (NFR-*).

## Mục tiêu
Repo chạy được từ đầu đến cuối: `pnpm i && pnpm db:up && pnpm db:migrate && pnpm dev` mở được app shell; `pnpm check` xanh; CI chạy cùng lệnh.

## Yêu cầu
1. pnpm workspaces: `apps/web` (create-next-app, Next.js 16, App Router, TS strict, Tailwind, `shadcn init`), `packages/domain` (TS thuần, Vitest), `packages/db` (Drizzle + drizzle-kit + pg). Tra Context7 trước khi cấu hình.
2. `docker-compose.yml`: postgres:17 cho dev và DB test riêng. Migration đầu tiên bật extension `btree_gist`, `pgcrypto`, `pg_trgm`, `unaccent`.
3. `packages/domain` cung cấp, kèm test: `money.ts` (VND integer, format `1.234.000 ₫`), `credits.ts` (centi-tiết: parse "0.40"→40, format, cộng, so sánh; cấm float), `time.ts` (Asia/Ho_Chi_Minh: `teachingDate(ts)`, ISO weekday, bắt đầu/kết thúc tuần, tuần giao thoa tháng), `result.ts` (Result/Err có mã lỗi), `errors.ts`.
4. Env validate bằng Zod (`.env.example`, không commit secret). Script: `db:up`, `db:migrate`, `db:seed`, `db:reset`, `check` (typecheck + lint + test).
5. GitHub Actions: chạy `pnpm check` với service Postgres.
6. App shell tiếng Việt: sidebar (desktop) + bottom nav (mobile), theme sáng/tối bằng token, error boundary, loading skeleton, toast, trang 404, `/api/health` (ping DB). Không hover-only (NFR-UX-001).
7. Tạo `docs/PROGRESS.md` (mẫu bàn giao) và `docs/OPEN_QUESTIONS.md` từ bảng "Mặc định tạm" trong skill `gschedule-rulebook` (mỗi dòng: ID, mặc định tạm, trạng thái CHƯA CHỐT).

## Không làm
Không viết bảng nghiệp vụ, auth, hay màn hình nghiệp vụ (các phần sau).

## Checklist đầu ra
- [ ] Cấu trúc monorepo đúng; `pnpm i` sạch, không cảnh báo peer nghiêm trọng
- [ ] `docker compose up` có Postgres 17; migration 0000 bật đủ 4 extension
- [ ] `credits.ts`: test `0.40→40`, `compare(41,40)>0`, không dùng `Number` float khi cộng
- [ ] `time.ts`: test `2026-04-30T17:30Z` → teachingDate 01/05 (UTC+7), tuần giao thoa 30/04–01/05
- [ ] `money.ts`: từ chối số thập phân/âm không hợp lệ ở biên
- [ ] Env sai → app báo lỗi rõ ràng khi khởi động
- [ ] `/api/health` trả 200 khi DB lên, 503 khi DB tắt
- [ ] Shell hiển thị đúng trên 375px và 1440px; focus bàn phím thấy rõ
- [ ] CI xanh trên nhánh thử
- [ ] `docs/PROGRESS.md`, `docs/OPEN_QUESTIONS.md` đã tạo; `docs/SRS_v2.md` tồn tại
- [ ] `pnpm check` xanh

## Khi xong
Cập nhật `docs/PROGRESS.md`; liệt kê phiên bản thực tế của Next.js, Drizzle, Better Auth đã cài.
