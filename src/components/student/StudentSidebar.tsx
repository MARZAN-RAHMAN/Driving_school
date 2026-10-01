"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  UserCheck,
  Award,
  User,
  Bell,
  X,
  GraduationCap,
} from "lucide-react";
import { Student } from "@/types";

interface StudentSidebarProps {
  student: Student;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function StudentSidebar({
  student,
  mobileOpen,
  onCloseMobile,
}: StudentSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/student",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Bookings",
      href: "/student/bookings",
      icon: CalendarCheck,
    },
    {
      label: "My Lessons & Notes",
      href: "/student/lessons",
      icon: BookOpen,
    },
    {
      label: "My Instructor",
      href: "/student/instructor",
      icon: UserCheck,
    },
    {
      label: "Syllabus Progress",
      href: "/student/progress",
      icon: Award,
    },
    {
      label: "Notifications",
      href: "/student/notifications",
      icon: Bell,
    },
    {
      label: "My Profile",
      href: "/student/profile",
      icon: User,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-card-foreground border-r border-border p-4 transition-colors">
      <div className="space-y-6">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Learner Menu</p>
              <p className="text-[10px] text-muted-foreground">{student.id}</p>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Student Mini Card */}
        <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-xs shadow-xs">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">
                {student.name}
              </p>
              <p className="text-[11px] font-semibold text-accent">
                {student.hoursCompleted} hrs completed
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-accent/20 pt-2 text-[10px] text-muted-foreground">
            <span>Theory: <strong>{student.theoryStatus}</strong></span>
            <span>Status: <strong>{student.status.replace("_", " ")}</strong></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Learner Portal
          </p>
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t border-border pt-4 text-center text-[10px] text-muted-foreground">
        <p className="font-semibold text-foreground">NextDrive Academy</p>
        <p>DVSA Official Syllabus</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
