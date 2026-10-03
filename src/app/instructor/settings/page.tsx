import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ConnectedAccountsCard } from "@/components/shared/ConnectedAccountsCard";

export const metadata = {
  title: "Account Settings | NextDrive Instructor Portal",
  description: "Manage your connected Google, Apple, LinkedIn, and identity credentials.",
};

export default async function InstructorSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?callbackUrl=/instructor/settings");
  }

  if (session.user.role !== "INSTRUCTOR" && session.user.role !== "ADMIN") {
    redirect("/student");
  }

  if (session.user.status === "PENDING") {
    redirect("/instructor/application-status");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Instructor Account Settings
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your verified Google, Apple, and LinkedIn accounts for quick access to your fleet schedule.
        </p>
      </div>

      <ConnectedAccountsCard userRole="INSTRUCTOR" />
    </div>
  );
}
