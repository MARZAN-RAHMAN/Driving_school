"use client";

import React from "react";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { User } from "@/types";

interface AdminMainContentProps {
  user: User;
  children: React.ReactNode;
}

export function AdminMainContent({ user, children }: AdminMainContentProps) {
  const { isCollapsed } = useAdminSidebar();

  return (
    <div
      className={`flex min-h-screen flex-1 flex-col transition-[padding] duration-300 ease-in-out ${
        isCollapsed ? "lg:pl-[72px]" : "lg:pl-64"
      }`}
    >
      <AdminHeader user={user} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
