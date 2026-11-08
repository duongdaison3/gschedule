import { describe, it, expect } from "vitest";
import {
  parseDbUrl,
  isDestructiveOperationAllowed,
  assertDestructiveOperationAllowed,
  isTestDatabaseValid,
  assertValidTestDatabase,
} from "../safety";
import { resolveSslConfig } from "../index";

describe("Database Safety Guards", () => {
  describe("parseDbUrl", () => {
    it("phân tích chính xác host và tên database", () => {
      const res = parseDbUrl("postgresql://user:pass@db.aivencloud.com:12345/gschedule_dev?sslmode=require");
      expect(res.host).toBe("db.aivencloud.com");
      expect(res.database).toBe("gschedule_dev");
    });

    it("ném lỗi nếu URL sai cú pháp", () => {
      expect(() => parseDbUrl("invalid-url")).toThrow("[SafetyError]");
    });
  });

  describe("isDestructiveOperationAllowed (db:reset, db:seed, truncate)", () => {
    it("cho phép trên localhost", () => {
      const res = isDestructiveOperationAllowed("postgresql://postgres:pass@localhost:5432/any_db");
      expect(res.allowed).toBe(true);
    });

    it("cho phép trên 127.0.0.1", () => {
      const res = isDestructiveOperationAllowed("postgresql://postgres:pass@127.0.0.1:5432/any_db");
      expect(res.allowed).toBe(true);
    });

    it("cho phép trên cloud host nếu tên database có hậu tố _dev", () => {
      const res = isDestructiveOperationAllowed("postgresql://avnadmin:pass@postgres-xyz.aivencloud.com:12345/gschedule_dev");
      expect(res.allowed).toBe(true);
    });

    it("cho phép trên cloud host nếu tên database có hậu tố _test", () => {
      const res = isDestructiveOperationAllowed("postgresql://avnadmin:pass@postgres-xyz.aivencloud.com:12345/gschedule_test");
      expect(res.allowed).toBe(true);
    });

    it("TỪ CHỐI trên cloud host nếu tên database không kết thúc bằng _dev hoặc _test", () => {
      const res = isDestructiveOperationAllowed("postgresql://avnadmin:pass@postgres-xyz.aivencloud.com:12345/gschedule_prod");
      expect(res.allowed).toBe(false);
      expect(res.reason).toContain("bị TỪ CHỐI trên máy chủ");
      expect(res.reason).toContain("gschedule_prod");
    });

    it("TỪ CHỐI trên cloud host nếu tên database là gschedule chung", () => {
      const res = isDestructiveOperationAllowed("postgresql://avnadmin:pass@postgres-xyz.aivencloud.com:12345/gschedule");
      expect(res.allowed).toBe(false);
    });

    it("cho phép nếu có cờ bypass ALLOW_DESTRUCTIVE_DB=1", () => {
      const res = isDestructiveOperationAllowed(
        "postgresql://avnadmin:pass@postgres-xyz.aivencloud.com:12345/gschedule_prod",
        "1"
      );
      expect(res.allowed).toBe(true);
    });

    it("assertDestructiveOperationAllowed ném ngoại lệ khi bị từ chối", () => {
      expect(() =>
        assertDestructiveOperationAllowed(
          "postgresql://avnadmin:pass@postgres-xyz.aivencloud.com:12345/gschedule_prod",
          "pnpm db:reset",
          "0"
        )
      ).toThrow("[SafetyError] pnpm db:reset bị chặn");
    });
  });

  describe("isTestDatabaseValid & assertValidTestDatabase", () => {
    it("từ chối nếu DATABASE_TEST_URL trống", () => {
      const res = isTestDatabaseValid("", "postgresql://localhost:5432/gschedule_dev");
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("không được để trống");
    });

    it("từ chối nếu DATABASE_TEST_URL trùng với DATABASE_URL", () => {
      const url = "postgresql://localhost:5433/gschedule_test";
      const res = isTestDatabaseValid(url, url);
      expect(res.valid).toBe(false);
      expect(res.reason).toContain("không được trùng với DATABASE_URL");
    });

    it("từ chối nếu tên DB test không có hậu tố _test", () => {
      const res = isTestDatabaseValid("postgresql://localhost:5433/gschedule_dev", "postgresql://localhost:5432/gschedule_other");
      expect(res.valid).toBe(false);
      expect(res.reason).toContain('hậu tố "_test"');
    });

    it("hợp lệ khi DATABASE_TEST_URL riêng biệt và kết thúc bằng _test", () => {
      const res = isTestDatabaseValid(
        "postgresql://postgres:pass@localhost:5433/gschedule_test",
        "postgresql://avnadmin:pass@db.aivencloud.com:12345/gschedule_dev"
      );
      expect(res.valid).toBe(true);
    });

    it("assertValidTestDatabase ném ngoại lệ nếu không hợp lệ", () => {
      expect(() =>
        assertValidTestDatabase("postgresql://localhost:5432/gschedule_dev", "postgresql://localhost:5432/gschedule_dev")
      ).toThrow("[SafetyError]");
    });
  });

  describe("resolveSslConfig", () => {
    it("trả về false nếu URL không yêu cầu SSL", () => {
      const ssl = resolveSslConfig("postgresql://postgres:pass@localhost:5432/gschedule_dev");
      expect(ssl).toBe(false);
    });

    it("trả về 'require' nếu URL chứa sslmode=require", () => {
      const ssl = resolveSslConfig("postgresql://avnadmin:pass@db.aivencloud.com:12345/gschedule_dev?sslmode=require");
      expect(ssl).toBe("require");
    });

    it("cấu hình ca và rejectUnauthorized=true khi cung cấp PG_CA_CERT dạng chuỗi PEM", () => {
      const mockPem = "-----BEGIN CERTIFICATE-----\nMIIB...\n-----END CERTIFICATE-----";
      const ssl = resolveSslConfig(
        "postgresql://avnadmin:pass@db.aivencloud.com:12345/gschedule_dev?sslmode=require",
        mockPem
      );
      expect(ssl).toEqual({
        rejectUnauthorized: true,
        ca: mockPem,
      });
    });

    it("trong production, không bao giờ trả về rejectUnauthorized: false ngay cả khi có cờ", () => {
      process.env.ALLOW_INSECURE_SSL = "1";
      const ssl = resolveSslConfig(
        "postgresql://avnadmin:pass@db.aivencloud.com:12345/gschedule_dev?sslmode=require",
        undefined,
        "production"
      );
      expect(ssl).toBe("require");
      delete process.env.ALLOW_INSECURE_SSL;
    });
  });
});

