---
description: "P14 — Dashboard KPI có định nghĩa, báo cáo tuần/tháng, xuất Excel theo quyền"
agent: agent
---
# P14 — Báo cáo, dashboard, export
**Model:** Flash (Med). **Đọc:** SRS §10.2 (màn 1), §10.3, FR-RPT-001..003, AT-024, AT-031, NFR-PERF-001.

## Mục tiêu
Số liệu có định nghĩa rõ, drill-down được, xuất đúng quyền.

## Yêu cầu
1. `kpi_definitions` (code, tên, định nghĩa, công thức, nguồn, cách đếm) hiển thị cạnh mỗi KPI cùng thời điểm dữ liệu. KPI: tổng tiết (4 biến thể: scheduled / published / completed / payroll-eligible — không dùng nhãn "tổng tiết" chung), ca thay/bù (cấu hình đếm theo event hay assignment, mặc định event), lớp khuyết GV (theo ngày/slot), cơ cấu tiết theo quỹ (event hỗn hợp nêu rõ), tổng CTP (APPROVED), CTV payroll (tách ≥2 và <2 tiết). Không làm KPI năng suất/định mức.
2. Báo cáo tuần/tháng theo `teaching_date`; theo giáo viên/trường/môn/pháp nhân/kỳ; drill-down từ số liệu về event/assignment.
3. Dashboard vận hành: KPI hôm nay, ca thay/bù, lớp thiếu GV, thử việc sắp hết hạn, cơ cấu môn/pháp nhân; mỗi KPI có liên kết drill-down.
4. Export Excel (exceljs, streaming) theo template/role; báo cáo lớn chạy job bất đồng bộ; mỗi export ghi audit EXPORT; cột nhạy cảm (CCCD/bank) chỉ khi có quyền riêng (AT-031).
5. Không giữ transaction dài; export lớn đọc theo cursor bằng 1 kết nối riêng, không chiếm hết pool.
6. Truy vấn tối ưu bằng index/materialized view khi cần, ghi quyết định vào PROGRESS.

## Checklist đầu ra
- [ ] Mỗi KPI hiển thị định nghĩa + thời điểm dữ liệu + link drill-down hoạt động
- [ ] AT-024: báo cáo tháng chia đúng 30/04 và 01/05
- [ ] AT-031: export của user thiếu quyền nhạy cảm không có CCCD/bank, kể cả qua file Excel
- [ ] Export có audit (ai, báo cáo nào, bộ lọc, thời điểm)
- [ ] Báo cáo ≥ 10.000 dòng chạy bất đồng bộ, không treo UI
- [ ] Số tổng ở dashboard khớp tổng drill-down trên dữ liệu seed (test đối chiếu)
- [ ] Người dùng chỉ thấy dữ liệu trong data scope của mình
- [ ] `pnpm check` xanh; PROGRESS cập nhật
