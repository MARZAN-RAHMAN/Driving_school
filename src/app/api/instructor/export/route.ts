import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { user } = session;
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "students";

  let instructor = await db.getInstructorByEmail(user.email);
  if (!instructor) {
    const all = await db.getInstructors();
    instructor = all.find((i) => i.id === "inst_01") || all[0];
  }

  if (type === "lessons") {
    const lessons = await db.getBookingsByInstructor(instructor.id);
    const headers = [
      "Lesson ID",
      "Student Name",
      "Student Email",
      "Student Phone",
      "Lesson Title",
      "Transmission",
      "Date & Time",
      "Duration (Hours)",
      "Price (£)",
      "Pickup Location",
      "Status",
      "Instructor Notes",
      "Progress Notes",
    ];

    const rows = lessons.map((l) => [
      `"${l.id}"`,
      `"${(l.studentName || "").replace(/"/g, '""')}"`,
      `"${(l.studentEmail || "").replace(/"/g, '""')}"`,
      `"${(l.studentPhone || "").replace(/"/g, '""')}"`,
      `"${(l.lessonTitle || "").replace(/"/g, '""')}"`,
      `"${l.transmission}"`,
      `"${(l.dateTime || "").replace(/"/g, '""')}"`,
      l.durationHours,
      l.price,
      `"${(l.pickupLocation || "").replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${(l.instructorNotes || "").replace(/"/g, '""')}"`,
      `"${(l.progressNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="instructor_lessons_${Date.now()}.csv"`,
      },
    });
  }

  // Default: type === "students"
  const students = await db.getStudentsByInstructor(instructor.id);
  const headers = [
    "Student ID",
    "Name",
    "Email",
    "Phone",
    "Postcode",
    "Hours Completed",
    "Theory Status",
    "Account Status",
    "Test Date",
    "Provisional Licence",
    "Internal Notes",
    "Registration Date",
  ];

  const rows = students.map((s) => [
    `"${s.id}"`,
    `"${(s.name || "").replace(/"/g, '""')}"`,
    `"${(s.email || "").replace(/"/g, '""')}"`,
    `"${(s.phone || "").replace(/"/g, '""')}"`,
    `"${s.postcode}"`,
    s.hoursCompleted,
    `"${s.theoryStatus}"`,
    `"${s.status}"`,
    `"${(s.testDate || "").replace(/"/g, '""')}"`,
    `"${(s.provisionalLicenseNumber || "").replace(/"/g, '""')}"`,
    `"${(s.notes || "").replace(/"/g, '""')}"`,
    `"${s.createdAt}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="assigned_students_${Date.now()}.csv"`,
    },
  });
}
