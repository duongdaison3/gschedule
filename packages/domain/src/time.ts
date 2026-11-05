import { DomainError } from "./errors";
import { Result, ok, err } from "./result";

export const TIMEZONE_VN = "Asia/Ho_Chi_Minh";
const VN_OFFSET_HOURS = 7;
const VN_OFFSET_MS = VN_OFFSET_HOURS * 60 * 60 * 1000;

export interface LocalDateVN {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

/**
 * Chuyển đổi timestamp (Date, string ISO, hoặc unix ms) sang ngày giờ VN (Asia/Ho_Chi_Minh).
 */
export function toVNParts(dateInput: Date | string | number): LocalDateVN & { hour: number; minute: number } {
  const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) {
    throw new DomainError("INVALID_TIME", `Thời gian không hợp lệ: ${dateInput}`);
  }
  // Offset cố định UTC+7 cho Asia/Ho_Chi_Minh (Việt Nam không dùng DST)
  const vnTime = new Date(d.getTime() + VN_OFFSET_MS);
  return {
    year: vnTime.getUTCFullYear(),
    month: vnTime.getUTCMonth() + 1,
    day: vnTime.getUTCDate(),
    hour: vnTime.getUTCHours(),
    minute: vnTime.getUTCMinutes(),
  };
}

/**
 * Trả về teachingDate theo định dạng chuỗi YYYY-MM-DD hoặc dd/MM/yyyy theo múi giờ Asia/Ho_Chi_Minh.
 */
export function getTeachingDate(dateInput: Date | string | number): string {
  const parts = toVNParts(dateInput);
  const mm = parts.month.toString().padStart(2, "0");
  const dd = parts.day.toString().padStart(2, "0");
  return `${parts.year}-${mm}-${dd}`;
}

export function formatVNDate(dateInput: Date | string | number): string {
  const parts = toVNParts(dateInput);
  const mm = parts.month.toString().padStart(2, "0");
  const dd = parts.day.toString().padStart(2, "0");
  return `${dd}/${mm}/${parts.year}`;
}

/**
 * Lấy thứ trong tuần theo chuẩn ISO 8601 (1 = Thứ Hai, ..., 7 = Chủ Nhật) theo giờ VN.
 */
export function getISOWeekday(dateInput: Date | string | number): number {
  const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  const vnTime = new Date(d.getTime() + VN_OFFSET_MS);
  const day = vnTime.getUTCDay(); // 0 is Sunday, 1 is Monday
  return day === 0 ? 7 : day;
}

/**
 * Tính ngày đầu tuần (Thứ Hai) và ngày cuối tuần (Chủ Nhật) theo giờ VN.
 * Trả về dưới dạng chuỗi YYYY-MM-DD.
 */
export function getWeekRange(dateInput: Date | string | number): { start: string; end: string } {
  const d = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  const vnTime = new Date(d.getTime() + VN_OFFSET_MS);
  const day = vnTime.getUTCDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(vnTime.getTime() + diffToMonday * 24 * 60 * 60 * 1000);
  const sunday = new Date(monday.getTime() + 6 * 24 * 60 * 60 * 1000);

  const mYear = monday.getUTCFullYear();
  const mM = (monday.getUTCMonth() + 1).toString().padStart(2, "0");
  const mD = monday.getUTCDate().toString().padStart(2, "0");

  const sYear = sunday.getUTCFullYear();
  const sM = (sunday.getUTCMonth() + 1).toString().padStart(2, "0");
  const sD = sunday.getUTCDate().toString().padStart(2, "0");

  return {
    start: `${mYear}-${mM}-${mD}`,
    end: `${sYear}-${sM}-${sD}`,
  };
}

/**
 * Kiểm tra xem một tuần (chứa ngày dateInput) có phải là tuần giao thoa giữa 2 tháng hay không.
 */
export function isCrossingMonthWeek(dateInput: Date | string | number): boolean {
  const { start, end } = getWeekRange(dateInput);
  const startMonth = start.slice(0, 7);
  const endMonth = end.slice(0, 7);
  return startMonth !== endMonth;
}
