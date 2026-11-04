---
description: "P06 — Phân công giáo viên/CTV theo trường-lớp-môn, hiệu lực, bàn giao lớp"
agent: agent
---
# P06 — Assignment & Handover
**Model:** Flash (Med). **Đọc:** SRS §5.2, FR-ASG-001..004, §8.3 (class_assignments, class_handover_events), §8.4, AT-003, AT-004, Phụ lục A.4 (NL).

## Mục tiêu
Nguồn gợi ý cho lịch REGULAR: ai phụ trách lớp/môn nào, từ ngày nào, bàn giao nhiều lần mà vẫn truy vết A → B → C.

## Yêu cầu
1. Bảng `class_assignments` (employee, class, subject, role_type MAIN_TEACHER/SUPPORT_TEACHER/COLLABORATOR, valid_from/to, status DRAFT/PENDING/APPROVED/ENDED/CANCELLED, approved_by) và `class_handover_events` (old/new assignment, handover_date, reason, requested_by, approved_by, status). Exclusion constraint: cùng lớp+môn không có 2 MAIN chồng hiệu lực; số GV chính/hỗ trợ tối đa lấy từ `assignment_policy` (mặc định 1 chính, P1-02).
2. Kiểm tra khi tạo/duyệt (FR-ASG-002): nhân sự active, hợp đồng hiệu lực, chứng chỉ bắt buộc của môn (dùng hàm ở P03); thiếu → BLOCK, override cần quyền + reason + duyệt.
3. Quy trình bàn giao §5.2: tạo request → duyệt (maker-checker) → kết thúc assignment cũ tại ngày-1, tạo assignment mới từ ngày hiệu lực; KHÔNG sửa/ghi đè event đã COMPLETED hoặc thuộc kỳ LOCKED (hàm guard `assertNoLockedImpact(date)` — tạm kiểm tra theo cờ, nối thật ở P07/P13).
4. Truy vấn chuỗi kế nhiệm theo lớp/môn; báo cáo lớp/môn chưa có người phụ trách (FR-ASG-004).
5. Nối `listFutureAssignments(employeeId)` của offboarding (P03).
6. UI: danh sách + form phân công, wizard bàn giao nhiều lớp, timeline kế nhiệm. NL (nhận lại lớp) xử lý như sự kiện assignment/bàn giao, không phải lịch dạy.

## Checklist đầu ra
- [ ] AT-003: thiếu/hết hạn chứng chỉ → không gán được, trừ override được duyệt (có audit)
- [ ] AT-004: ngoài hợp đồng hoặc đã nghỉ việc → chặn
- [ ] Hai MAIN chồng hiệu lực cùng lớp+môn bị DB từ chối (test)
- [ ] Bàn giao A→B→C: chuỗi hiển thị đúng ngày hiệu lực, không khoảng hở/chồng
- [ ] Bàn giao không đụng event COMPLETED/kỳ LOCKED (test với guard)
- [ ] Offboarding hiển thị đúng các lớp tương lai cần bàn giao
- [ ] Báo cáo lớp thiếu GV đúng với dữ liệu seed
- [ ] Người tạo không tự duyệt bàn giao của mình
- [ ] `pnpm check` xanh; PROGRESS cập nhật
