---
description: "P05 — Khung import batch + exception queue; import hồ sơ HR và master data từ Excel"
agent: agent
---
# P05 — Import framework & HR/master import
**Model:** Flash (Med). **Đọc:** SRS §11 (11.1–11.4), FR-IMP-001/002, AT-001, AT-002, AT-030; docs/00_KE_HOACH_BUILD.md §9 mục 4. **Điều kiện:** có workbook HR đã ẩn danh trong `fixtures/` (nếu thiếu: dừng và yêu cầu người dùng, hoặc sinh fixture giả bằng script).

## Mục tiêu
Import an toàn, chạy lại không trùng, mọi dòng lỗi vào hàng đợi xử lý; chưa import lịch tuần (P09).

## Yêu cầu
1. Bảng: `import_batches` (source_file, sheet, mapping_version, status), `import_rows` (row_no, raw_data jsonb, normalized_data jsonb, status IMPORTED/WARNING/UNMATCHED/DUPLICATE/INVALID/IGNORED, errors, content_hash, resolved_by/reason).
2. Pipeline: upload → parse (exceljs, đọc ô dạng TEXT) → normalize → map → **dry-run/preview** → commit. Không import công thức, màu, ô tổng hợp. Giữ raw để đối soát.
3. Quy tắc §11.3: `HN007` và `GVHN007` chỉ gộp khi người có quyền xác nhận (tạo "đề xuất gộp", không tự gộp); `GV mới` luôn UNMATCHED; CCCD/bank đọc chuỗi, phát hiện dạng khoa học (1.23E+11) → INVALID; tách school/campus; lớp dạng range parse bằng `class-range` sau xác nhận; môn ghép giữ raw.
4. Idempotent: khóa tự nhiên + `content_hash`; chạy lại cùng batch không tạo bản ghi mới, dòng lỗi giữ nguyên và xử lý riêng được (AT-030).
5. UI hàng đợi ngoại lệ: lọc theo trạng thái, giải quyết (map vào bản ghi có sẵn / tạo mới / bỏ qua có lý do), sửa mapping rồi chạy lại; báo cáo đối soát: matched/unmatched/duplicates/errors.
6. Hiệu năng/Aiven: ghi theo lô (≈500 dòng/transaction), dùng 1 kết nối cho import, tránh N+1 vì mỗi round-trip có độ trễ mạng; không import vào DB dev bằng dữ liệu thật.
7. Importer cho: employees + alias + hợp đồng + chứng chỉ (từ sheet đang làm việc/đã nghỉ) và phân công theo năm học (chỉ staging, nối P06). Fixture ẩn danh sinh bằng script, KHÔNG commit dữ liệu thật.

## Checklist đầu ra
- [ ] AT-001: HN007 + GVHN007 đã xác nhận cùng người → 1 employee, 2 alias, không duplicate
- [ ] AT-002: dòng `GV mới` không tạo employee chuẩn, xuất hiện trong exception queue
- [ ] AT-030: chạy lại cùng batch → số bản ghi domain không đổi, row lỗi vẫn còn
- [ ] CCCD "0123456789" giữ số 0 đầu; "1.23E+11" → INVALID
- [ ] Preview hiển thị số dòng sẽ tạo/bỏ qua/lỗi trước khi commit; huỷ preview không ghi gì
- [ ] Mọi bước (commit, resolve, ignore) có audit + người xác nhận
- [ ] Báo cáo đối soát xuất được; không chứa PII ở log
- [ ] Parser không crash với ô trống, ô gộp, tên sheet lạ (có test fixture lỗi)
- [ ] `pnpm check` xanh; PROGRESS cập nhật
