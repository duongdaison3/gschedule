# GSchedule — Webapp quản lý nhân sự & điều phối lịch giảng dạy (VP Hà Nội)

Nguồn sự thật: `docs/SRS_v2.md` (SRS-HR-SCHED-HN-002, DRAFT). Tiến độ/bàn giao: `docs/PROGRESS.md`. Câu hỏi nghiệp vụ treo: `docs/OPEN_QUESTIONS.md`. Môi trường DB: `docs/DB_ENVIRONMENTS.md`.

## Môi trường
Windows + PowerShell. Tìm kiếm bằng `rg -n "FR-ASG" docs/SRS_v2.md` hoặc `Select-String`; KHÔNG dùng grep/sed/awk hay cú pháp bash trong script. Chỉ dùng pnpm (không có `package-lock.json`). Không đọc/in giá trị trong `.env`, không dán chuỗi kết nối vào chat/log.

## Quy trình mỗi phiên (bắt buộc)
1. Mỗi phiên = đúng 1 prompt trong `.github/prompts/`; mở chat mới cho mỗi prompt.
2. Đọc `docs/PROGRESS.md` + CHỈ các mục SRS prompt nêu (`rg -n "FR-XXX-" docs/SRS_v2.md`, đọc theo dải dòng). Không đọc toàn bộ SRS hay toàn repo.
3. Lập kế hoạch ≤15 dòng rồi mới code. Chỉ hỏi người dùng khi gặp mục [CẦN XÁC NHẬN] chưa có mặc định trong skill `gschedule-rulebook`.
4. Xong khi: `pnpm check` xanh + tick đủ checklist + cập nhật `docs/PROGRESS.md` (≤30 dòng: đã làm, file chính, quyết định, việc treo).
5. Dùng CLI generator (create-next-app, shadcn, drizzle-kit) thay vì tự viết boilerplate. Không thêm thư viện ngoài stack nếu không nêu lý do.
6. API thư viện đổi nhanh (Next.js 16, Drizzle, Better Auth, Tailwind v4, shadcn): tra Context7 ("use context7") trước khi viết.
7. Commit nhỏ, Conventional Commits. Báo cáo cuối phiên ngắn: đã xong, lệnh đã chạy, việc treo.

## Stack
pnpm monorepo · Next.js 16 App Router + TypeScript strict · PostgreSQL trên Aiven (≥16) · Drizzle ORM + drizzle-kit · Better Auth · Tailwind v4 + shadcn/ui · TanStack Query/Table · react-hook-form + Zod · Vitest · Playwright · exceljs · pino.

## Kiến trúc
- `packages/domain`: hàm thuần, KHÔNG IO (quy đổi, TCS, CTP, CTV, conflict, state machine, phân bổ tháng); mọi logic tính toán có test.
- `packages/db`: schema Drizzle, migration, seed. `apps/web`: UI + server actions/route handlers.
- Luồng: UI → action/route → service (kiểm quyền → transaction → audit → optimistic lock) → repo (drizzle) ; service gọi domain.

## DB (Aiven)
- Dev: `DATABASE_URL` (role `gschedule_app`, quyền tối thiểu). Migration: `DATABASE_MIGRATE_URL` (role chủ sở hữu). Test tích hợp: `DATABASE_TEST_URL` (Docker cổng 5433 hoặc DB `*_test`), không bao giờ trùng `DATABASE_URL`.
- Gói free của Aiven giới hạn 20 kết nối, không có pooling: `DB_POOL_MAX` ≤ 5, pool singleton (hot-reload không tạo thêm), không mở kết nối trong vòng lặp, truy vấn theo tập hợp (mỗi round-trip có độ trễ mạng), transaction ngắn.
- `db:reset`, `db:seed`, truncate/drop chỉ chạy trên localhost hoặc DB `*_dev`/`*_test`. Không có tính năng cần superuser (Aiven không cấp).
- Dữ liệu cá nhân thật KHÔNG vào DB dev; fixture ẩn danh. Nơi lưu dữ liệu thật chờ chốt (P1-09). Khuyến nghị bật IP allowlist trên Aiven Console.

## Bất biến (vi phạm = lỗi)
- Tiền: integer VND. Tiết: integer centi-tiết (0.40 → 40) trong domain, `numeric(6,2)` trong DB. Cấm float cho tiền/tiết.
- Thời gian: `timestamptz`; `teaching_date` tính theo Asia/Ho_Chi_Minh; hiển thị vi-VN `dd/MM/yyyy`.
- Không xóa cứng bản ghi nghiệp vụ: dùng `status` + khoảng hiệu lực + audit.
- CCCD/tài khoản ngân hàng: string, mã hóa AES-256-GCM, mask mặc định; reveal/export cần quyền riêng + audit.
- Mọi mutation: kiểm quyền (role + data scope) → transaction → `audit_logs` (actor, before/after, reason) → check `version`.
- Rule, đơn giá, bậc CTP đọc từ bảng có version + effective_from/to; KHÔNG hardcode (số trong skill rulebook chỉ để seed/test).
- Mục [CẦN XÁC NHẬN]: dùng mặc định tạm trong skill rulebook, cấu hình được, kết quả `PENDING_REVIEW`, ghi `docs/OPEN_QUESTIONS.md`. Không tự suy diễn công thức tiền.
- Màu chỉ là lớp trực quan; trạng thái luôn có text/icon/badge. UI tiếng Việt; code/identifier tiếng Anh không dấu.
- Không log PII, không commit secret/dữ liệu thật.

## Test
Domain: Vitest, test biên theo SRS Phụ lục B + AT-xxx. Integration: Postgres qua `DATABASE_TEST_URL`. E2E: Playwright, chỉ luồng chính. Tên test chứa mã FR/AT để truy vết.

## Skill/MCP
- Chạm conversion/TCS/CTP/CTV/payroll/state machine → skill `gschedule-rulebook`.
- React/Next.js → `vercel-react-best-practices`; schema/index → `supabase-postgres-best-practices` (chỉ phần Postgres thuần, bỏ qua RLS/Supabase); UI/a11y → `impeccable` (`/impeccable audit`) chỉ ở P02/P08/P15/P16.
- MCP: chỉ Context7 bật mặc định. Playwright MCP chỉ ở P16. Không cần MCP cho DB: dùng `psql`/Drizzle Studio qua terminal.

## Phong cách
File <300 dòng; không comment thừa; tên hàm nêu nghiệp vụ; lỗi trả về có mã + thông điệp tiếng Việt.
