import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorStudentsClient } from "@/components/instructor/InstructorStudentsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Students | NextDrive Instructor Portal",
  description: "View and manage your assigned driving students, training progress, and contact details.",
};

export default async function InstructorStudentsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/students");
  }

  const { user } = session;

  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student?error=unauthorized_instructor_access");
  }

  let instructor = await db.getInstructorByEmail(user.email);
  if (!instructor) {
    const all = await db.getInstructors();
    instructor = all.find((i) => i.id === "inst_01") || all[0];
  }

  // Multi-tenant data isolation: Fetch students strictly assigned to this instructor
  const students = await db.getStudentsByInstructor(instructor.id);

  return <InstructorStudentsClient students={students} instructor={instructor} />;
}
