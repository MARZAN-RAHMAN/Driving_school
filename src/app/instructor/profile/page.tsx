import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorProfileClient } from "@/components/instructor/InstructorProfileClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Instructor Profile | NextDrive Instructor Portal",
  description: "View and edit your instructor profile, telephone number and covered locations.",
};

export default async function InstructorProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/profile");
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

  return <InstructorProfileClient instructor={instructor} />;
}
