export type ErrorCode =
  | "INVALID_MONEY"
  | "INVALID_CREDITS"
  | "INVALID_TIME"
  | "VALIDATION_FAILED"
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "OPTIMISTIC_LOCK_FAILED"
  | "INTERNAL_ERROR";

export class DomainError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) {
    super(message);
    this.name = "DomainError";
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}
