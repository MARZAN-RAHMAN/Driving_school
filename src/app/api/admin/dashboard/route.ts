import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")
  ) {
    return NextResponse.json(
      { error: "Forbidden: Authorized session required" },
      { status: 403 }
    );
  }

  const [summary, bookings, instructors, locations, packages, logs] =
    await Promise.all([
      db.getDashboardSummary(),
      db.getBookings(),
      db.getInstructors(),
      db.getLocations(),
      db.getLessonPackages(),
      db.getAuditLogs(10),
    ]);

  return NextResponse.json({
    summary,
    bookings,
    instructors,
    locations,
    packages,
    logs,
  });
}
