import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { StudentBookingsClient } from "@/components/student/StudentBookingsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Bookings | NextDrive Student Portal",
  description: "View and manage your scheduled driving lessons.",
};

export default async function StudentBookingsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student/bookings");
  }

  const { user } = session;

  const [allBookings, instructors, packages] = await Promise.all([
    db.getBookings(),
    db.getInstructors(),
    db.getLessonPackages(),
  ]);

  const studentBookings = allBookings.filter(
    (b) => b.studentEmail.toLowerCase() === user.email.toLowerCase()
  );

  const defaultInstructor = instructors.find((i) => i.id === "inst_01") || instructors[0];

  return (
    <StudentBookingsClient
      initialBookings={studentBookings}
      instructor={defaultInstructor}
      instructors={instructors}
      packages={packages}
    />
  );
}
