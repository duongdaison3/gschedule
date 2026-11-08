import { describe, expect, it } from "vitest";
import { withService } from "../service";

describe("withService", () => {
  it("checks permission, version, mutation, and audit in one transaction", async () => {
    const calls: string[] = [];
    const result = await withService(
      {
        authorization: {
          userId: "user-1",
          now: "2026-06-01T00:00:00.000Z",
          roles: [{
            role: "ADMIN",
            permissions: ["schedule.update"],
            scopes: [{ scopeType: "ALL", scopeId: "*" }],
            effectiveFrom: "2026-01-01T00:00:00.000Z",
          }],
        },
        transaction: async (work) => work({
          checkVersion: async () => {
            calls.push("version");
            return true;
          },
          audit: async () => {
            calls.push("audit");
          },
        }),
      },
      "schedule.update",
      undefined,
      {
        actorUserId: "user-1",
        action: "UPDATE",
        entityType: "schedule",
        entityId: "schedule-1",
      },
      3,
      async () => {
        calls.push("work");
        return "updated";
      }
    );

    expect(result).toBe("updated");
    expect(calls).toEqual(["version", "work", "audit"]);
  });

  it("rejects a stale version before mutation", async () => {
    let mutated = false;

    await expect(
      withService(
        {
          authorization: {
            userId: "user-1",
            roles: [{
              role: "ADMIN",
              permissions: ["schedule.update"],
              scopes: [{ scopeType: "ALL", scopeId: "*" }],
              effectiveFrom: "2026-01-01T00:00:00.000Z",
            }],
          },
          transaction: async (work) => work({
            checkVersion: async () => false,
            audit: async () => undefined,
          }),
        },
        "schedule.update",
        undefined,
        {
          actorUserId: "user-1",
          action: "UPDATE",
          entityType: "schedule",
          entityId: "schedule-1",
        },
        2,
        async () => {
          mutated = true;
          return undefined;
        }
      )
    ).rejects.toMatchObject({ code: "OPTIMISTIC_LOCK_FAILED" });

    expect(mutated).toBe(false);
  });
});
