import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { TransmissionType } from "@/types";

export async function GET(request: NextRequest) {
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

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const transmission = searchParams.get("transmission") || undefined;
  const query = searchParams.get("query") || undefined;

  const bookings = await db.getBookings({ status, transmission, query });

  return NextResponse.json({
    bookings,
    total: bookings.length,
  });
}

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const {
      studentName,
      studentEmail,
      studentPhone,
      instructorId,
      instructorName,
      lessonTitle,
      transmission,
      pickupLocation,
      dateTime,
      durationHours,
      price,
      notes,
      testCenter,
    } = body;

    if (!studentName || !instructorName || !pickupLocation || !dateTime) {
      return NextResponse.json(
        { error: "Missing required booking dispatch fields" },
        { status: 400 }
      );
    }

    const newBooking = await db.createBooking({
      studentName,
      studentEmail: studentEmail || "student@nextdrive.uk",
      studentPhone: studentPhone || "+44 7900 000000",
      instructorId: instructorId || "inst_01",
      instructorName,
      lessonTitle: lessonTitle || "Standard 2-Hour Driving Lesson",
      transmission: (transmission as TransmissionType) || "MANUAL",
      pickupLocation,
      dateTime,
      durationHours: Number(durationHours) || 2,
      price: Number(price) || 75,
      status: "CONFIRMED",
      notes,
      testCenter,
    });

    await db.addAuditLog({
      action: "BOOKING_DISPATCHED",
      actorEmail: session.user.email,
      target: `${newBooking.id} (${newBooking.studentName})`,
      ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create booking dispatch" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
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

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    const updated = await db.updateBookingStatus(id, status);
    if (!updated) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "BOOKING_STATUS_UPDATED",
      actorEmail: session.user.email,
      target: `Booking ID: ${id} -> ${status}`,
      ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "SUCCESS",
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update booking" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const deleted = await db.deleteBooking(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    await db.addAuditLog({
      action: "BOOKING_CANCELLED_REMOVED",
      actorEmail: session.user.email,
      target: `Booking ID: ${id}`,
      ip: request.headers.get("x-forwarded-for") || "127.0.0.1",
      severity: "WARNING",
    });

    return NextResponse.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete booking" },
      { status: 500 }
    );
  }
}
