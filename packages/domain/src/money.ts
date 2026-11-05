import { DomainError } from "./errors";
import { Result, ok, err } from "./result";

/**
 * Money đại diện cho số tiền VND integer.
 * Cấm float. Mọi thao tác số học phải là số nguyên.
 */
export type MoneyVND = number & { readonly __brand: unique symbol };

export function createMoney(amount: number): Result<MoneyVND, DomainError> {
  if (!Number.isSafeInteger(amount)) {
    return err(
      new DomainError(
        "INVALID_MONEY",
        "Số tiền phải là số nguyên an toàn (integer), không được có phần thập phân.",
        { amount }
      )
    );
  }

  if (amount < 0) {
    return err(
      new DomainError("INVALID_MONEY", "Số tiền không được âm.", { amount })
    );
  }

  return ok(amount as MoneyVND);
}

export function parseMoneyString(str: string): Result<MoneyVND, DomainError> {
  const cleaned = str.replace(/[^\d-]/g, "").trim();
  if (!cleaned) {
    return err(new DomainError("INVALID_MONEY", "Chuỗi số tiền không hợp lệ.", { str }));
  }
  const num = Number(cleaned);
  return createMoney(num);
}

export function addMoney(a: MoneyVND, b: MoneyVND): MoneyVND {
  return (a + b) as MoneyVND;
}

export function subtractMoney(a: MoneyVND, b: MoneyVND): Result<MoneyVND, DomainError> {
  const result = a - b;
  if (result < 0) {
    return err(new DomainError("INVALID_MONEY", "Số tiền còn lại không được âm.", { a, b }));
  }
  return ok(result as MoneyVND);
}

export function multiplyMoney(a: MoneyVND, multiplier: number): Result<MoneyVND, DomainError> {
  if (!Number.isInteger(multiplier)) {
    return err(new DomainError("INVALID_MONEY", "Hệ số nhân tiền phải là số nguyên.", { multiplier }));
  }
  const result = a * multiplier;
  return createMoney(result);
}

export function formatMoney(amount: MoneyVND | number): string {
  const integerPart = Math.round(amount);
  const formatted = integerPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formatted} ₫`;
}

