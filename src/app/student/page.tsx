import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentDashboardView } from "@/components/student/StudentDashboardView";
import { Student } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Dashboard | NextDrive Student Portal",
  description: "View your driving lesson schedules, test readiness, syllabus progress and instructor details.",
};

export default async function StudentDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student");
  }

  const { user } = session;

  // 1. Fetch student record matching authenticated user email
  const allStudents = await db.getStudents();
  let studentRecord = allStudents.find(
    (s) => s.email.toLowerCase() === user.email.toLowerCase()
  );

  // Fallback for demo student account
  if (!studentRecord) {
    studentRecord = {
      id: user.id || "std_demo",
      name: user.name,
      email: user.email,
      phone: "+44 7911 345678",
      postcode: "BR7",
      theoryStatus: "PASSED",
      hoursCompleted: 22,
      assignedInstructorId: "inst_01",
      assignedInstructorName: "Dave Miller",
      status: "TEST_READY",
      testDate: "Booked: Oct 8, 2026",
      provisionalLicenseNumber: "THORN709214MT88",
      createdAt: user.createdAt || "2026-08-01T09:15:00Z",
    };
  }

  // 2. Fetch bookings strictly for this authenticated student
  const allBookings = await db.getBookings();
  const studentBookings = allBookings.filter(
    (b) => b.studentEmail.toLowerCase() === user.email.toLowerCase()
  );

  // 3. Fetch instructors and packages for booking requests
  const [instructors, packages] = await Promise.all([
    db.getInstructors(),
    db.getLessonPackages(),
  ]);

  const assignedInstructor = instructors.find(
    (i) => i.id === studentRecord?.assignedInstructorId || i.name === studentRecord?.assignedInstructorName
  ) || instructors[0];

  return (
    <StudentDashboardView
      user={user}
      student={studentRecord}
      initialBookings={studentBookings}
      instructor={assignedInstructor}
      instructors={instructors}
      packages={packages}
    />
  );
}
