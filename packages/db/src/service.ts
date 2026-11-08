import { can, type AuthorizationInput, type ResourceScope } from "@gschedule/domain";
import { DomainError } from "@gschedule/domain";

export interface ServiceTransaction {
  audit: (entry: AuditEntry) => Promise<void>;
  checkVersion: (entityType: string, entityId: string, expectedVersion: number) => Promise<boolean>;
}

export interface AuditEntry {
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  reason?: string;
  source?: string;
}

export interface ServiceContext {
  authorization: AuthorizationInput;
  transaction: <T>(work: (tx: ServiceTransaction) => Promise<T>) => Promise<T>;
}

export async function withService<T>(
  context: ServiceContext,
  permission: string,
  resource: ResourceScope | undefined,
  audit: AuditEntry,
  expectedVersion: number | undefined,
  work: (tx: ServiceTransaction) => Promise<T>
): Promise<T> {
  if (!can(context.authorization, permission, resource)) {
    throw new DomainError("FORBIDDEN", `Không có quyền ${permission}`);
  }
  if (!audit.reason && ["OVERRIDE", "CANCEL", "UNLOCK", "EXPORT", "REVEAL"].includes(audit.action)) {
    throw new DomainError("VALIDATION_FAILED", `Thiếu lý do cho audit ${audit.action}`);
  }

  return context.transaction(async (tx) => {
    if (
      expectedVersion !== undefined &&
      !(await tx.checkVersion(audit.entityType, audit.entityId, expectedVersion))
    ) {
      throw new DomainError("OPTIMISTIC_LOCK_FAILED", "Dữ liệu đã thay đổi, vui lòng tải lại");
    }
    const result = await work(tx);
    await tx.audit(audit);
    return result;
  });
}
