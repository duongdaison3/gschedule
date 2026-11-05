import { describe, it, expect } from "vitest";
import {
  createCredits,
  parseCredits,
  formatCredits,
  addCredits,
  compareCredits,
} from "../src/credits";

describe("Credits (Centi-tiết domain utility)", () => {
  it("parse '0.40' -> 40 centi-tiết", () => {
    const res = parseCredits("0.40");
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value).toBe(40);
      expect(formatCredits(res.value)).toBe("0.40");
    }
  });

  it("parse các mã số tiết thông dụng", () => {
    expect(parseCredits("1").ok ? (parseCredits("1") as any).value : 0).toBe(100);
    expect(parseCredits("0.50").ok ? (parseCredits("0.50") as any).value : 0).toBe(50);
    expect(parseCredits("3.00").ok ? (parseCredits("3.00") as any).value : 0).toBe(300);
    expect(parseCredits("2.00").ok ? (parseCredits("2.00") as any).value : 0).toBe(200);
  });

  it("so sánh compare(41, 40) > 0 và so sánh TCS ngưỡng 40 centi-tiết", () => {
    const c41 = createCredits(41);
    const c40 = createCredits(40);
    expect(c41.ok && c40.ok).toBe(true);
    if (c41.ok && c40.ok) {
      expect(compareCredits(c41.value, c40.value)).toBeGreaterThan(0);
      expect(compareCredits(c40.value, c41.value)).toBeLessThan(0);
      expect(compareCredits(c40.value, c40.value)).toBe(0);
    }
  });

  it("không dùng float khi cộng nhiều lần (tránh sai số 0.1 + 0.2)", () => {
    const c1 = parseCredits("0.10");
    const c2 = parseCredits("0.20");
    if (c1.ok && c2.ok) {
      const sum = addCredits(c1.value, c2.value);
      expect(sum).toBe(30);
      expect(formatCredits(sum)).toBe("0.30");
    }
  });

  it("từ chối số âm hoặc centi-tiết không phải integer", () => {
    const res1 = createCredits(-10);
    expect(res1.ok).toBe(false);

    const res2 = createCredits(40.5);
    expect(res2.ok).toBe(false);
  });
});

