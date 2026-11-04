---
description: "P02 — Master data: pháp nhân, trường, phân hiệu, lớp, môn, năm học, địa điểm, lịch trường, alias"
agent: agent
---
# P02 — Master data
**Model:** Flash (Med). **Đọc:** SRS §8.3 (companies…school_calendars), §11.3, FR-MD-001/002, Phụ lục A.1–A.2. **Skill:** supabase-postgres-best-practices, vercel-react-best-practices.

## Mục tiêu
Danh mục chuẩn có mã duy nhất, hiệu lực, alias — nền cho assignment, lịch, import.

## Yêu cầu
1. Bảng: `companies` (seed GAIA, NEWG, 8BC), `subjects` (KNS, STEM, STEM_ROBOTICS, CDS, AI, OTHER), `academic_years`, `schools`, `school_campuses`, `classes` (unique campus + academic_year + class_code), `locations` (kind HOME/OFFICE/SCHOOL/OTHER, tọa độ tùy chọn), `school_calendars` (calendar_type ACTIVE/HOLIDAY/SCHOOL_OFF), `period_definitions` (period_index 1..6, buổi, giờ — cấu hình), `certificate_types`, `entity_aliases` (entity_type, raw_value, normalized_value, entity_id, source).
2. Mọi bảng: code UNIQUE, status, valid_from/to, created/updated by/at, `version`, soft-archive. Dùng chung một mẫu CRUD (DataTable + form + audit) để các phần sau tái dùng.
3. Tìm kiếm không dấu (unaccent + pg_trgm) và bộ lọc giữ trạng thái khi quay lại danh sách.
4. `packages/domain/class-range.ts`: parse `6A1-6A5` → `[6A1…6A5]`, danh sách `6A1, 6A3`; chuỗi không parse được → trả lỗi (không đoán). Có test.
5. `normalizeName()` cho alias (bỏ dấu, thường hóa, gộp khoảng trắng) nhưng KHÔNG xóa hậu tố phân hiệu.
6. UI quản lý danh mục + trang xem/thêm alias; màn hình lịch trường (đánh dấu ngày nghỉ/trường báo nghỉ).

## Không làm
Không import dữ liệu thật (P05). Không tự gộp trường theo tên gần giống.

## Checklist đầu ra
- [ ] Seed đủ companies/subjects; `NEW G`/`NewG` chỉ tồn tại như alias của NEWG
- [ ] Unique `(campus_id, academic_year_id, class_code)` có test vi phạm
- [ ] valid_from ≤ valid_to (CHECK) và test
- [ ] `class-range`: `6A1-6A5` → 5 lớp; `6A5-6A1`, `6A1-7B2`, rỗng → lỗi có mã
- [ ] Tìm "truong tieu hoc" khớp "Trường Tiểu học"
- [ ] Mỗi thao tác tạo/sửa/lưu trữ có audit; sửa đồng thời báo xung đột version
- [ ] Chỉ role được phép thấy menu/danh mục (kiểm tra bằng role COORDINATOR vs TEACHER)
- [ ] `pnpm check` xanh; PROGRESS cập nhật
