---
description: "P11 — TCS (lịch trống/bận) hai chế độ và màn hình điều động nhanh"
agent: agent
---
# P11 — TCS & điều động
**Model:** mạnh nhất có (thinking High). **Đọc:** SRS §5.8, §7.4, FR-CAL-001/002, §10.2 (màn 3), AT-013..015, Phụ lục B.1. **Skill:** gschedule-rulebook (mục 2, 9).

## Mục tiêu
Gợi ý người thay chính xác, giải thích được, nhanh trên dữ liệu thật của 1 tuần.

## Yêu cầu
1. Domain `computeAvailability({employee, date, session|slotRange, ctx})` trả cả hai chế độ: (a) tổng quan buổi theo ngưỡng (dùng `tcsSessionStatus`), (b) chính xác theo overlap slot. Kèm `reasons[]`: OVERLAP, NO_CERT, LEAVE, NO_CONTRACT, TRAVEL_GAP, DECLARED_UNAVAILABLE.
2. Chỉ event PUBLISHED/APPROVED chiếm lịch; DRAFT/CANCELLED/SCHOOL_OFF không. Dùng `busy_activity_types`, `include_sunday` từ app_settings (mặc định theo skill). Availability khai báo "không khả dụng" luôn loại khỏi gợi ý (AT-015).
3. Truy vấn theo tập hợp (một vài SQL cho cả tuần × nhiều nhân sự), không N+1; cache có kiểm soát và vô hiệu khi lịch đổi (NFR-PERF-002).
4. UI TCS: ma trận ngày/buổi/slot, bộ lọc chứng chỉ/hợp đồng/địa bàn/availability/khoảng cách, cột lý do không phù hợp, chọn người thay → gọi service P10 (tạo SUBSTITUTE). Kết quả chỉ là gợi ý; người có quyền chọn và chịu trách nhiệm (hiển thị rõ).
5. Quyền xem TCS toàn văn phòng theo ma trận §4.3.

## Checklist đầu ra
- [ ] AT-013: tổng 0.40 → TRỐNG, 0.41 → BẬN trên dữ liệu thật qua DB
- [ ] AT-014: draft/cancelled không làm BẬN; published/approved làm BẬN
- [ ] AT-015: CTV khai báo không khả dụng không bao giờ được gợi ý
- [ ] Buổi "TRỐNG" theo ngưỡng nhưng slot cụ thể trùng → chế độ chính xác báo OVERLAP
- [ ] Mỗi nhân sự bị loại có ≥1 lý do hiển thị rõ
- [ ] Chủ Nhật tuân theo cờ `include_sunday`
- [ ] Số query để dựng ma trận 1 tuần cố định (không tăng theo số nhân sự); đo và ghi vào PROGRESS
- [ ] Người không có quyền không thấy TCS toàn văn phòng
- [ ] `pnpm check` xanh; PROGRESS cập nhật
