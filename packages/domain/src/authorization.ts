import { DomainError } from "./errors";

export type ScopeType = "COMPANY" | "SCHOOL" | "CLASS" | "EMPLOYEE" | "ALL";

export interface DataScope {
  scopeType: ScopeType;
  scopeId: string;
}

export interface RoleAssignment {
  role: string;
  permissions: string[];
  scopes: DataScope[];
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface AuthorizationInput {
  userId: string;
  roles: RoleAssignment[];
  now?: string;
}

export interface ResourceScope {
  scopeType: Exclude<ScopeType, "ALL">;
  scopeId: string;
}

function isActive(role: RoleAssignment, now: Date): boolean {
  const starts = new Date(role.effectiveFrom);
  const ends = role.effectiveTo ? new Date(role.effectiveTo) : undefined;
  return starts <= now && (!ends || now < ends);
}

function covers(scope: DataScope, resource: ResourceScope): boolean {
  return scope.scopeType === "ALL" || (scope.scopeType === resource.scopeType && scope.scopeId === resource.scopeId);
}

export function can(
  input: AuthorizationInput,
  permission: string,
  resource?: ResourceScope
): boolean {
  const now = new Date(input.now ?? Date.now());

  return input.roles.some(
    (role) =>
      isActive(role, now) &&
      role.permissions.includes(permission) &&
      (!resource || role.scopes.some((scope) => covers(scope, resource)))
  );
}

export function canApprove(
  input: AuthorizationInput,
  permission: string,
  creatorUserId: string,
  approverUserId: string,
  makerChecker: boolean,
  resource?: ResourceScope
): boolean {
  if (makerChecker && creatorUserId === approverUserId) {
    return false;
  }

  return can({ ...input, userId: approverUserId }, permission, resource);
}

export function requirePermission(
  input: AuthorizationInput,
  permission: string,
  resource?: ResourceScope
): void {
  if (!can(input, permission, resource)) {
    throw new DomainError("FORBIDDEN", `Không có quyền ${permission}`);
  }
}
