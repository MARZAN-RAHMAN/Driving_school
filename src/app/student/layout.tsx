import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentLayoutClient } from "@/components/student/StudentLayoutClient";
import { Student } from "@/types";

export const metadata = {
  title: "Student Portal | NextDrive Driving Academy",
  description: "Personal learner portal for lesson schedules, progress tracking and instructor communication.",
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student");
  }

  const { user } = session;

  // Server-side RBAC check: Student or Admin can access /student
  if (user.role !== "STUDENT" && user.role !== "ADMIN") {
    redirect("/instructor?error=unauthorized_student_access");
  }

  // Fetch student record matching user email
  const allStudents = await db.getStudents();
  let studentRecord = allStudents.find(
    (s) => s.email.toLowerCase() === user.email.toLowerCase()
  );

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

  return (
    <StudentLayoutClient user={user} student={studentRecord}>
      {children}
    </StudentLayoutClient>
  );
}
