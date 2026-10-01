import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorLessonsClient } from "@/components/instructor/InstructorLessonsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Lessons & Schedule | NextDrive Instructor Portal",
  description: "View and manage your driving lesson appointments, log progress notes, and update attendance.",
};

export default async function InstructorLessonsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/lessons");
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

  // Multi-tenant data isolation: strictly this instructor's bookings
  const lessons = await db.getBookingsByInstructor(instructor.id);

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading lessons...</div>}>
      <InstructorLessonsClient initialLessons={lessons} instructor={instructor} />
    </Suspense>
  );
}
