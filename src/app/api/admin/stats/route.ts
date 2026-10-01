import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Login required" },
      { status: 401 }
    );
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    return NextResponse.json(
      { error: "Forbidden: Admin or Editor privileges required" },
      { status: 403 }
    );
  }

  const [metrics, logs, users, content, summary, bookings, instructors] =
    await Promise.all([
      db.getMetrics(),
      db.getAuditLogs(6),
      db.getUsers(),
      db.getContent(),
      db.getDashboardSummary(),
      db.getBookings(),
      db.getInstructors(),
    ]);

  return NextResponse.json({
    summary,
    metrics,
    recentActivity: logs,
    counts: {
      users: users.length,
      content: content.length,
      bookings: bookings.length,
      instructors: instructors.length,
      activeUsers: users.filter((u) => u.status === "ACTIVE").length,
      publishedContent: content.filter((c) => c.status === "PUBLISHED").length,
    },
  });
}
