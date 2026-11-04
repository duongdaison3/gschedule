---
description: "P04 — Rule engine thuần (domain): quy đổi tiết, ngưỡng TCS, bậc CTP, thù lao CTV, phân bổ tháng, versioning"
agent: agent
---
# P04 — Rule Engine
**Model:** mạnh nhất có (thinking High). **Đọc:** SRS §7 (toàn bộ), FR-CAL-003/004/005/007, Phụ lục A.3–A.4, Phụ lục B.1–B.2, AT-016..020, AT-022/023, AT-027. **Skill bắt buộc:** gschedule-rulebook.

## Mục tiêu
Mọi phép tính tiết/CTP/CTV là hàm thuần có test ở biên, đọc rule theo version + ngày hiệu lực; phần chưa chốt trả `PENDING_REVIEW`, không đoán.

## Yêu cầu
1. Bảng (packages/db): `conversion_rules`, `conversion_rule_versions` (effective_from/to, status DRAFT/APPROVED, approved_by), `conversion_rule_components` (bucket, credit_x100), `event_counters`, `travel_allowance_rules` (departure_type N/V/K, min_km, max_km, amount, effective), `ctv_payment_rules` (threshold, rate, calculation_method, effective), `app_settings` (include_sunday, ctv_basis, busy_activity_types…). Exclusion constraint (btree_gist + daterange) chống chồng hiệu lực cùng rule; CHECK bậc km không chồng/không hở. Seed từ skill rulebook.
2. Domain (`packages/domain/rules/`), không IO:
   - `resolveConversion(code, date, rules)` → `{buckets, counter}` hoặc `PENDING_REVIEW{reason}` khi mã lạ/CM âm/môn ghép
   - `sessionCredits(assignments)` và `tcsSessionStatus(creditsByBucket)` (> 40 BẬN, ≤ 40 TRỐNG)
   - `ctpFor({departureType, km, isOnline, date}, rules)` theo khoảng [min, max)
   - `ctvFee({periods, creditsConverted, date, basis}, rules)`; <2 tiết → `PENDING_REVIEW`, amount null
   - `allocateByMonth(slots)` theo teaching_date; `findOverlaps(intervals)`; `travelGapShort(prevEnd, nextStart, travelMinutes)`
   - `snapshotRules(ids, date)` trả object đóng băng dùng cho payroll
3. Giao diện quản trị tối thiểu: xem danh sách rule, tạo version mới (DRAFT), duyệt (maker-checker, P01), xem lịch sử. Không sửa version đã APPROVED/đã được snapshot.
4. Mọi override/đổi rule vào audit (reason, before/after).

## Không làm
Chưa tính payroll run, chưa chọn chặng CTP (P12), chưa nối event thật (P07).

## Checklist đầu ra
- [ ] Test TCS: 0.00, 0.40 → TRỐNG; 0.41, 0.50, 1.00 → BẬN (B.1, AT-013)
- [ ] Test CTP đủ 12 điểm biên B.2 + online (AT-018/019/020); thêm test property: mọi km ≥ 0 khớp đúng 1 bậc
- [ ] AT-016: K/S/C/A=1, half=0.5, BCTH=3 + counter, BCTH/2=2, HN=2, BN=2, CM=0
- [ ] AT-017: TC, CM=-0.01, "STEM + AI" → PENDING_REVIEW, không lỗi im lặng
- [ ] CTV: 2 tiết → 2 × 130.000; 1 tiết → PENDING_REVIEW; đổi rate 130k→140k từ 01/07 đúng theo ngày (S6)
- [ ] Snapshot đóng băng: đổi rule sau đó không đổi kết quả snapshot (AT-027 mức domain)
- [ ] Phân bổ tháng: 30/04 vs 01/05 (S5, AT-024 mức domain)
- [ ] Không có số tiền/hệ số hardcode ngoài seed + test (grep kiểm chứng)
- [ ] Không dùng `number` float cho credit/tiền (lint rule hoặc test kiểu)
- [ ] Độ phủ nhánh packages/domain/rules ≥ 95%; `pnpm check` xanh; PROGRESS cập nhật
