import { NextResponse } from "next/server";
import { getSqlClient } from "@gschedule/db";

export async function GET() {
  try {
    const sql = getSqlClient();
    // Chạy truy vấn nhẹ để kiểm tra kết nối Postgres
    const result = await sql`SELECT 1 as connected`;
    if (result && result.length > 0) {
      return NextResponse.json(
        {
          status: "healthy",
          database: "connected",
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "no response",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Lỗi kết nối cơ sở dữ liệu";
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        error: message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
