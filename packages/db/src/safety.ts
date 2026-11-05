export interface ParsedDbTarget {
  host: string;
  database: string;
}

export function parseDbUrl(urlStr: string): ParsedDbTarget {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname;
    // Bỏ ký tự gạch chéo đầu tên database
    const database = parsed.pathname.replace(/^\//, "");
    return { host, database };
  } catch {
    throw new Error(`[SafetyError] URL kết nối database không hợp lệ: "${urlStr}"`);
  }
}

/**
 * Kiểm tra xem thao tác phá hủy (reset, seed, truncate, drop) có được phép chạy không.
 * Điều kiện từ chối: host KHÔNG PHẢI localhost/127.0.0.1 VÀ tên DB KHÔNG KẾT THÚC BẰNG _dev hoặc _test,
 * trừ khi có cờ ALLOW_DESTRUCTIVE_DB=1.
 */
export function isDestructiveOperationAllowed(
  urlStr: string,
  allowDestructiveEnv?: string
): { allowed: boolean; reason?: string } {
  if (allowDestructiveEnv === "1") {
    return { allowed: true };
  }

  const { host, database } = parseDbUrl(urlStr);
  const isLocal = host === "localhost" || host === "127.0.0.1";
  const hasSafeSuffix = database.endsWith("_dev") || database.endsWith("_test");

  if (!isLocal && !hasSafeSuffix) {
    return {
      allowed: false,
      reason: `Thao tác phá hủy dữ liệu (reset/seed/truncate/drop) bị TỪ CHỐI trên máy chủ "${host}" và database "${database}". Thao tác chỉ được phép trên localhost hoặc cơ sở dữ liệu có tên kết thúc bằng "_dev" hoặc "_test" (trừ khi đặt biến môi trường ALLOW_DESTRUCTIVE_DB=1).`,
    };
  }

  return { allowed: true };
}

export function assertDestructiveOperationAllowed(
  urlStr: string,
  operationName: string = "Thao tác cơ sở dữ liệu",
  allowDestructiveEnv: string | undefined = process.env.ALLOW_DESTRUCTIVE_DB
): void {
  const result = isDestructiveOperationAllowed(urlStr, allowDestructiveEnv);
  if (!result.allowed) {
    throw new Error(`[SafetyError] ${operationName} bị chặn: ${result.reason}`);
  }
}

/**
 * Kiểm tra tính hợp lệ của database test tích hợp.
 * Điều kiện từ chối: testUrl trống HOẶC trùng với appUrl HOẶC không có hậu tố _test.
 */
export function isTestDatabaseValid(
  testUrl?: string,
  appUrl?: string
): { valid: boolean; reason?: string } {
  if (!testUrl || testUrl.trim() === "") {
    return {
      valid: false,
      reason: "DATABASE_TEST_URL không được để trống cho test tích hợp.",
    };
  }

  if (appUrl && testUrl.trim() === appUrl.trim()) {
    return {
      valid: false,
      reason: "DATABASE_TEST_URL không được trùng với DATABASE_URL để tránh làm hỏng dữ liệu ứng dụng/dev.",
    };
  }

  const { database } = parseDbUrl(testUrl);
  if (!database.endsWith("_test")) {
    return {
      valid: false,
      reason: `DATABASE_TEST_URL phải trỏ vào database có hậu tố "_test" (hiện tại: "${database}").`,
    };
  }

  return { valid: true };
}

export function assertValidTestDatabase(testUrl?: string, appUrl?: string): void {
  const result = isTestDatabaseValid(testUrl, appUrl);
  if (!result.valid) {
    throw new Error(`[SafetyError] Cấu hình database test không hợp lệ: ${result.reason}`);
  }
}
