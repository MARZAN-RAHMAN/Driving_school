import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminProfileClient } from "@/components/admin/AdminProfileClient";

export const metadata = {
  title: "Admin Profile & Security | NextDrive Operations",
  description: "Manage your administrator account credentials, profile photo, contact details, and security preferences.",
};

export default async function AdminProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?callbackUrl=/admin/profile");
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    redirect("/student?error=unauthorized_admin_profile");
  }

  const user = (await db.getUserById(session.user.id)) || session.user;

  return <AdminProfileClient user={user} />;
}
