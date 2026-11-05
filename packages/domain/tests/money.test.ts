import { describe, it, expect } from "vitest";
import {
  createMoney,
  parseMoneyString,
  formatMoney,
  addMoney,
  subtractMoney,
  multiplyMoney,
} from "../src/money";

describe("Money (VND Integer domain utility)", () => {
  it("format tiền tệ chuẩn vi-VN: 1.234.000 ₫", () => {
    const res = createMoney(1234000);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(formatMoney(res.value)).toBe("1.234.000 ₫");
    }
  });

  it("từ chối số thập phân ở biên (cấm float cho tiền)", () => {
    const res = createMoney(130000.5);
    expect(res.ok).toBe(false);
  });

  it("từ chối số tiền âm ở biên", () => {
    const res = createMoney(-1);
    expect(res.ok).toBe(false);
  });

  it("cộng, trừ, nhân tiền an toàn", () => {
    const m1 = createMoney(130000);
    const m2 = createMoney(260000);
    if (m1.ok && m2.ok) {
      const sum = addMoney(m1.value, m2.value);
      expect(sum).toBe(390000);
      expect(formatMoney(sum)).toBe("390.000 ₫");

      const sub = subtractMoney(m2.value, m1.value);
      expect(sub.ok).toBe(true);
      if (sub.ok) {
        expect(sub.value).toBe(130000);
      }

      const mult = multiplyMoney(m1.value, 3);
      expect(mult.ok).toBe(true);
      if (mult.ok) {
        expect(mult.value).toBe(390000);
      }
    }
  });

  it("parse chuỗi tiền tệ", () => {
    const res = parseMoneyString("1.234.000 ₫");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toBe(1234000);
    }
  });
});

