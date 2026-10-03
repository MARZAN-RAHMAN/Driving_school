import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { InstructorSignupForm } from "./InstructorSignupForm";

export const metadata = {
  title: "Join NextDrive as an Instructor | NextDrive Driving Academy",
  description: "Apply to join NextDrive as a certified DVSA Approved Driving Instructor (ADI).",
};

export default async function InstructorSignupPage() {
  const session = await getSession();
  if (session) {
    if (session.user.role === "INSTRUCTOR") {
      if (session.user.status === "PENDING") {
        redirect("/instructor/application-status");
      }
      redirect("/instructor");
    } else if (session.user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/student");
    }
  }

  return <InstructorSignupForm />;
}
