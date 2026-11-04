# GSchedule — Webapp quản lý nhân sự & điều phối lịch giảng dạy (VP Hà Nội)

Nguồn sự thật: `docs/SRS_v2.md` (SRS-HR-SCHED-HN-002, DRAFT). Tiến độ/bàn giao giữa các phiên: `docs/PROGRESS.md`. Câu hỏi nghiệp vụ treo: `docs/OPEN_QUESTIONS.md`.

## Quy trình mỗi phiên (bắt buộc)
1. Mỗi phiên = đúng 1 prompt trong `.github/prompts/`. Mở phiên mới (chat mới) cho mỗi prompt.
2. Đọc `docs/PROGRESS.md` + CHỈ các mục SRS prompt nêu (dùng `grep -n "FR-XXX-" docs/SRS_v2.md`, `sed -n`). Không đọc toàn bộ SRS, không quét toàn repo.
3. Lập kế hoạch ≤15 dòng rồi mới code. Chỉ hỏi người dùng khi gặp mục [CẦN XÁC NHẬN] chưa có mặc định trong skill `gschedule-rulebook`.
4. Xong khi: `pnpm check` xanh (typecheck + lint + test) + tick đủ checklist của prompt + cập nhật `docs/PROGRESS.md` (≤30 dòng: đã làm, file chính, quyết định, việc treo).
5. Dùng CLI generator (create-next-app, shadcn, drizzle-kit) thay vì tự viết boilerplate. Không thêm thư viện ngoài stack nếu không nêu lý do.
6. API thư viện đổi nhanh (Next.js 16, Drizzle, Better Auth, Tailwind, shadcn): tra Context7 ("use context7") trước khi viết, không dựa vào trí nhớ.
7. Commit nhỏ theo Conventional Commits. Báo cáo cuối phiên ngắn: việc đã xong, lệnh đã chạy, việc treo.

## Stack (đề xuất, đã chốt cho dự án)
pnpm monorepo · Next.js 16 App Router + TypeScript strict · PostgreSQL 17 · Drizzle ORM + drizzle-kit · Better Auth · Tailwind + shadcn/ui · TanStack Query/Table · react-hook-form + Zod · Vitest · Playwright · exceljs · pino.

## Kiến trúc
- `packages/domain`: hàm thuần, KHÔNG IO (quy đổi, TCS, CTP, CTV, conflict, state machine, month allocation). Mọi logic tính toán nằm ở đây và có test.
- `packages/db`: schema Drizzle, migration, seed. `apps/web`: UI + server actions/route handlers.
- Luồng: UI → action/route → service (kiểm quyền → transaction → audit → optimistic lock) → repo (drizzle) ; service gọi domain.

## Bất biến (vi phạm = lỗi)
- Tiền: integer VND. Tiết: integer centi-tiết (0.40 → 40) trong domain, `numeric(6,2)` trong DB. Cấm float cho tiền/tiết.
- Thời gian: `timestamptz`; `teaching_date` tính theo Asia/Ho_Chi_Minh; hiển thị vi-VN `dd/MM/yyyy`.
- Không xóa cứng bản ghi nghiệp vụ: dùng `status` + khoảng hiệu lực + audit.
- CCCD/tài khoản ngân hàng: string, mã hóa AES-256-GCM, mask mặc định; reveal/export cần quyền riêng + audit.
- Mọi mutation: kiểm quyền (role + data scope) → transaction → `audit_logs` (actor, before/after, reason) → check `version` (optimistic lock).
- Rule, đơn giá, bậc CTP đọc từ bảng có version + effective_from/to. KHÔNG hardcode (số trong skill rulebook chỉ dùng để seed/test).
- Mục [CẦN XÁC NHẬN]: dùng mặc định tạm trong skill rulebook, cấu hình được, kết quả trạng thái `PENDING_REVIEW`, ghi vào `docs/OPEN_QUESTIONS.md`. Không tự suy diễn công thức tiền.
- Màu sắc chỉ là lớp trực quan; trạng thái luôn có text/icon/badge. UI tiếng Việt; code/identifier tiếng Anh không dấu.
- Không log PII, không commit secret/dữ liệu thật. Fixture phải ẩn danh.

## Test
- Domain: Vitest, test biên theo SRS Phụ lục B + AT-xxx. Integration: Postgres thật qua docker compose. E2E: Playwright, chỉ luồng chính.
- Mỗi FR-xxx MUST có ≥1 test; ghi mã FR/AT vào tên test để truy vết.

## Skill/MCP
- Chạm conversion/TCS/CTP/CTV/payroll/state machine → dùng skill `gschedule-rulebook`.
- Viết React/Next.js → skill `vercel-react-best-practices`; thiết kế bảng/index/RLS → `supabase-postgres-best-practices`; rà UI/a11y → `web-design-guidelines` (nếu đã cài).
- MCP: chỉ Context7 bật mặc định (giảm token). Playwright MCP chỉ bật ở P16.

## Phong cách
File <300 dòng; không comment thừa; tên hàm nêu nghiệp vụ; lỗi trả về có mã + thông điệp tiếng Việt.
