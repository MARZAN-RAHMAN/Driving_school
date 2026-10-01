import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorCalendarClient } from "@/components/instructor/InstructorCalendarClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tuition Calendar | NextDrive Instructor Portal",
  description: "View your driving lesson calendar and weekly timetable.",
};

export default async function InstructorCalendarPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/calendar");
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

  const lessons = await db.getBookingsByInstructor(instructor.id);

  return <InstructorCalendarClient lessons={lessons} instructor={instructor} />;
}
