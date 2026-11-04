---
name: gschedule-rulebook
description: Quy tắc nghiệp vụ GSchedule (SRS v2) - bảng quy đổi tiết, ngưỡng TCS, bậc CTP, thù lao CTV, state machine (event, đơn nghỉ, nghĩa vụ bù, kỳ công, import), conflict, phân bổ tháng, vector test Phụ lục B và mặc định tạm cho các mục P0 chưa chốt. Dùng khi viết/seed/test bất kỳ thứ gì liên quan conversion, TCS, CTP, CTV, payroll hoặc trạng thái workflow.
---

# GSchedule Rulebook (nguồn: SRS v2.0 §5, §7, §9, Phụ lục A/B)
Các số dưới đây dùng để SEED và TEST. Code đọc từ bảng rule có version + effective date, không hardcode.

## 1. Quy đổi tiết (conversion_code → credit, bucket, event_counter)
| Mã | Credit | Quỹ | Bộ đếm |
|---|---|---|---|
| K / S / C / A | 1.00 | KNS / STEM / CDS / AI | - |
| K/2, S/2, C/2, A/2 (hỗ trợ teambuilding) | 0.50 | KNS / STEM / CDS / AI | - |
| BCTH | 3.00 | KNS | +1 BCTH |
| BCTH/2 | 2.00 | KNS | - |
| BCCĐ | 3.00 | KNS | +1 BCCĐ |
| ĐP | 3.00 | KNS | +1 ĐP |
| HN | 2.00 | KNS | +1 HN |
| KI | 2.00 | KNS | +1 KI |
| BN | 2.00 | KNS | - |
| HT | 1.00 | KNS | +1 HT |
| TQ, CA | 1.00 | KNS | - |
| CM / trống | 0.00 | NONE | - |

Tách 4 trường riêng: `activity_type` (TEACHING, SUBSTITUTE, MAKEUP, OBSERVATION, TRAINING_CM, EVENT_WORKSHOP, TEACHER_LEAVE, SCHOOL_OFF, RESCHEDULED, OTHER), `business_tag` (DT, NB, NL, DG, CM...), `conversion_code`, `payroll_eligibility` (ELIGIBLE/NOT_ELIGIBLE/PENDING_REVIEW). DT/NB/NL/DG KHÔNG phải conversion_code.
Mã lạ (TC, CM=-0.01, môn ghép "STEM + AI") → `PENDING_REVIEW`, giữ raw, không tự tính.

## 2. TCS
Tổng tiết buổi = TT_KNS + TT_STEM + TT_CDS + TT_AI (centi-tiết). `> 40` → BẬN; `<= 40` → TRỐNG. Vector: 0.00 TRỐNG · 0.40 TRỐNG · 0.41 BẬN · 0.50 BẬN · 1.00 BẬN.
Hai chế độ: (1) tổng quan theo ngưỡng buổi; (2) kiểm tra chính xác overlap theo slot khi điều động. TRỐNG theo ngưỡng ≠ chắc chắn trống mọi tiết.
Chỉ event PUBLISHED/APPROVED chiếm lịch; DRAFT/CANCELLED/SCHOOL_OFF thì không. Lý do không khả dụng: OVERLAP, NO_CERT, LEAVE, NO_CONTRACT, TRAVEL_GAP, DECLARED_UNAVAILABLE.

## 3. CTP (khoảng [min, max), đơn vị VND)
N - Nhà riêng: <12 → 0 · [12,18) → 30.000 · [18,24) → 40.000 · [24,30) → 60.000 · [30,50) → 80.000 · ≥50 → 120.000.
V - Văn phòng / K - Khác: <7 → 0 · [7,12) → 30.000 · [12,18) → 40.000 · [18,24) → 60.000 · [24,30) → 80.000 · ≥30 → 110.000.
`is_online = true` → distance 0, CTP 0. Vector biên: N 11.9→0, 12→30k, 18→40k, 24→60k, 30→80k, 50→120k · V/K 6.9→0, 7→30k, 12→40k, 18→60k, 24→80k, 30→110k.

## 4. Thù lao CTV
Buổi có ≥2 tiết: mặc định 130.000 VND/tiết (cấu hình). Buổi <2 tiết: CHƯA có công thức → `PENDING_REVIEW`, amount NULL, chặn phát hành payroll CTV. Dạy thay/teambuilding/event: chưa có công thức → PENDING_REVIEW.

## 5. State machine
- Event: DRAFT → PENDING_APPROVAL → APPROVED → PUBLISHED → IN_PROGRESS → COMPLETED; CANCELLED / REJECTED. Hủy/sửa sau công bố cần reason + version + thông báo.
- Đơn nghỉ: DRAFT→SUBMITTED|CANCELLED · SUBMITTED→APPROVED|REJECTED|WITHDRAWN · APPROVED→CLOSED|CANCEL_REQUESTED · REJECTED/WITHDRAWN/CLOSED là cuối (không tự quay về APPROVED).
- Makeup obligation: OPEN → PARTIALLY_FULFILLED → FULFILLED.
- Kỳ công: OPEN → RECONCILING → REVIEWED → APPROVED → LOCKED → (PAID tùy chọn). Mở khóa = đặc quyền + reason + audit. Kỳ LOCKED chỉ chỉnh bằng adjustment liên kết run gốc.
- Chứng chỉ: UNKNOWN | PENDING | VERIFIED | EXPIRED | REVOKED (không mặc định TRUE).
- Import row: IMPORTED | WARNING | UNMATCHED | DUPLICATE | INVALID | IGNORED.
- Hồ sơ NS: DRAFT → VERIFIED → (ACTIVE) → RESIGNED → ARCHIVED. Teaching confirmation: CONFIRMED | ABSENT | NOT_PERFORMED | DISPUTED.

## 6. Conflict (mặc định)
Nhân sự trùng giờ: BLOCK (override cần quyền + reason) · Lớp trùng giờ: BLOCK · Thiếu thời gian di chuyển: WARNING (cấu hình thành BLOCK) · Chứng chỉ thiếu/hết hạn: BLOCK · Ngoài hợp đồng/đã nghỉ việc: BLOCK.

## 7. Công thức tổng hợp & tháng
Tiết theo quỹ = SUM(credit_component) theo employee/bucket/khoảng ngày, chỉ assignment đủ điều kiện payroll. Event counter = COUNT DISTINCT. CTP = SUM(item APPROVED). Net = gross + allowances + adjustments − deductions (deductions = 0, ngoài phạm vi). Báo cáo tháng nhóm theo `teaching_date` (Asia/Ho_Chi_Minh), không theo tuần.

## 8. Vector kịch bản (Phụ lục B.3)
S1 template 5 ca, thứ Tư trường nghỉ → sinh 4 ca + 1 đề xuất SCHOOL_OFF, không copy ADHOC cũ · S2 GV A nghỉ đã duyệt, GV B đủ chứng chỉ → event gốc giữ nguyên, A không có credit, B là SUBSTITUTE liên kết gốc · S3 obligation 2 tiết, 2 ca bù 1 tiết → còn 1/2 rồi FULFILLED, không double credit · S4 trường A 8:00-9:00, trường B 9:10-10:00, di chuyển 25 phút → cảnh báo/chặn (thiếu 15 phút so với khoảng nghỉ 10 phút) · S5 event 30/04 và 01/05 cùng tuần → tháng 4 nhận 30/04, tháng 5 nhận 01/05 · S6 rate 130k đến 30/06, 140k từ 01/07, kỳ đã khóa không đổi.

## 9. Mặc định tạm cho mục P0 chưa chốt (cấu hình được, ghi OPEN_QUESTIONS.md)
| ID | Mặc định tạm |
|---|---|
| P0-01/02 | Event = buổi; Period = tiết trong buổi; 1 assignment/nhân sự/event; schema cho phép nhiều GV, nhiều lớp (UI mặc định 1 lớp) |
| P0-03 | Cơ sở tính CTV `ctv_basis` = ACTUAL_PERIODS (cấu hình); <2 tiết = PENDING_REVIEW; cờ `payroll.ctv_release` = off |
| P0-04 | `ctp_policy` rỗng → item CTP ở PENDING_REVIEW, không cho duyệt; cho cấu hình basis (FIRST_SCHOOL/FARTHEST/PER_LEG/FIXED_PER_SESSION) và way (ONE_WAY/ROUND_TRIP) |
| P0-05 | DistanceProvider: MANUAL + MATRIX; chưa tích hợp bản đồ |
| P0-06 | CM/trống = 0.00 theo PDF; BN = 2.00; TC và số âm không import → PENDING_REVIEW |
| P0-07 | Môn ghép giữ raw, PENDING_REVIEW, không tách quỹ |
| P0-08 | `include_sunday` = false; `busy_activity_types` = TEACHING, SUBSTITUTE, MAKEUP, EVENT_WORKSHOP (DG/CM không làm bận) |
| P0-09 | Chỉ event COMPLETED + được xác nhận/verified mới ELIGIBLE |
| P0-10 | `allow_split_makeup` = true, `allow_merge_makeup` = false; COORDINATOR xác nhận hoàn tất |
| P0-11 | Bảng `approval_policies` seed theo ma trận §4.3, maker-checker bật cho duyệt tiền/mở khóa |
| P0-12 | Kỳ công = tháng dương lịch, cấu hình start/end |
