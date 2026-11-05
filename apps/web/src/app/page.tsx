import { formatMoney, formatCredits, formatVNDate } from "@gschedule/domain";
import { Calendar, CheckCircle2, Shield } from "lucide-react";

export default function Home() {
  const sampleMoney = formatMoney(1234000);
  const sampleCredits = formatCredits(40);
  const sampleDate = formatVNDate(new Date());

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Hệ thống Quản lý & Điều phối Lịch giảng dạy (VP Hà Nội)
        </h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Nền tảng vận hành tập trung: Điều phối lịch, kiểm soát khả dụng TCS, tính công CTP và thù lao CTV.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Bất biến tiền tệ (VND)</span>
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{sampleMoney}</div>
          <p className="text-xs text-muted-foreground">
            Integer VND, định dạng chuẩn Việt Nam, loại bỏ sai số float.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Quy đổi tiết & TCS</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{sampleCredits} tiết</div>
          <p className="text-xs text-muted-foreground">
            Centi-tiết (40 centi = 0.40 tiết), ngưỡng TCS kiểm soát khả dụng.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-sm font-medium">Thời gian chuẩn</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{sampleDate}</div>
          <p className="text-xs text-muted-foreground">
            Asia/Ho_Chi_Minh (UTC+7), teachingDate nhất quán.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
        <h2 className="font-semibold text-base flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Nền tảng P00 đã sẵn sàng
        </h2>
        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
          <li>pnpm Monorepo: <code>apps/web</code>, <code>packages/domain</code>, <code>packages/db</code>.</li>
          <li>Database PostgreSQL 17 cấu hình Docker Compose (dev 5432, test 5433).</li>
          <li>Kiểm tra trạng thái hệ thống tại endpoint <code>/api/health</code>.</li>
        </ul>
      </div>
    </div>
  );
}
