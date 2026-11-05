---
description: "P00b — Điều chỉnh môi trường: Aiven PostgreSQL (cloud) + Windows/PowerShell; rào an toàn DB, vai trò DB, cập nhật các prompt sau"
agent: agent
---
# P00b — Môi trường Aiven + Windows
**Model:** Gemini 3.8 Flash (thinking Medium). **Đọc:** docs/PROGRESS.md, AGENTS.md, .env.example, packages/db, package.json, .github/workflows. KHÔNG in hoặc đọc ra giá trị trong `.env`.

## Bối cảnh
P00 đã xong. DB chính chuyển từ Docker sang Aiven PostgreSQL (`sslmode=require`); docker-compose giữ làm phương án offline/test. Máy dev: Windows + PowerShell. Cần chỉnh để (1) test và lệnh phá hủy không bao giờ chạm DB cloud dùng chung, (2) lệnh/script chạy được trên Windows, (3) các prompt P01–P16 khớp môi trường mới.

## Yêu cầu
1. **Biến môi trường (Zod + .env.example, chỉ placeholder):**
   - `DATABASE_URL` → Aiven, DB riêng cho dev (ví dụ `gschedule_dev`); dữ liệu thật sau này dùng DB/service KHÁC.
   - `DATABASE_MIGRATE_URL` → kết nối trực tiếp (không qua pooler) dùng cho migration; nếu trống thì dùng `DATABASE_URL`.
   - `DATABASE_TEST_URL` → mặc định Docker `localhost:5433`; chỉ test tích hợp dùng biến này.
   - `PG_CA_CERT` (đường dẫn hoặc PEM, tùy chọn), `DB_POOL_MAX` (mặc định 5).
2. **SSL/pool:** giữ `sslmode=require`; nếu có `PG_CA_CERT` thì xác thực chứng chỉ bằng CA; cấm `rejectUnauthorized: false` trong code production (chỉ cho phép sau cờ dev, có cảnh báo log). Pool nhỏ để không vượt giới hạn kết nối của gói Aiven.
3. **Rào an toàn (bắt buộc):** `db:reset`, `db:seed`, mọi truncate/drop và setup của test từ chối chạy nếu: host không phải `localhost`/`127.0.0.1` VÀ tên DB không kết thúc `_dev` hoặc `_test`, trừ khi `ALLOW_DESTRUCTIVE_DB=1`. Test tích hợp từ chối chạy khi `DATABASE_TEST_URL` trống hoặc trùng `DATABASE_URL`. Có test cho các rào này.
4. **Vai trò DB:** script `db:create-app-role` (SQL idempotent) tạo role `gschedule_app` quyền tối thiểu (không DDL, không UPDATE/DELETE trên `audit_logs` — hoàn thiện ở P01). App chạy bằng `gschedule_app`; migration chạy bằng role chủ sở hữu (avnadmin hoặc tương đương). Ghi cách dùng vào `docs/DB_ENVIRONMENTS.md` (dev/test/staging/prod, ai dùng URL nào, giới hạn gói Aiven cần kiểm tra: số kết nối, dung lượng, sao lưu/PITR, region).
5. **Windows/PowerShell:**
   - Thêm vào AGENTS.md mục "Môi trường": Windows + PowerShell; tìm kiếm dùng `rg` hoặc `Select-String`, không dùng `grep/sed/awk`; không dùng lệnh bash trong scripts.
   - Mọi script `package.json` viết bằng Node/tsx hoặc công cụ đa nền tảng (`cross-env`, `rimraf`); không `rm -rf`, `&&` kiểu bash trong script quan trọng.
   - Thêm `.gitattributes` (`* text=auto eol=lf`) và kiểm tra `.editorconfig`.
   - Dự án chỉ dùng pnpm: xóa `package-lock.json` nếu còn, thêm `"packageManager": "pnpm@<phiên bản đang dùng>"`.
6. **Bí mật:** xác nhận `.env` nằm trong `.gitignore` và `git ls-files .env` rỗng; kiểm tra lịch sử git không chứa chuỗi kết nối (`git log -S "aivencloud" --oneline`). Nếu từng commit: báo người dùng đổi mật khẩu Aiven. Thêm vào AGENTS.md: không in/đọc giá trị `.env`, không dán chuỗi kết nối vào chat/log; khuyến nghị bật IP allowlist trên Aiven.
7. **CI:** chạy test tích hợp bằng service container Postgres; KHÔNG đưa thông tin đăng nhập Aiven vào CI.
8. **Đối chiếu kit v2:** AGENTS.md và p01/p13/p16 đã được sửa sẵn trong kit v2 (mục Môi trường, DB, Test, audit bằng role app, trigger khóa kỳ, backup/TLS). Chỉ kiểm tra AGENTS.md trong repo khớp bản kit v2; nếu repo còn bản cũ thì chép bản mới, không tự viết lại.
8b. **Giới hạn gói Aiven (kiểm tra trên Console, ghi vào `docs/DB_ENVIRONMENTS.md`):** gói free thường giới hạn 20 kết nối, không pooling, không fork, không IP tĩnh, tự tắt khi không hoạt động → `DB_POOL_MAX` ≤ 5; không dùng gói free cho môi trường có người dùng thật. Aiven không cấp superuser: `avnadmin` tạo được database/role/extension/GRANT/REVOKE, đủ cho kế hoạch.
8c. **Quyền mặc định:** vì bảng sẽ do owner tạo, script role phải có `ALTER DEFAULT PRIVILEGES FOR ROLE <owner> IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO gschedule_app` và REVOKE riêng cho `audit_logs` SAU khi bảng tồn tại (P01).
9. **OPEN_QUESTIONS.md:** thêm `P1-09` — "Nơi lưu dữ liệu nhân sự: region Aiven, gói dịch vụ, sao lưu/PITR, SLA, rà soát yêu cầu khi dữ liệu cá nhân lưu ở nhà cung cấp cloud/ngoài nước" — chủ trì: Ban quản lý + IT (+ pháp chế), hạn: trước khi nhập dữ liệu thật.

## Checklist đầu ra
- [ ] `.env.example` có đủ 5 biến mới, không chứa giá trị thật; app báo lỗi rõ khi thiếu biến
- [ ] `pnpm db:reset` trên URL Aiven bị từ chối (có test); trên Docker/`_test`/`_dev` chạy được
- [ ] Test tích hợp dùng DB riêng, từ chối khi `DATABASE_TEST_URL` = `DATABASE_URL`
- [ ] `pnpm db:migrate` chạy được bằng `DATABASE_MIGRATE_URL`; kết nối app dùng pool ≤ `DB_POOL_MAX`
- [ ] Không còn `rejectUnauthorized: false` ngoài nhánh dev (rg kiểm chứng)
- [ ] `db:create-app-role` idempotent (chạy 2 lần không lỗi); app kết nối được bằng `gschedule_app`
- [ ] Tất cả script `package.json` chạy được trong PowerShell; không còn `package-lock.json`
- [ ] `.gitattributes`, mục Môi trường trong AGENTS.md, `docs/DB_ENVIRONMENTS.md` đã có
- [ ] `git ls-files .env` rỗng; lịch sử git không có chuỗi kết nối
- [ ] AGENTS.md khớp kit v2; `docs/DB_ENVIRONMENTS.md` ghi giới hạn gói; OPEN_QUESTIONS có P1-09
- [ ] `pnpm check` xanh; PROGRESS cập nhật (nêu rõ DB nào dùng cho dev/test)
