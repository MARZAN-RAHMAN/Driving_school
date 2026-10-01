import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentProfileClient } from "@/components/student/StudentProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Profile | NextDrive Student Portal",
  description: "View and update your student contact details and licence number.",
};

export default async function StudentProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student/profile");
  }

  const { user } = session;

  const allStudents = await db.getStudents();
  let student = allStudents.find(
    (s) => s.email.toLowerCase() === user.email.toLowerCase()
  );

  if (!student) {
    student = {
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

  return <StudentProfileClient student={student} />;
}
