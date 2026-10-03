import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ConnectedAccountsCard } from "@/components/shared/ConnectedAccountsCard";

export const metadata = {
  title: "Account Settings | NextDrive Student Portal",
  description: "Manage your connected social login providers and security preferences.",
};

export default async function StudentSettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?callbackUrl=/student/settings");
  }

  if (session.user.role !== "STUDENT" && session.user.role !== "ADMIN") {
    redirect("/instructor");
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Account &amp; Security Settings
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your connected Google, Apple, and social identities for seamless access.
        </p>
      </div>

      <ConnectedAccountsCard userRole="STUDENT" />
    </div>
  );
}
