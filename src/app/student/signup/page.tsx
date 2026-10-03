import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { StudentSignupForm } from "./StudentSignupForm";

export const metadata = {
  title: "Student Sign Up | NextDrive Driving Academy",
  description: "Create your NextDrive student account and manage your driving lessons in one place.",
};

export default async function StudentSignupPage() {
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

  return <StudentSignupForm />;
}
