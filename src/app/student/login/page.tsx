import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { StudentLoginForm } from "./StudentLoginForm";

export const metadata = {
  title: "Student Sign In | NextDrive Driving Academy",
  description: "Sign in to track your driving lessons, test readiness, and syllabus progress.",
};

export default async function StudentLoginPage() {
  const session = await getSession();
  if (session) {
    if (session.user.role === "STUDENT") {
      redirect("/student");
    } else if (session.user.role === "INSTRUCTOR") {
      redirect("/instructor");
    } else {
      redirect("/admin");
    }
  }

  return <StudentLoginForm />;
}
