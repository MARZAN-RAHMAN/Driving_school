import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export const metadata = {
  title: "Sign In | NextDrive Driving Academy",
  description: "Secure role-based authentication portal for NextDrive learners, instructors, and operations administrators.",
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, callbackUrl } = await searchParams;

  const session = await getSession();
  if (session && !error) {
    if (session.user.role === "ADMIN" || session.user.role === "EDITOR") {
      redirect("/admin");
    } else if (session.user.role === "INSTRUCTOR") {
      redirect("/instructor");
    } else {
      redirect("/student");
    }
  }

  return <LoginForm initialError={error} initialCallbackUrl={callbackUrl} />;
}
