import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { InstructorLayoutClient } from "@/components/instructor/InstructorLayoutClient";

export const metadata = {
  title: "Instructor Portal | NextDrive Driving Academy",
  description: "Instructor fleet management portal for lesson scheduling, student progress tracking, and availability dispatch.",
};

export default async function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor");
  }

  const { user } = session;

  // Server-side RBAC verification: Only INSTRUCTOR and ADMIN can access /instructor
  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student?error=unauthorized_instructor_access");
  }

  // Find instructor record matching authenticated user email
  let instructor = await db.getInstructorByEmail(user.email);

  if (!instructor) {
    // Fallback to Dave Miller (inst_01) for admin preview or demo instructor account
    const allInstructors = await db.getInstructors();
    instructor = allInstructors.find((i) => i.id === "inst_01") || allInstructors[0];
  }

  // Pending instructors have not been approved yet; render child page directly without operational sidebar
  if (user.status === "PENDING") {
    return <>{children}</>;
  }

  return (
    <InstructorLayoutClient user={user} instructor={instructor}>
      {children}
    </InstructorLayoutClient>
  );
}
