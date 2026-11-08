# Hướng dẫn Môi trường Cơ sở dữ liệu — GSchedule (PostgreSQL / Aiven)

Tài liệu này quy định kiến trúc phân tầng môi trường cơ sở dữ liệu, các biến kết nối, phân quyền vai trò (RBAC mức database), và các giới hạn kỹ thuật của dịch vụ Aiven PostgreSQL.

---

## 1. Phân tầng Môi trường

| Môi trường | Mục đích | Nơi lưu trữ | Quy ước tên DB | Kết nối / Vai trò |
|---|---|---|---|---|
| **Localhost** | Phát triển offline / Dự phòng Docker | Docker container (`localhost:5432`) | `gschedule_dev` | `postgres` |
| **Integration Test** | Chạy test tích hợp tự động | Docker container (`localhost:5433`) hoặc DB test riêng | `gschedule_test` (bắt buộc kết thúc `_test`) | `postgres` / `avnadmin` |
| **Development** | Môi trường dev chính của nhóm | Aiven Cloud PostgreSQL | `gschedule_dev` | `gschedule_app` (app) & `avnadmin` (migration) |
| **Staging / UAT** | Kiểm thử tiền phát hành | DB cloud tách biệt hoàn toàn | `gschedule_staging` | `gschedule_app` & owner riêng |
| **Production** | Môi trường vận hành thực tế | Dịch vụ trả phí riêng, có SLA/PITR | `gschedule_prod` | `gschedule_app` & owner riêng |

> [!WARNING]
> **Tuyệt đối không đưa dữ liệu nhân sự thật vào cơ sở dữ liệu Development.** Tất cả dữ liệu thử nghiệm phải là fixture được ẩn danh hóa. Địa điểm và chính sách lưu trữ dữ liệu chính thức đang chờ phê duyệt tại mục `P1-09` trong `docs/OPEN_QUESTIONS.md`.

---

## 2. Các Biến Môi Trường Kết Nối

| Tên biến | Bắt buộc | Mô tả | Giá trị mẫu |
|---|---|---|---|
| `DATABASE_URL` | **Có** | Chuỗi kết nối của ứng dụng chạy runtime (sử dụng role `gschedule_app`). | `postgres://gschedule_app:pass@pg.aivencloud.com:12345/gschedule_dev?sslmode=require` |
| `DATABASE_MIGRATE_URL` | Không | Kết nối trực tiếp (không qua pooler) dành cho lệnh migration (sử dụng role owner `avnadmin`). Nếu để trống sẽ dùng `DATABASE_URL`. | `postgres://avnadmin:pass@pg.aivencloud.com:12345/gschedule_dev?sslmode=require` |
| `DATABASE_TEST_URL` | Khi test | Dành riêng cho test tích hợp. Bắt buộc có hậu tố `_test` và không được trùng `DATABASE_URL`. | `postgresql://postgres:pass@localhost:5433/gschedule_test` |
| `PG_CA_CERT` | Không | Đường dẫn tới file CA `.pem` hoặc nội dung chuỗi PEM để xác thực chứng chỉ TLS. | `./certs/aiven-ca.pem` |
| `DB_POOL_MAX` | Không | Giới hạn kết nối pool tối đa của ứng dụng (mặc định: `5`). | `5` |
| `ALLOW_DESTRUCTIVE_DB`| Không | Cờ bypass rào an toàn cho phép `db:reset`/`db:seed` (mặc định: `0`). | `0` |

---

## 3. Phân Quyền Vai Trò DB (Principle of Least Privilege)

Hệ thống phân tách nghiêm ngặt 2 vai trò truy cập cơ sở dữ liệu:

### 3.1. Role Chủ sở hữu (`avnadmin` / `postgres`)
- **Dùng cho:** Chạy migration schema (`pnpm db:migrate`), cấu hình extension, thiết lập vai trò (`pnpm db:create-app-role`).
- **Quyền hạn:** Toàn quyền DDL (CREATE TABLE, ALTER TABLE, DROP TABLE, CREATE EXTENSION).

### 3.2. Role Ứng dụng (`gschedule_app`)
- **Dùng cho:** Ứng dụng Next.js runtime (`apps/web`), API routes, server actions (`DATABASE_URL`).
- **Quyền hạn:**
  - `GRANT CONNECT ON DATABASE`
  - `GRANT USAGE ON SCHEMA public`
  - `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public`
  - `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public`
  - Tự động gán quyền DML trên bảng tạo mới thông qua `ALTER DEFAULT PRIVILEGES`.
  - **Hạn chế:** KHÔNG có quyền DDL (không CREATE/ALTER/DROP bảng); KHÔNG có quyền `UPDATE` hoặc `DELETE` trên bảng `audit_logs` (bảo đảm toàn vẹn vết kiểm toán).

### 3.3. Script tạo role tự động
Lệnh tạo role chạy ở chế độ idempotent (có thể chạy nhiều lần mà không phát sinh lỗi):
```bash
pnpm db:create-app-role
```

---

## 4. Giới Hạn Dịch Vụ Aiven PostgreSQL & Quy Tắc Vận Hành

### 4.1. Giới hạn gói Free Tier của Aiven
1. **Số kết nối tối đa (Max Connections):** 20 kết nối đồng thời. Vì không có PgBouncer tích hợp ở gói free, hệ thống bắt buộc đặt cấu hình `DB_POOL_MAX` ≤ 5 và dùng pool singleton để tránh cạn kiệt kết nối khi hot-reload.
2. **Cơ chế Standby (Idle Auto-Pause):** Gói free tự động tạm dừng khi không có truy vấn trong thời gian dài. Khi truy vấn lại có thể mất 5–10 giây khởi động lại dịch vụ.
3. **Không hỗ trợ Database Forking và IP tĩnh:** Không thể tạo bản sao phân nhánh nhanh.
4. **Không cấp quyền Superuser:** Aiven không cấp quyền `superuser` cho người dùng; tuy nhiên `avnadmin` có đầy đủ quyền tạo database, role, cài đặt extension chuẩn (`btree_gist`, `pgcrypto`, `pg_trgm`, `unaccent`) và quản lý quyền truy cập.

### 4.2. Khuyến nghị Bảo mật & Vận hành
- **IP Allowlist:** Kích hoạt tính năng *IP Allowlist* trên Aiven Console, chỉ cho phép các IP cố định của lập trình viên và địa chỉ văn phòng truy cập cổng cơ sở dữ liệu.
- **SSL / TLS:** Luôn giữ tham số `sslmode=require` trên chuỗi kết nối. Trong môi trường production, tuyệt đối cấm cấu hình `rejectUnauthorized: false`.
- **Region:** Lựa chọn vùng địa lý Đông Nam Á (như Singapore - `ap-southeast-1`) để tối ưu hóa độ trễ đường truyền về Hà Nội (< 40ms).

