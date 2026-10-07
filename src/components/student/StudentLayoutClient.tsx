"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  GraduationCap,
  ExternalLink,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StudentSidebar } from "./StudentSidebar";
import { User, Student } from "@/types";
import { UserAccountMenu } from "@/components/navigation/UserAccountMenu";
import { NextDriveLogo } from "@/components/ui/NextDriveLogo";

interface StudentLayoutClientProps {
  user: User;
  student: Student;
  children: React.ReactNode;
}

export function StudentLayoutClient({
  user,
  student,
  children,
}: StudentLayoutClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Top Student Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6 lg:px-8 text-card-foreground">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
          {/* Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href="/student" className="flex items-center gap-2.5">
              <NextDriveLogo size={36} className="shrink-0" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                Next<span className="text-primary">Drive</span>
              </span>
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent ring-1 ring-inset ring-accent/20">
              <GraduationCap className="h-3.5 w-3.5 text-accent" />
              Student Portal
            </span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition"
            >
              Public Site
              <ExternalLink className="h-3 w-3" />
            </Link>

            <ThemeToggle />

            {/* Student Interactive Account Menu */}
            <div className="border-l border-border pl-2 sm:pl-2.5">
              <UserAccountMenu user={user} role="STUDENT" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Student Layout with Sidebar */}
      <div className="mx-auto flex max-w-7xl">
        <StudentSidebar
          student={student}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
