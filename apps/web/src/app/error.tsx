"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi ứng dụng:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">Đã xảy ra sự cố!</h2>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        Hệ thống ghi nhận lỗi không mong muốn. Vui lòng thử tải lại hoặc liên hệ quản trị viên.
      </p>
      {error.message && (
        <div className="mt-4 p-3 bg-muted rounded text-xs font-mono text-muted-foreground max-w-lg overflow-auto">
          {error.message}
        </div>
      )}
      <div className="mt-6">
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </button>
      </div>
    </div>
  );
}
