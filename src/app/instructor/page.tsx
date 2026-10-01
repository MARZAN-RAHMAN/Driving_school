import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorDashboardView } from "@/components/instructor/InstructorDashboardView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Instructor Dashboard | NextDrive Driving Academy",
  description: "Manage your assigned driving students, daily lesson schedules, and tuition calendar.",
};

export default async function InstructorDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor");
  }

  const { user } = session;

  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student?error=unauthorized_instructor_access");
  }

  // Find instructor record matching email
  let instructor = await db.getInstructorByEmail(user.email);
  if (!instructor) {
    const all = await db.getInstructors();
    instructor = all.find((i) => i.id === "inst_01") || all[0];
  }

  const summary = await db.getInstructorSummary(instructor.id);

  if (!summary) {
    return (
      <div className="p-8 text-center text-slate-500">
        Instructor record not found. Please contact administration.
      </div>
    );
  }

  return (
    <InstructorDashboardView
      user={user}
      instructor={instructor}
      summary={summary}
    />
  );
}
