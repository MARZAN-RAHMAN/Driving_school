import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { TransmissionType } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Active session required" },
      { status: 401 }
    );
  }

  // Strictly filter bookings by student's authenticated email to ensure data isolation
  const allBookings = await db.getBookings();
  const studentEmail = session.user.email.toLowerCase();
  const studentBookings = allBookings.filter(
    (b) => b.studentEmail.toLowerCase() === studentEmail
  );

  return NextResponse.json({
    success: true,
    bookings: studentBookings,
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Active session required" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const {
      lessonTitle,
      transmission,
      pickupLocation,
      dateTime,
      durationHours,
      notes,
      instructorId,
      instructorName,
    } = body;

    if (!lessonTitle || !pickupLocation || !dateTime) {
      return NextResponse.json(
        { error: "Lesson title, pickup location, and date/time are required" },
        { status: 400 }
      );
    }

    const settings = await db.getBusinessSettings();
    const isManual = transmission === "MANUAL";
    const hourlyRate = isManual ? settings.hourlyRateManual : settings.hourlyRateAutomatic;
    const hours = Number(durationHours) || 2;
    const price = Math.round(hourlyRate * hours);

    const newBooking = await db.createBooking({
      studentName: session.user.name,
      studentEmail: session.user.email,
      studentPhone: "+44 7911 345678", // Default linked to profile
      instructorId: instructorId || "inst_01",
      instructorName: instructorName || "Dave Miller",
      lessonTitle,
      transmission: (transmission as TransmissionType) || "MANUAL",
      pickupLocation,
      dateTime,
      durationHours: hours,
      price,
      status: "PENDING",
      notes: notes || "Requested via Student Portal",
    });

    await db.addAuditLog({
      action: "STUDENT_LESSON_REQUESTED",
      actorEmail: session.user.email,
      target: `Booking: ${newBooking.id} (${lessonTitle})`,
      ip: req.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "INFO",
    });

    return NextResponse.json({
      success: true,
      booking: newBooking,
      message: "Lesson booking requested successfully. Our dispatch manager will confirm shortly.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to book lesson" },
      { status: 500 }
    );
  }
}
