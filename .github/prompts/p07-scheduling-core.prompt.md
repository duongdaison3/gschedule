---
description: "P07 — Scheduling core: template, event/assignment/period, conflict engine, copy tuần, publish, version"
agent: agent
---
# P07 — Scheduling core
**Model:** mạnh nhất có (thinking High) cho schema + conflict engine. **Đọc:** SRS §3 (mô hình lịch), §5.3, §5.4, §9.1, §9.2, FR-SCH-001..008, §8.3 (schedule_*), §8.4, AT-005..008, AT-032, Phụ lục B.3 S1/S4. **Skill:** gschedule-rulebook, supabase-postgres-best-practices.

## Mục tiêu
Lõi lịch đúng và an toàn: chống trùng ở DB, copy tuần có preview và idempotent, sửa sau công bố có version.

## Yêu cầu
1. Bảng: `schedule_templates`, `template_events`, `template_staff`, `schedule_events` (teaching_date, start_at/end_at, activity_type, schedule_layer REGULAR/ADHOC, status, is_online, company_id, version), `schedule_assignments` (event, employee, staff_role, is_primary, conversion_code, payroll_eligibility, `time_range tstzrange` + `blocking bool`), `event_periods` (period_index 1..6, period_weight), `event_links` (ORIGINAL/SUBSTITUTE/MAKEUP/RESCHEDULE), `schedule_event_versions` (snapshot), `generation_batches`. Exclusion constraint chống nhân sự trùng giờ trên assignment `blocking = true`; override đã duyệt đặt `blocking=false` kèm bản ghi override. CHECK end_at > start_at.
2. Domain `detectConflicts(candidate, context)` → danh sách `{type, severity, detail}`: STAFF_OVERLAP, CLASS_OVERLAP, TRAVEL_GAP (dùng `travelGapShort` + distance_matrix nếu có, thiếu dữ liệu → INFO "chưa đủ dữ liệu"), CERTIFICATE, CONTRACT. Mức BLOCK/WARNING theo skill rulebook, cấu hình được.
3. Services: tạo/sửa/hủy ADHOC (TEACHING, SUBSTITUTE, MAKEUP, OBSERVATION, TRAINING, EVENT); `generateWeek({template|sourceWeek, targetRange, dryRun})` → preview {tạo mới, bỏ qua, thay đổi, xung đột, không map được} → commit idempotent với khóa (template_event_id, teaching_date), ghi batch_id/source/version; chỉ sinh REGULAR, bỏ qua ngày trường nghỉ và tạo đề xuất SCHOOL_OFF (S1), không copy ADHOC/đơn nghỉ/dạy thay cũ.
4. Vòng đời event theo §9.1; DRAFT→PENDING_APPROVAL→APPROVED→PUBLISHED; hủy/sửa quan trọng sau công bố cần reason, tạo version, phát sự kiện vào outbox (thông báo ở P15). Optimistic lock: người sửa thứ hai nhận version conflict (AT-032).
5. Nối guard `assertNoLockedImpact` (P06) với event COMPLETED; `listFutureAssignments` trả dữ liệu thật.
6. Mọi mutation qua `withService()` + audit.

## Không làm
Chưa làm UI (P08), chưa nghỉ/dạy thay (P10), chưa TCS (P11).

## Checklist đầu ra
- [ ] AT-005: copy chỉ REGULAR; chạy lại cùng tuần không tạo duplicate; preview đúng số liệu
- [ ] S1: template 5 ca + thứ Tư nghỉ → 4 ca + 1 đề xuất SCHOOL_OFF
- [ ] AT-006: cùng nhân sự giao giờ bị chặn ở DB (test insert trực tiếp cũng fail); override có reason + quyền thì qua
- [ ] AT-007: cùng lớp trùng giờ được phát hiện
- [ ] AT-008/S4: A 8:00–9:00, B 9:10–10:00, di chuyển 25' → cảnh báo/chặn theo cấu hình
- [ ] AT-032: hai người sửa cùng event → người sau nhận conflict, không ghi đè
- [ ] Một event nhiều assignment và nhiều period (FR-SCH-007) có test
- [ ] Sửa sau PUBLISHED tạo version mới, có bản ghi outbox và audit
- [ ] Event của kỳ LOCKED/đã COMPLETED không sửa trực tiếp được
- [ ] Không N+1 khi tải 1 tuần (kiểm bằng log số query, ghi số query vào PROGRESS)
- [ ] Exclusion constraint/btree_gist chạy được bằng role owner trên Aiven (không cần superuser)
- [ ] `pnpm check` xanh; PROGRESS cập nhật
