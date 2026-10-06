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
    if (user.role === "ADMIN") {
      const all = await db.getInstructors();
      instructor = all[0];
    } else {
      return NextResponse.json(
        { error: "Instructor record not found for this account" },
        { status: 404 }
      );
    }
  }

  if (!instructor) {
    return NextResponse.json({ error: "No instructor profile available" }, { status: 404 });
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
    const { phone, bio, areas, avatar, avatarPositionX, avatarPositionY, avatarZoom } = body;

    let instructor = await db.getInstructorByEmail(user.email);
    if (!instructor) {
      if (user.role === "ADMIN" && body.instructorId) {
        instructor = await db.getInstructorById(body.instructorId);
      } else {
        return NextResponse.json(
          { error: "Instructor record not found for this account" },
          { status: 404 }
        );
      }
    }

    if (!instructor) {
      return NextResponse.json({ error: "Instructor record not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (areas !== undefined && Array.isArray(areas)) updates.areas = areas;
    if (avatar !== undefined) updates.avatar = avatar;
    if (avatarPositionX !== undefined) updates.avatarPositionX = Number(avatarPositionX);
    if (avatarPositionY !== undefined) updates.avatarPositionY = Number(avatarPositionY);
    if (avatarZoom !== undefined) updates.avatarZoom = Number(avatarZoom);

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
