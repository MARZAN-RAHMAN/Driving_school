import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookingStatus } from "@/types";

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

  const lessons = await db.getBookingsByInstructor(instructor.id);
  return NextResponse.json({ lessons, bookings: lessons });
}

export async function PATCH(request: Request) {
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
    const { bookingId, status, instructorNotes, progressNotes } = body;

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await db.getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Role-based Resource Ownership Check:
    // If not Admin, ensure this lesson belongs to the logged-in instructor
    let currentInstructor = await db.getInstructorByEmail(user.email);
    if (!currentInstructor) {
      const all = await db.getInstructors();
      currentInstructor = all.find((i) => i.id === "inst_01") || all[0];
    }

    if (
      user.role !== "ADMIN" &&
      booking.instructorId !== currentInstructor.id &&
      booking.instructorName !== currentInstructor.name
    ) {
      return NextResponse.json(
        { error: "Forbidden: You cannot modify lessons belonging to other instructors." },
        { status: 403 }
      );
    }

    const updated = await db.updateLessonNotes(
      bookingId,
      instructorNotes ?? booking.instructorNotes ?? "",
      progressNotes ?? booking.progressNotes,
      status as BookingStatus | undefined
    );

    await db.addAuditLog({
      action: "INSTRUCTOR_LESSON_UPDATED",
      actorEmail: user.email,
      target: `Booking ${bookingId} [Status: ${status || booking.status}]`,
      ip: "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update lesson" },
      { status: 500 }
    );
  }
}
