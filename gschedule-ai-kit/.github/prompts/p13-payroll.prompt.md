---
description: "P13 — Kỳ công, payroll run, đối soát, duyệt, khóa kỳ, snapshot, adjustment"
agent: agent
---
# P13 — Payroll, đối soát, khóa kỳ
**Model:** mạnh nhất có (thinking High); bắt buộc review bằng model thứ hai. **Đọc:** SRS §5.10, §7.1, §7.7–7.9, FR-PAY-001..005, FR-CAL-004/007/008, §8.3 (pay_periods…payroll_adjustments), §8.4, AT-024..027, B.3 S5/S6. **Skill:** gschedule-rulebook (mục 4, 5, 7, 9), supabase-postgres-best-practices.

## Mục tiêu
Payroll đúng, truy nguyên được, khóa thật sự. Không phát hành tiền CTV khi P0-03 chưa chốt.

## Yêu cầu
1. Bảng `pay_periods` (type, start/end — mặc định tháng dương lịch, cấu hình), `payroll_runs` (status, rule_snapshot jsonb, created/approved_by, locked_at), `payroll_items` (run, employee, source_assignment_id, item_type, quantity, rate, amount, rule_snapshot, status), `payroll_adjustments` (liên kết run gốc, reason). Số tiền integer VND, số tiết integer centi-tiết.
2. Thu thập CHỈ assignment `payroll_eligibility = ELIGIBLE` (đã COMPLETED + xác nhận) trong kỳ theo `teaching_date`. Tổng hợp: tiết theo quỹ, event counter (COUNT DISTINCT), CTP (item APPROVED), CTV theo `ctvFee`. Mọi dòng PENDING_REVIEW là ngoại lệ chặn duyệt.
3. State machine OPEN→RECONCILING→REVIEWED→APPROVED→LOCKED(→PAID tùy chọn); maker-checker cho duyệt/khóa; mở khóa là đặc quyền + reason + audit.
4. LOCKED: đóng băng snapshot rule/đơn giá/kết quả; chặn sửa/xóa trực tiếp event, assignment, item liên quan bằng trigger DB + guard service (nối `assertNoLockedImpact`); chỉ sửa bằng adjustment liên kết run gốc, áp vào kỳ hiện tại.
5. Net = gross + allowances + adjustments − deductions (deductions = 0, thuế/BH ngoài phạm vi).
6. Cờ `payroll.ctv_release` mặc định tắt: khi tắt, chạy được thử nhưng không APPROVE/LOCK dòng CTV.
7. API drill-down: chỉ số → event → assignment → period → rule đã áp dụng (hiển thị cả tiết thực tế và quy đổi, mã quy đổi, quỹ, trạng thái xác nhận). UI Payroll & CTP Center: danh sách kỳ, cảnh báo sai lệch, duyệt/khóa.

## Checklist đầu ra
- [ ] AT-025: lịch chưa confirmed không vào payroll
- [ ] AT-026: kỳ LOCKED — update/delete trực tiếp event/item bị DB từ chối (test bằng SQL trực tiếp); adjustment mới có liên kết
- [ ] AT-027/S6: đổi rate sau khóa không đổi kỳ cũ; kỳ mở dùng rate mới theo ngày
- [ ] AT-024/S5: tuần giao thoa tháng chia đúng theo teaching_date
- [ ] Ca CTV 1 tiết ở PENDING_REVIEW, run không APPROVE được cho tới khi giải quyết/cờ bật
- [ ] Không double count: dạy thay (người nghỉ không credit), dạy bù (không tính trùng obligation)
- [ ] Mở khóa thiếu reason/quyền bị từ chối; có audit UNLOCK
- [ ] Mỗi dòng payroll drill-down được tới event gốc (test API)
- [ ] Chạy lại tổng hợp cùng kỳ OPEN cho cùng kết quả (idempotent/deterministic)
- [ ] `pnpm check` xanh; PROGRESS cập nhật
