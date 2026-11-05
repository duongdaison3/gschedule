import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "GSchedule — Quản lý nhân sự & điều phối lịch giảng dạy",
  description: "Hệ thống điều phối lịch giảng dạy, kiểm tra TCS, tính công và thù lao giáo viên VP Hà Nội",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
