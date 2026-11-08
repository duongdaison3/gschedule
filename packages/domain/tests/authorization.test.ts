import { describe, expect, it } from "vitest";
import {
  can,
  canApprove,
  type AuthorizationInput,
  type DataScope,
  type RoleAssignment,
} from "../src/authorization";

const scope = (scopeType: DataScope["scopeType"], scopeId: string): DataScope => ({
  scopeType,
  scopeId,
});

const assignment = (
  role: string,
  permissions: string[],
  scopes: DataScope[],
  effectiveFrom = "2026-01-01T00:00:00.000Z",
  effectiveTo?: string
): RoleAssignment => ({
  role,
  permissions,
  scopes,
  effectiveFrom,
  effectiveTo,
});

const input = (roles: RoleAssignment[], now = "2026-06-01T00:00:00.000Z"): AuthorizationInput => ({
  userId: "user-1",
  roles,
  now,
});

describe("authorization", () => {
  it("unions permissions across active roles and accepts either matching scope", () => {
    const roles = [
      assignment("COORDINATOR", ["schedule.view"], [scope("SCHOOL", "school-1")]),
      assignment("HR", ["employee.view"], [scope("EMPLOYEE", "employee-1")]),
    ];

    expect(can(input(roles), "schedule.view", { scopeType: "SCHOOL", scopeId: "school-1" })).toBe(true);
    expect(can(input(roles), "employee.view", { scopeType: "EMPLOYEE", scopeId: "employee-1" })).toBe(true);
  });

  it("rejects a permission outside every assigned scope", () => {
    const roles = [assignment("TEACHER", ["schedule.view"], [scope("EMPLOYEE", "employee-1")])];

    expect(can(input(roles), "schedule.view", { scopeType: "EMPLOYEE", scopeId: "employee-2" })).toBe(false);
  });

  it("ignores expired and not-yet-effective roles", () => {
    const expired = assignment(
      "TEACHER",
      ["schedule.view"],
      [scope("EMPLOYEE", "employee-1")],
      "2025-01-01T00:00:00.000Z",
      "2026-01-01T00:00:00.000Z"
    );
    const future = assignment(
      "HR",
      ["employee.view"],
      [scope("EMPLOYEE", "employee-1")],
      "2027-01-01T00:00:00.000Z"
    );

    expect(can(input([expired, future]), "schedule.view")).toBe(false);
    expect(can(input([expired, future]), "employee.view")).toBe(false);
  });

  it("requires a different active approver for maker-checker actions", () => {
    const roles = [assignment("ADMIN", ["schedule.approve"], [scope("ALL", "*")])];
    const authorization = input(roles);

    expect(canApprove(authorization, "schedule.approve", "user-1", "user-1", true)).toBe(false);
    expect(canApprove(authorization, "schedule.approve", "user-1", "user-2", true)).toBe(true);
    expect(canApprove(authorization, "schedule.approve", "user-1", "user-1", false)).toBe(true);
  });
});
