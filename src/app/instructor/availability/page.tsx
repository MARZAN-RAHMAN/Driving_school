import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorAvailabilityClient } from "@/components/instructor/InstructorAvailabilityClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tuition Availability | NextDrive Instructor Portal",
  description: "Configure working hours, teaching days and vacation blocks.",
};

export default async function InstructorAvailabilityPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/availability");
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

  return <InstructorAvailabilityClient instructor={instructor} />;
}
