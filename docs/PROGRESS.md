# Bàn giao tiến độ — GSchedule (VP Hà Nội)

## Phiên hiện tại: P01 — IAM, RBAC, audit + Better Auth mount
- **Ngày:** 2026-11-07
- **Trạng thái:** Domain + DB tests xanh; typecheck package xanh. `pnpm check` chờ chạy cuối phiên.

### Đã làm
- Thêm migration IAM/RBAC/audit: users, roles, permissions, role_permissions, user_roles,
  user_data_scopes, approval_policies và audit_logs.
- Seed 9 role baseline, permission dạng `module.resource.action` và policy maker-checker.
- Audit append-only bằng trigger; action phải có registry; reason bắt buộc cho cancel/unlock/export/override/reveal.
- Thu hồi UPDATE/DELETE/TRUNCATE audit_logs khỏi `gschedule_app`, kể cả khi role đã tồn tại.
- Thêm domain `can`, `requirePermission`, `canApprove`: union role, scope, thời hạn và maker-checker.
- Thêm `withService`: kiểm quyền → transaction → optimistic version → audit.
- Thêm test authorization table-driven và service boundary; giữ nguyên test DB safety.
- Cài `@better-auth/infra`, `better-auth`, Zod 4 cho web; mount `dash()` server,
  `sentinelClient()` client và Next.js handler tại `/api/auth/[...all]`.

### File chính
- `packages/db/migrations/0001_iam_rbac_audit.sql`
- `packages/db/src/service.ts`, `packages/db/src/__tests__/service.test.ts`
- `packages/domain/src/authorization.ts`, `packages/domain/tests/authorization.test.ts`

### Quyết định / việc treo
- `users.employee_id` là UUID nullable; chờ bảng employees ở P03 để thêm FK.
- Rate-limit đăng nhập, API/UI quản trị user/audit và Better Auth schema migration còn treo cho increment auth kế tiếp.
- P1-09: chốt nơi lưu dữ liệu thật, SLA, PITR và gói Aiven trước khi nhập dữ liệu thật.
