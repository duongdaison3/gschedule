---
description: "P12 — CTP: chuyến đi, chặng, ma trận khoảng cách, áp bậc phí, override có duyệt"
agent: agent
---
# P12 — CTP & di chuyển
**Model:** mạnh nhất có (thinking High). **Đọc:** SRS §7.5, §7.6, FR-HR-005, FR-CAL-005/006/008, §8.3 (travel_*, distance_matrix), §10.4, AT-018..021, Phụ lục B.2, P0-04/P0-05. **Skill:** gschedule-rulebook (mục 3, 9).

## Mục tiêu
Tính và lưu CTP minh bạch từng chặng. Phần chưa chốt (P0-04) chạy được nhưng ở `PENDING_REVIEW`, chưa cho duyệt tiền.

## Yêu cầu
1. Bảng `travel_trips` (nhân sự/ngày/buổi), `travel_legs` (thứ tự, from/to, distance_km, duration_minutes, nguồn), `travel_allowance_items` (rule snapshot, amount, status PROPOSED/PENDING_REVIEW/APPROVED/OVERRIDDEN/CANCELLED, override reason/approver), `distance_matrix` (from/to, km, phút, source MANUAL|MATRIX, checked_at). Điểm xuất phát N/V/K lấy từ `employee_locations` hiệu lực tại ngày dạy.
2. Interface `DistanceProvider` (MANUAL + MATRIX); không tích hợp bản đồ. Quy trình cập nhật ma trận bằng UI/import CSV.
3. Interface `TravelPolicy` cấu hình bởi `ctp_policy` {basis: FIRST_SCHOOL|FARTHEST|PER_LEG|FIXED_PER_SESSION, way: ONE_WAY|ROUND_TRIP}. Chưa cấu hình → mọi item `PENDING_REVIEW`, không APPROVED được. Dùng `ctpFor()` của P04 cho từng chặng; online → 0 km, 0 đồng.
4. Override: bắt buộc reason + approver ≠ người đề nghị + giá trị trước/sau + audit (AT-021).
5. Nối TRAVEL_GAP của conflict engine (P07) với `distance_matrix` (S4).
6. UI xem CTP: điểm đi, điểm đến, số km, bậc phí, số tiền, rule version, nguồn khoảng cách (§10.4); chọn điểm K cần danh mục location và người chịu trách nhiệm xác nhận.

## Không làm
Không tích hợp Google Maps; không tự chọn công thức nhiều trường/buổi.

## Checklist đầu ra
- [ ] AT-018/019: đúng toàn bộ điểm biên N và V/K theo [min, max)
- [ ] AT-020: is_online=true → 0 km, 0 đồng, kể cả khi có ma trận khoảng cách
- [ ] AT-021: override thiếu reason/approver bị từ chối; có đủ → lưu before/after + audit
- [ ] `ctp_policy` rỗng → item PENDING_REVIEW, nút duyệt bị khóa kèm giải thích
- [ ] Đổi địa chỉ xuất phát có hiệu lực theo ngày không làm đổi item đã APPROVED
- [ ] Cùng chuyến nhiều trường: tạo được nhiều chặng, kết quả đổi theo `ctp_policy` (test 4 basis)
- [ ] Item lưu rule_id/version snapshot
- [ ] `pnpm check` xanh; PROGRESS cập nhật; OPEN_QUESTIONS P0-04/P0-05 còn mở
