import { describe, it, expect } from "vitest";
import {
  getTeachingDate,
  formatVNDate,
  getISOWeekday,
  getWeekRange,
  isCrossingMonthWeek,
} from "../src/time";

describe("Time (Asia/Ho_Chi_Minh & Teaching Date utility)", () => {
  it("test 2026-04-30T17:30:00Z -> teachingDate 01/05 (UTC+7)", () => {
    // 17h30 UTC ngày 30/04/2026 + 7 tiếng = 00h30 ngày 01/05/2026
    const isoString = "2026-04-30T17:30:00Z";
    const teachingDate = getTeachingDate(isoString);
    expect(teachingDate).toBe("2026-05-01");

    const formattedVN = formatVNDate(isoString);
    expect(formattedVN).toBe("01/05/2026");
  });

  it("test tuần giao thoa tháng 30/04 - 01/05/2026", () => {
    // 2026-04-30 là Thứ Năm -> Tuần bắt đầu Thứ Hai 2026-04-27, kết thúc Chủ Nhật 2026-05-03
    const dateInput = "2026-04-30T10:00:00Z";
    const week = getWeekRange(dateInput);
    expect(week.start).toBe("2026-04-27");
    expect(week.end).toBe("2026-05-03");

    expect(isCrossingMonthWeek(dateInput)).toBe(true);
  });

  it("tính đúng ISO weekday (1=T2, ..., 7=CN)", () => {
    // 2026-04-30 là Thứ Năm (weekday 4)
    expect(getISOWeekday("2026-04-30T08:00:00Z")).toBe(4);
    // 2026-05-03 là Chủ Nhật (weekday 7)
    expect(getISOWeekday("2026-05-03T08:00:00Z")).toBe(7);
  });
});

