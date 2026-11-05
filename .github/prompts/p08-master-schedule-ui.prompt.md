---
description: "P08 — Master Schedule UI: lưới tuần, panel chi tiết, copy tuần có diff, form event phụ thuộc danh mục"
agent: agent
---
# P08 — Master Schedule UI
**Model:** Flash (Med). **Đọc:** SRS §10.1, §10.2 (màn 2), §10.4, FR-SCH-003/006/008, NFR-PERF-002, NFR-ACC-001. **Skill:** vercel-react-best-practices, impeccable (`/impeccable audit` khi xong màn hình).

## Mục tiêu
Điều phối viên xem, lọc, sửa, copy tuần nhanh và không sai; thay lưới Excel 23×101 bằng thẻ event.

## Yêu cầu
1. Master Schedule: chọn tuần/tháng; lưới ngày × buổi × tiết với thẻ Schedule Event; bộ lọc địa bàn/trường/campus/pháp nhân/nhân sự/môn/trạng thái (giữ khi quay lại); panel chi tiết cố định; ảo hóa/phân trang; dữ liệu tải theo phạm vi lọc.
2. Mỗi thẻ có badge text + icon cho activity_type, trạng thái, xung đột (màu chỉ là phụ).
3. Form tạo/sửa event theo thứ tự §10.4: trường → campus → lớp → môn → ngày → buổi/slot → nhân sự → activity type → conversion code (danh sách phụ thuộc). Khi chọn nhân sự hiện ngay: hợp đồng, chứng chỉ, trùng lịch (dùng `detectConflicts`).
4. Wizard copy tuần: chọn tuần nguồn/đích → preview diff → tùy chọn bỏ qua ca xung đột (không tự bỏ qua) → xác nhận → kết quả. Hủy được toàn bộ.
5. Hành động rủi ro (copy, công bố, hủy ca) có hộp xác nhận + lý do khi cần.
6. Responsive: mobile hiển thị danh sách theo ngày thay vì lưới; không cần hover.

## Checklist đầu ra
- [ ] Tuần mẫu 200+ event cuộn mượt; tải ≤ 3 giây trên dữ liệu seed (NFR-PERF-001)
- [ ] Lọc giữ nguyên sau khi mở event rồi quay lại
- [ ] Form chặn lưu khi có xung đột BLOCK; hiển thị lý do rõ ràng bằng tiếng Việt
- [ ] Copy tuần: diff khớp kết quả P07; hủy không ghi gì
- [ ] Điều hướng và thao tác chính dùng được bằng bàn phím; tương phản đạt
- [ ] Trạng thái không chỉ bằng màu (kiểm tra ở chế độ thang xám)
- [ ] Viewport 375px dùng được: xem, sửa, xác nhận
- [ ] Có kiểm thử e2e Playwright 1 luồng: tạo event → xung đột → copy tuần
- [ ] `pnpm check` xanh; PROGRESS cập nhật
