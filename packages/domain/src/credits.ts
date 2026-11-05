import { DomainError } from "./errors";
import { Result, ok, err } from "./result";

/**
 * Centi-tiết: integer đại diện cho tiết giảng dạy nhân với 100.
 * Ví dụ: 0.40 tiết -> 40 centi-tiết.
 * 1.00 tiết -> 100 centi-tiết.
 * CẤM float cho số tiết. Mọi phép tính cộng/trừ/so sánh thực hiện trên centi-tiết integer.
 */
export type CentiCredits = number & { readonly __brand: unique symbol };

export function createCredits(centiCredits: number): Result<CentiCredits, DomainError> {
  if (!Number.isSafeInteger(centiCredits)) {
    return err(
      new DomainError("INVALID_CREDITS", "Centi-tiết phải là số nguyên an toàn, cấm float.", {
        centiCredits,
      })
    );
  }
  if (centiCredits < 0) {
    return err(
      new DomainError("INVALID_CREDITS", "Số tiết không được âm.", {
        centiCredits,
      })
    );
  }
  return ok(centiCredits as CentiCredits);
}

/**
 * Parse chuỗi biểu diễn số tiết (ví dụ: "0.40", "1", "3.00", "0.5") thành CentiCredits integer.
 * Tránh hoàn toàn lỗi dấu phẩy động bằng cách parse chuỗi phần nguyên và phần thập phân.
 */
export function parseCredits(raw: string | number): Result<CentiCredits, DomainError> {
  const str = typeof raw === "number" ? raw.toString() : raw.trim();
  if (!str) {
    return err(new DomainError("INVALID_CREDITS", "Chuỗi số tiết không được để trống."));
  }

  // Chấp nhận dạng số "1", "0.4", "0.40", "3.00"
  const match = /^(\d+)(?:\.(\d+))?$/.exec(str);
  if (!match) {
    return err(new DomainError("INVALID_CREDITS", `Định dạng số tiết không hợp lệ: "${str}"`));
  }

  const integerPartStr = match[1];
  const decimalPartStr = match[2] || "";

  const intVal = parseInt(integerPartStr, 10);
  if (isNaN(intVal)) {
    return err(new DomainError("INVALID_CREDITS", `Không thể đọc phần nguyên: "${str}"`));
  }

  // Lấy 2 chữ số thập phân đầu tiên và chuẩn hóa (padEnd 2 ký tự hoặc làm tròn)
  let centi = intVal * 100;
  if (decimalPartStr.length > 0) {
    const twoDigits = decimalPartStr.slice(0, 2).padEnd(2, "0");
    const decVal = parseInt(twoDigits, 10);
    // Nếu có chữ số thứ 3 >= 5 thì làm tròn
    if (decimalPartStr.length >= 3 && parseInt(decimalPartStr[2], 10) >= 5) {
      centi += decVal + 1;
    } else {
      centi += decVal;
    }
  }

  return createCredits(centi);
}

export function formatCredits(credits: CentiCredits | number): string {
  const intVal = Math.floor(credits / 100);
  const rem = Math.abs(credits % 100);
  const remStr = rem.toString().padStart(2, "0");
  return `${intVal}.${remStr}`;
}

export function addCredits(a: CentiCredits, b: CentiCredits): CentiCredits {
  return (a + b) as CentiCredits;
}

export function subtractCredits(a: CentiCredits, b: CentiCredits): Result<CentiCredits, DomainError> {
  const result = a - b;
  if (result < 0) {
    return err(new DomainError("INVALID_CREDITS", "Số tiết còn lại không được âm.", { a, b }));
  }
  return ok(result as CentiCredits);
}

export function compareCredits(a: CentiCredits, b: CentiCredits): number {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}

