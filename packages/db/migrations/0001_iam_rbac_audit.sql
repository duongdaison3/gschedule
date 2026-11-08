CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  employee_id uuid UNIQUE,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'LOCKED', 'DISABLED')),
  failed_login_count integer NOT NULL DEFAULT 0 CHECK (failed_login_count >= 0),
  locked_until timestamptz,
  last_login_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  description text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  effective_from timestamptz NOT NULL,
  effective_to timestamptz,
  assigned_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id, effective_from),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE IF NOT EXISTS user_data_scopes (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope_type text NOT NULL CHECK (scope_type IN ('COMPANY', 'SCHOOL', 'CLASS', 'EMPLOYEE', 'ALL')),
  scope_id text NOT NULL,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  assigned_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, scope_type, scope_id, effective_from),
  CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE TABLE IF NOT EXISTS approval_policies (
  action_code text PRIMARY KEY,
  allowed_roles text[] NOT NULL,
  maker_checker boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_action_registry (
  action text PRIMARY KEY,
  reason_required boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  before_json jsonb,
  after_json jsonb,
  reason text,
  ip inet,
  session_id text,
  source text NOT NULL DEFAULT 'API',
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (reason IS NOT NULL OR action NOT IN (
    'OVERRIDE', 'CANCEL', 'UNLOCK', 'EXPORT', 'REVEAL'
  ))
);

CREATE INDEX IF NOT EXISTS user_roles_active_idx
  ON user_roles (user_id, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS user_data_scopes_active_idx
  ON user_data_scopes (user_id, scope_type, scope_id, effective_from, effective_to);
CREATE INDEX IF NOT EXISTS audit_logs_actor_created_idx
  ON audit_logs (actor_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_entity_created_idx
  ON audit_logs (entity_type, entity_id, created_at DESC);

CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_logs is append-only';
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_append_only ON audit_logs;
CREATE TRIGGER audit_logs_append_only
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();

CREATE OR REPLACE FUNCTION validate_audit_log_reason()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  requires_reason boolean;
BEGIN
  SELECT reason_required INTO requires_reason
  FROM audit_action_registry
  WHERE action = NEW.action;
  IF requires_reason IS NULL THEN
    RAISE EXCEPTION 'audit action is not registered: %', NEW.action;
  END IF;
  IF requires_reason AND NULLIF(trim(NEW.reason), '') IS NULL THEN
    RAISE EXCEPTION 'audit reason is required for action: %', NEW.action;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS audit_logs_reason ON audit_logs;
CREATE TRIGGER audit_logs_reason
  BEFORE INSERT ON audit_logs
  FOR EACH ROW EXECUTE FUNCTION validate_audit_log_reason();

INSERT INTO audit_action_registry (action, reason_required) VALUES
  ('CREATE', false), ('UPDATE', false), ('DELETE_SOFT', false),
  ('APPROVE', false), ('REJECT', false), ('PUBLISH', false),
  ('CANCEL', true), ('LOCK', false), ('UNLOCK', true),
  ('EXPORT', true), ('OVERRIDE', true), ('REVEAL', true)
ON CONFLICT (action) DO UPDATE SET reason_required = EXCLUDED.reason_required;

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'gschedule_app') THEN
    REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM gschedule_app;
  END IF;
END;
$$;

INSERT INTO roles (code, name) VALUES
  ('SUPER_ADMIN', 'Quản trị hệ thống'),
  ('ADMIN', 'Quản trị nghiệp vụ'),
  ('TEAM_LEAD', 'Trưởng nhóm'),
  ('COORDINATOR', 'Điều phối'),
  ('HR', 'Nhân sự'),
  ('PAYROLL', 'Tính lương'),
  ('TEACHER', 'Giáo viên'),
  ('COLLABORATOR', 'Cộng tác viên'),
  ('SCHOOL_VIEWER', 'Đầu mối trường')
ON CONFLICT (code) DO NOTHING;

INSERT INTO permissions (code, description) VALUES
  ('schedule.view', 'Xem lịch'),
  ('schedule.create', 'Tạo lịch'),
  ('schedule.update', 'Sửa lịch'),
  ('schedule.approve', 'Duyệt lịch'),
  ('schedule.publish', 'Công bố lịch'),
  ('schedule.lock', 'Khóa lịch'),
  ('employee.view', 'Xem hồ sơ nhân sự'),
  ('employee.create', 'Tạo hồ sơ nhân sự'),
  ('employee.update', 'Sửa hồ sơ nhân sự'),
  ('employee.archive', 'Lưu trữ hồ sơ nhân sự'),
  ('sensitive.reveal_sensitive', 'Xem dữ liệu nhạy cảm'),
  ('sensitive.export', 'Xuất dữ liệu nhạy cảm'),
  ('leave.create', 'Tạo đơn nghỉ/đổi ca'),
  ('leave.approve', 'Duyệt đơn nghỉ/đổi ca'),
  ('attendance.confirm', 'Xác nhận tiết đã thực hiện'),
  ('timesheet.view', 'Xem bảng công'),
  ('timesheet.view_self', 'Xem bảng công cá nhân'),
  ('payroll.view', 'Xem payroll'),
  ('payroll.create', 'Tạo payroll'),
  ('payroll.approve', 'Duyệt payroll'),
  ('payroll.export', 'Xuất payroll'),
  ('tcs.view', 'Xem TCS'),
  ('audit.view', 'Xem audit log'),
  ('user.manage', 'Quản trị tài khoản và phân quyền')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.code IN (
  'schedule.view', 'schedule.create', 'schedule.update', 'schedule.approve',
  'schedule.publish', 'schedule.lock', 'leave.create', 'leave.approve', 'tcs.view',
  'attendance.confirm', 'timesheet.view', 'audit.view', 'user.manage'
)
WHERE r.code IN ('ADMIN', 'TEAM_LEAD', 'COORDINATOR')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.code IN (
  'employee.view', 'employee.create', 'employee.update', 'employee.archive',
  'sensitive.reveal_sensitive', 'sensitive.export', 'timesheet.view',
  'payroll.view', 'audit.view'
)
WHERE r.code = 'HR'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.code IN (
  'timesheet.view', 'payroll.view', 'payroll.create', 'payroll.approve',
  'payroll.export', 'audit.view'
)
WHERE r.code = 'PAYROLL'
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.code IN (
  'schedule.view', 'leave.create', 'attendance.confirm', 'timesheet.view_self'
)
WHERE r.code IN ('TEACHER', 'COLLABORATOR')
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code = 'schedule.view'
WHERE r.code = 'SCHOOL_VIEWER'
ON CONFLICT DO NOTHING;

INSERT INTO approval_policies (action_code, allowed_roles, maker_checker) VALUES
  ('schedule.approve', ARRAY['ADMIN', 'TEAM_LEAD', 'COORDINATOR'], true),
  ('payroll.approve', ARRAY['ADMIN', 'PAYROLL'], true),
  ('leave.approve', ARRAY['ADMIN', 'TEAM_LEAD', 'COORDINATOR'], true)
ON CONFLICT (action_code) DO UPDATE SET
  allowed_roles = EXCLUDED.allowed_roles,
  maker_checker = EXCLUDED.maker_checker,
  updated_at = now();
