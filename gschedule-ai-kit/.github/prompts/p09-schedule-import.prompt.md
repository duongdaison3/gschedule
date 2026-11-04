---
description: "P09 — Import lịch tuần từ workbook Excel (36 sheet tuần) qua pipeline P05"
agent: agent
---
# P09 — Import lịch tuần từ Excel
**Model:** mạnh nhất có (thinking High). **Đọc:** SRS §1.3, §11.1–11.4, Phụ lục A.4; kết quả P05, P07. **Điều kiện cứng:** cần ít nhất 2–3 sheet tuần mẫu đã ẩn danh trong `fixtures/` (gồm 1 tuần giao thoa tháng và 1 tuần có DT/NB). Không có file → DỪNG, yêu cầu người dùng cung cấp; không đoán bố cục.

## Mục tiêu
Nhập lịch lịch sử vào hệ thống để đối soát, không biến ô lưới/màu/công thức thành "sự thật".

## Yêu cầu
1. Bước phân tích: đọc fixture, ghi `docs/schedule-workbook-layout.md` (vùng dữ liệu, cột ngày/buổi/tiết, ô ghi chú, quy ước mã) và xin người dùng xác nhận trước khi viết parser.
2. Parser theo sheet tuần → bản ghi nguồn (ngày, buổi/tiết, trường, lớp, môn, pháp nhân, mã nhân sự, mã quy đổi, ghi chú) → `import_rows`. Bỏ qua sheet TCS/TỔNG TIẾT/CTV/MAIL (chỉ dùng đối soát).
3. Mapping: mã nhân sự qua alias; trường/lớp/môn/pháp nhân qua `entity_aliases`; không khớp → UNMATCHED. Quy đổi mã qua rule engine; mã lạ (TC, CM âm) → PENDING_REVIEW. Môn ghép giữ raw.
4. Commit tạo event qua đúng service của P07 (conflict, audit) với lớp REGULAR/ADHOC suy ra từ dữ liệu; dòng thiếu ngày/nhân sự/trường → exception queue, không tạo lịch.
5. Báo cáo đối soát theo tuần/tháng: số ca, tổng tiết quy đổi, CTV so với kết quả Excel; chênh lệch ghi rõ "đã giải thích/chưa giải thích". Lỗi #VALUE!/#N/A của Excel bị bỏ qua có ghi nhận.
6. Idempotent re-run (AT-030) và tuần giao thoa tháng đúng theo teaching_date.

## Checklist đầu ra
- [ ] Layout được người dùng xác nhận bằng văn bản trước khi commit parser
- [ ] Import fixture → số event khớp số ô có dữ liệu hợp lệ; số dòng lỗi được liệt kê
- [ ] Chạy lại không tạo trùng; sửa mapping rồi chạy lại chỉ tạo dòng mới hợp lệ
- [ ] Tuần giao thoa tháng: event 30/04 vào tháng 4, 01/05 vào tháng 5 (AT-024)
- [ ] Màu ô và công thức không ảnh hưởng dữ liệu (test với fixture đổi màu)
- [ ] Báo cáo đối soát có cột chênh lệch và lý do; xuất được
- [ ] Không PII/dữ liệu thật trong repo hoặc log
- [ ] `pnpm check` xanh; PROGRESS cập nhật
