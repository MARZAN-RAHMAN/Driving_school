import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "students";

  if (type === "students") {
    const students = await db.getStudents();
    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Phone",
      "Postcode",
      "Theory Status",
      "Hours Completed",
      "Assigned Instructor ID",
      "Assigned Instructor Name",
      "Status",
      "Test Date",
      "Provisional Licence",
      "Notes",
      "Created At",
    ];

    const rows = students.map((s) => [
      `"${s.id}"`,
      `"${(s.name || "").replace(/"/g, '""')}"`,
      `"${(s.email || "").replace(/"/g, '""')}"`,
      `"${(s.phone || "").replace(/"/g, '""')}"`,
      `"${s.postcode}"`,
      `"${s.theoryStatus}"`,
      s.hoursCompleted,
      `"${s.assignedInstructorId || ""}"`,
      `"${(s.assignedInstructorName || "").replace(/"/g, '""')}"`,
      `"${s.status}"`,
      `"${(s.testDate || "").replace(/"/g, '""')}"`,
      `"${(s.provisionalLicenseNumber || "").replace(/"/g, '""')}"`,
      `"${(s.notes || "").replace(/"/g, '""')}"`,
      `"${s.createdAt}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nextdrive_students_${Date.now()}.csv"`,
      },
    });
  }

  if (type === "leads" || type === "enquiries") {
    const inquiries = await db.getInquiries();
    const headers = [
      "Lead ID",
      "Name",
      "Email",
      "Phone",
      "Postcode",
      "Transmission",
      "Course / Target Package",
      "Area",
      "Provisional Licence",
      "Status",
      "Assigned Instructor",
      "How Found",
      "Student Message",
      "Internal Notes",
      "Created At",
    ];

    const rows = inquiries.map((i) => [
      `"${i.id}"`,
      `"${(i.name || "").replace(/"/g, '""')}"`,
      `"${(i.email || "").replace(/"/g, '""')}"`,
      `"${(i.phone || "").replace(/"/g, '""')}"`,
      `"${i.postcode}"`,
      `"${i.transmission || "MANUAL"}"`,
      `"${(i.targetPackage || i.course || "").replace(/"/g, '""')}"`,
      `"${(i.area || "").replace(/"/g, '""')}"`,
      `"${i.provisionalLicence || ""}"`,
      `"${i.status}"`,
      `"${(i.assignedInstructorName || "").replace(/"/g, '""')}"`,
      `"${(i.howFound || "").replace(/"/g, '""')}"`,
      `"${(i.notes || i.message || "").replace(/"/g, '""')}"`,
      `"${(i.internalNotes || "").replace(/"/g, '""')}"`,
      `"${i.createdAt}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nextdrive_leads_${Date.now()}.csv"`,
      },
    });
  }

  if (type === "bookings") {
    const bookings = await db.getBookings();
    const headers = [
      "Booking ID",
      "Student Name",
      "Student Email",
      "Student Phone",
      "Instructor Name",
      "Lesson Title",
      "Transmission",
      "Date & Time",
      "Duration (Hours)",
      "Price (£)",
      "Pickup Location",
      "Status",
      "Notes",
    ];

    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${(b.studentName || "").replace(/"/g, '""')}"`,
      `"${(b.studentEmail || "").replace(/"/g, '""')}"`,
      `"${(b.studentPhone || "").replace(/"/g, '""')}"`,
      `"${(b.instructorName || "").replace(/"/g, '""')}"`,
      `"${(b.lessonTitle || "").replace(/"/g, '""')}"`,
      `"${b.transmission}"`,
      `"${(b.dateTime || "").replace(/"/g, '""')}"`,
      b.durationHours,
      b.price,
      `"${(b.pickupLocation || "").replace(/"/g, '""')}"`,
      `"${b.status}"`,
      `"${(b.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="nextdrive_bookings_${Date.now()}.csv"`,
      },
    });
  }

  // Instructors export
  const instructors = await db.getInstructors();
  const headers = [
    "Instructor ID",
    "Name",
    "Badge Number",
    "Email",
    "Phone",
    "Transmission",
    "Rating",
    "Total Passes",
    "Active Students",
    "Status",
    "Vehicle",
    "Grade",
  ];

  const rows = instructors.map((i) => [
    `"${i.id}"`,
    `"${(i.name || "").replace(/"/g, '""')}"`,
    `"${i.badgeNumber}"`,
    `"${i.email}"`,
    `"${i.phone}"`,
    `"${i.transmission}"`,
    i.rating,
    i.totalPasses,
    i.activeStudents,
    `"${i.status}"`,
    `"${(i.vehicle || "").replace(/"/g, '""')}"`,
    `"${i.grade || ""}"`,
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="nextdrive_instructors_${Date.now()}.csv"`,
    },
  });
}
