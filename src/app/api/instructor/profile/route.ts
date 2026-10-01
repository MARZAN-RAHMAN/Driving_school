import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

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

  return NextResponse.json({ instructor });
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
    const { phone, bio, areas } = body;

    let instructor = await db.getInstructorByEmail(user.email);
    if (!instructor) {
      const all = await db.getInstructors();
      instructor = all.find((i) => i.id === "inst_01") || all[0];
    }

    const updates: Record<string, unknown> = {};
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (areas !== undefined && Array.isArray(areas)) updates.areas = areas;

    const updated = await db.updateInstructor(instructor.id, updates);

    await db.addAuditLog({
      action: "INSTRUCTOR_PROFILE_UPDATED",
      actorEmail: user.email,
      target: `Instructor ${instructor.id} (${instructor.name}) Profile`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({ success: true, instructor: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 }
    );
  }
}
