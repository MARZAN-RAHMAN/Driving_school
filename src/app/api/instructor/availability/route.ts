import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorAvailability } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let instructor = await db.getInstructorByEmail(user.email);
  if (!instructor) {
    const all = await db.getInstructors();
    instructor = all.find((i) => i.id === "inst_01") || all[0];
  }

  return NextResponse.json({ availability: instructor.availability });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const availability = body.availability || body;

    let instructor = await db.getInstructorByEmail(user.email);
    if (!instructor) {
      const all = await db.getInstructors();
      instructor = all.find((i) => i.id === "inst_01") || all[0];
    }

    const updated = await db.updateInstructorAvailability(
      instructor.id,
      availability as InstructorAvailability
    );

    await db.addAuditLog({
      action: "INSTRUCTOR_AVAILABILITY_UPDATED",
      actorEmail: user.email,
      target: `Instructor ${instructor.id} (${instructor.name}) Availability`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({ success: true, instructor: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update availability" },
      { status: 500 }
    );
  }
}

export const POST = PUT;
