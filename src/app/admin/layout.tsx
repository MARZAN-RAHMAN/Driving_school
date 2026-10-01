import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Control Center | NextDrive Driving Academy",
  description: "Enterprise administration dashboard for NextDrive system management and fleet dispatch.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If accessed directly without an authorized session, redirect to login
  if (!session) {
    redirect("/login?callbackUrl=/admin");
  }

  // If authenticated as a STUDENT, deny access and redirect to their student dashboard
  if (session.user.role !== "ADMIN" && session.user.role !== "EDITOR") {
    redirect("/student?error=unauthorized_admin_access");
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sidebar navigation */}
      <AdminSidebar userRole={session.user.role} user={session.user} />

      {/* Main content column */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <AdminHeader user={session.user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
