---
description: "P01 — Tài khoản, RBAC đa vai + data scope, audit log, maker-checker"
agent: agent
---
# P01 — IAM, RBAC, Audit
**Model:** mạnh nhất có (thinking High) cho thiết kế + review; Flash cho UI. **Đọc:** SRS §4 (4.1–4.3), §9.3, FR-IAM-001..004, FR-AUD-001, NFR-SEC-001..004, AT-028, AT-029. **Skill:** supabase-postgres-best-practices (nếu có).

## Mục tiêu
Một lớp phân quyền và audit duy nhất, dùng lại cho mọi phần sau; không có đường mutation nào bỏ qua nó.

## Yêu cầu
1. Bảng: `users` (tách khỏi employees, `employee_id` nullable unique; chưa có bảng employees thì để cột uuid + TODO FK ở P03), `roles`, `permissions`, `role_permissions`, `user_roles` (role + scope + effective_from/to), `user_data_scopes` (scope_type: COMPANY | SCHOOL | CLASS | EMPLOYEE | ALL; scope_id), `approval_policies` (action_code, allowed_roles, maker_checker bool), `audit_logs`.
2. Seed role: SUPER_ADMIN, ADMIN, TEAM_LEAD, COORDINATOR, HR, PAYROLL, TEACHER, COLLABORATOR, SCHOOL_VIEWER (tắt mặc định). Seed permission dạng `module.resource.action` (view/create/update/archive/approve/publish/lock/export/reveal_sensitive) khớp ma trận §4.3; mọi thứ chỉnh được trong DB (đây là baseline đề xuất, chưa phê duyệt).
3. Auth bằng Better Auth (email + mật khẩu, session an toàn, chống brute-force/rate limit, khóa/mở tài khoản). Tra Context7 để dùng API đúng phiên bản.
4. `can(user, permission, resource?)` trong domain/service: hợp nhất nhiều role + nhiều scope, tôn trọng thời hạn hiệu lực. Helper `requirePermission()` và `withService()` bọc: kiểm quyền → transaction → ghi audit → kiểm tra `version`.
5. `audit_logs` append-only (trigger chặn UPDATE/DELETE; REVOKE cho role ứng dụng). Trường: actor, action (CREATE/UPDATE/DELETE_SOFT/APPROVE/REJECT/PUBLISH/CANCEL/LOCK/UNLOCK/EXPORT/OVERRIDE/REVEAL), entity_type/id, before/after (che trường nhạy cảm), reason, ip/session/source, timestamp. Action bắt buộc `reason` được khai báo trong một registry.
6. Maker-checker: người tạo không tự duyệt khi `approval_policies.maker_checker = true`.
7. UI: đăng nhập, quản trị user (tạo/khóa/gán nhiều role + scope + thời hạn), xem audit (lọc theo actor/entity/action/ngày). Sidebar chỉ hiện mục được phép.

## Không làm
Không SSO/MFA (để P16 nếu bật). Không phân quyền theo trường dữ liệu nhạy cảm chi tiết (P03).

## Checklist đầu ra
- [ ] Test bảng quyết định (table-driven) cho ma trận §4.3: mọi role × hành động chính
- [ ] User 2 role + 2 scope: quyền là hợp (union), ngoài scope bị từ chối
- [ ] Role hết hạn không còn hiệu lực; nhân sự đổi vị trí thu hồi được quyền
- [ ] AT-028: TEACHER/COLLABORATOR gọi API lấy dữ liệu người khác → 403 (test ở tầng service VÀ route)
- [ ] AT-029 (phần chung): mutation mẫu có actor/time/before-after/reason trong audit
- [ ] Không có API sửa/xóa audit; trigger chặn UPDATE/DELETE (có test)
- [ ] Maker-checker: tạo rồi tự duyệt → bị chặn
- [ ] Rate limit đăng nhập có test; mật khẩu không bao giờ xuất hiện trong log
- [ ] Không còn route/action nào gọi DB trực tiếp ngoài `withService()` (grep kiểm chứng)
- [ ] `pnpm check` xanh; PROGRESS cập nhật
