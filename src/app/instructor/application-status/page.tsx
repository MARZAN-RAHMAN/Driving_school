import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ApplicationStatusClient } from "./ApplicationStatusClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Instructor Application Status | NextDrive Academy",
  description: "Check the status of your NextDrive driving instructor application.",
};

export default async function ApplicationStatusPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/application-status");
  }

  const { user } = session;

  // If approved and active, forward to main instructor dashboard
  if (user.role === "INSTRUCTOR" && user.status === "ACTIVE") {
    redirect("/instructor");
  }

  // Find instructor record matching user email
  const instructor = await db.getInstructorByEmail(user.email);

  return (
    <ApplicationStatusClient
      user={user}
      instructor={instructor}
    />
  );
}
