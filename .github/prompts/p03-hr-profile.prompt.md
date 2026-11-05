---
description: "P03 — Hồ sơ nhân sự/CTV, hợp đồng, chứng chỉ, địa điểm xuất phát, dữ liệu nhạy cảm, offboarding"
agent: agent
---
# P03 — HR Profile 360
**Model:** Flash (Med), sau đó model mạnh review phần mã hóa/mask. **Đọc:** SRS §5.1, FR-HR-001..008, §8.1, §8.3 (employees…employee_locations), NFR-SEC-001/002, AT-001 (phần alias), AT-003, AT-004, AT-031.

## Mục tiêu
Hồ sơ đầy đủ, an toàn, có hàm kiểm tra hiệu lực hợp đồng/chứng chỉ dùng lại cho scheduling/assignment.

## Yêu cầu
1. Bảng: `employees` (employee_code UNIQUE, full_name, employment_type STAFF/CTV, work_status, phone, emails, dob, join_date, official_date, resign_date, địa chỉ), `employee_code_aliases` (alias_code UNIQUE theo source_system), `employment_contracts`, `employee_certificates` (certificate_type, issue/expiry, status UNKNOWN/PENDING/VERIFIED/EXPIRED/REVOKED, verified_by), `employee_documents` (metadata + hash; lớp lưu trữ qua interface, bản local cho dev), `employee_locations` (N/V/K/OTHER, is_default, valid_from/to), `employee_sensitive` (cccd_enc, cccd_last4, bank_account_enc, bank_name — bảng riêng).
2. Gắn FK `users.employee_id` (TODO từ P01). Hồ sơ DRAFT → VERIFIED; phát hiện trùng CCCD/email/điện thoại/alias khi tạo.
3. Mã hóa AES-256-GCM cho CCCD/bank (khóa từ env, có version khóa). Giao diện mask mặc định; `reveal` và `export` là permission riêng, mỗi lần reveal ghi audit action REVEAL.
4. Domain: `isContractActive(emp, date)`, `hasValidCertificate(emp, certTypeId, date)` (chỉ VERIFIED và chưa hết hạn), `daysUntil(date)`. Có test biên (đúng ngày hết hạn).
5. Offboarding: nhập ngày thôi việc → khóa đăng nhập, giữ lịch sử, trả danh sách lớp/ca tương lai cần bàn giao qua interface `listFutureAssignments(employeeId)` (tạm trả rỗng, nối ở P06/P07).
6. Nhắc trước 7 ngày thử việc/hết hạn hợp đồng: hàm `findExpiring(daysBefore)` + endpoint cron + ghi vào outbox (gửi thật ở P15); số ngày và người nhận cấu hình được.
7. UI Profile 360 (tab: thông tin, hợp đồng, chứng chỉ, địa điểm, phân công [placeholder], lịch sử). Hồ sơ CTV có thuộc tính hợp đồng/đơn giá riêng (FR-HR-008) — chỉ lưu, chưa tính tiền.

## Checklist đầu ra
- [ ] AT-003/AT-004 ở mức domain: thiếu/hết hạn chứng chỉ, ngoài hợp đồng, đã offboard → không hợp lệ
- [ ] Chứng chỉ mới tạo mặc định UNKNOWN (không TRUE)
- [ ] CCCD/bank lưu dạng chuỗi, giữ số 0 đầu; DB chỉ có ciphertext + last4 (kiểm bằng truy vấn)
- [ ] AT-031 (phần HR): export người dùng thiếu quyền nhạy cảm không chứa CCCD/bank
- [ ] User không có `reveal` thấy mask; reveal sinh audit REVEAL
- [ ] TEACHER/COLLABORATOR chỉ xem hồ sơ của mình ở dạng giới hạn
- [ ] Trùng CCCD/email/điện thoại bị cảnh báo; employee_code trùng bị chặn bằng UNIQUE
- [ ] Offboard khóa tài khoản nhưng không xóa bản ghi nào
- [ ] Log ứng dụng không chứa PII (rg test)
- [ ] `pnpm check` xanh; PROGRESS cập nhật
