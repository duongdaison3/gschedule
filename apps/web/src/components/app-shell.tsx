"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Calendar, 
  Users, 
  Clock, 
  FileSpreadsheet, 
  Settings,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Lịch giảng dạy", href: "/", icon: Calendar },
  { name: "Khả dụng & TCS", href: "/availability", icon: Clock },
  { name: "Nhân sự & GV", href: "/teachers", icon: Users },
  { name: "Tính công & CTP", href: "/payroll", icon: FileSpreadsheet },
  { name: "Cấu hình hệ thống", href: "/settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card shrink-0">
        <div className="flex h-16 items-center border-b px-6 gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">GSchedule HN</span>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Điều hướng chính">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4 text-xs text-muted-foreground flex items-center justify-between">
          <span>Phiên bản v2.0 (Bootstrap)</span>
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" /> Sẵn sàng
          </span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pb-16 md:pb-0 min-w-0">
        {/* Top Header Mobile */}
        <header className="flex h-14 items-center justify-between border-b px-4 md:hidden bg-card">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold text-base">GSchedule HN</span>
          </div>
          <div className="text-xs text-muted-foreground">VP Hà Nội</div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 border-t bg-card md:hidden justify-around items-center px-2"
        aria-label="Điều hướng di động"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-md text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate max-w-[64px]">{item.name.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

