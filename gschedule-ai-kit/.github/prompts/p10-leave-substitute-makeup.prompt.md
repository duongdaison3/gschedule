---
description: "P10 — Nghỉ phép, dạy thay, trường báo nghỉ, dạy bù, availability, đổi ca, xác nhận tiết"
agent: agent
---
# P10 — Leave, Substitute, School-off, Makeup, Availability, Swap, Confirmation
**Model:** mạnh nhất có (thinking High). **Đọc:** SRS §5.5–5.9, FR-LVM-001..006, §8.3 (leave_*, availability_slots, shift_swap_requests, teaching_confirmations), §9.2, AT-009..012, AT-025, B.3 S2/S3. **Skill:** gschedule-rulebook (mục 5, 9).

## Mục tiêu
Các luồng ngoại lệ đúng state machine, không mất ca gốc, không tính trùng công.

## Yêu cầu
1. Bảng: `leave_requests`, `leave_affected_events`, `substitution_requests` (hàng đợi điều phối), `school_off_notices`, `makeup_obligations` (+ liên kết ca bù, số tiết còn lại), `availability_slots`, `shift_swap_requests`, `teaching_confirmations`.
2. State machine bằng bảng chuyển tiếp trong domain (đơn nghỉ theo §5.5; obligation OPEN→PARTIALLY_FULFILLED→FULFILLED); chuyển sai trạng thái bị từ chối có test.
3. Đơn nghỉ APPROVED → sinh nhu cầu dạy thay; event gốc giữ nguyên; assignment người nghỉ ghi nghỉ/không có credit; người thay là assignment SUBSTITUTE + `event_links` ORIGINAL + lưu nhân sự bị thay. Người thay từ chối/ca thay hủy → quay lại hàng đợi + thông báo (outbox).
4. Trường báo nghỉ: chọn ca/lớp/ngày + bằng chứng; ca gốc → SCHOOL_OFF/CANCELLED_BY_SCHOOL (không tính tiết dạy); tạo obligation OPEN. Ca bù ADHOC tag NB liên kết 1+ obligation; cấu hình `allow_split_makeup`/`allow_merge_makeup` theo mặc định trong skill; ai xác nhận hoàn tất theo `approval_policies`.
5. Availability CTV/GV theo ngày/buổi/khoảng giờ (DRAFT/SUBMITTED/APPROVED nếu cần duyệt). Đổi ca: chỉ có hiệu lực sau duyệt, cập nhật đồng bộ các assignment bị ảnh hưởng.
6. Xác nhận tiết: CONFIRMED/ABSENT/NOT_PERFORMED/DISPUTED, `actual_periods`; Coordinator xác minh ca bất thường. `payroll_eligibility` suy ra theo mặc định P0-09; mọi sửa sau xác nhận cần reason + duyệt + audit.
7. UI tối thiểu cho Coordinator (hàng đợi: nghỉ chờ duyệt, ca cần thay, obligation mở) và form đơn nghỉ/đổi ca/availability cho GV/CTV (hoàn thiện mobile ở P15).

## Checklist đầu ra
- [ ] AT-009/S2: ca gốc còn; người nghỉ không credit; người thay liên kết gốc
- [ ] AT-010: người thay từ chối → ca trở lại hàng đợi, Coordinator nhận thông báo
- [ ] AT-011: ca trường nghỉ không tính tiết đã dạy; obligation OPEN được tạo
- [ ] AT-012/S3: obligation 2 tiết + 2 ca bù 1 tiết → 1/2 rồi FULFILLED, không double credit
- [ ] AT-025: lịch chưa COMPLETED/confirmed không ELIGIBLE
- [ ] Chuyển trạng thái sai (REJECTED→APPROVED) bị chặn
- [ ] Đơn nghỉ đã CLOSED không sửa trực tiếp; cần case điều chỉnh
- [ ] Đổi ca chưa duyệt không làm thay đổi lịch
- [ ] Mọi bước có audit + thông báo vào outbox
- [ ] `pnpm check` xanh; PROGRESS cập nhật
