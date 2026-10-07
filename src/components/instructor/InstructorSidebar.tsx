"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Calendar,
  Clock,
  MessageSquare,
  Bell,
  UserCheck,
  Award,
  Car,
  X,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { Instructor } from "@/types";
import { InstructorImage } from "@/components/instructor/InstructorImage";

interface InstructorSidebarProps {
  instructor: Instructor;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function InstructorSidebar({
  instructor,
  mobileOpen,
  onCloseMobile,
}: InstructorSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/instructor",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "My Students",
      href: "/instructor/students",
      icon: Users,
      badge: instructor.activeStudents ? `${instructor.activeStudents}` : undefined,
    },
    {
      label: "My Lessons",
      href: "/instructor/lessons",
      icon: CalendarCheck,
    },
    {
      label: "Calendar",
      href: "/instructor/calendar",
      icon: Calendar,
    },
    {
      label: "Availability",
      href: "/instructor/availability",
      icon: Clock,
    },
    {
      label: "Messages",
      href: "/instructor/messages",
      icon: MessageSquare,
    },
    {
      label: "Notifications",
      href: "/instructor/notifications",
      icon: Bell,
    },
    {
      label: "Profile & Credentials",
      href: "/instructor/profile",
      icon: UserCheck,
    },
    {
      label: "Account Settings",
      href: "/instructor/settings",
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-card text-card-foreground border-r border-border p-4 transition-colors">
      <div className="space-y-6">
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between lg:hidden border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              <Car className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Instructor Menu</p>
              <p className="text-[10px] text-muted-foreground">{instructor.badgeNumber}</p>
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

        {/* Instructor Summary Card in Sidebar */}
        <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-3.5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <InstructorImage
                instructor={instructor}
                aspectRatio="1/1"
                fallbackSize="sm"
                className="h-10 w-10 rounded-full border border-secondary/40 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success ring-2 ring-card" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-foreground">
                {instructor.name}
              </p>
              <p className="flex items-center gap-1 text-[11px] font-medium text-secondary">
                <ShieldCheck className="h-3 w-3" />
                {instructor.badgeNumber}
              </p>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between border-t border-secondary/20 pt-2 text-[10px] text-muted-foreground">
            <span className="font-semibold text-secondary">
              {instructor.grade || "DVSA Grade A"}
            </span>
            <span className="truncate max-w-[120px] text-right font-medium">
              {instructor.vehicle.split("(")[0]}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Instructor Portal
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
                className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold overflow-hidden border nav-item-3d ${
                  isActive
                    ? "nav-item-3d-active bg-primary text-primary-foreground border-primary/60 shadow-md"
                    : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-card hover:text-foreground"
                }`}
              >
                {/* 3D Specular Sheen Beam on Hover */}
                <span
                  className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                  aria-hidden="true"
                />

                <div className="flex items-center gap-2.5 pl-0.5">
                  <div className="relative shrink-0 transition-transform duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]">
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? "text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" : "text-muted-foreground group-hover:text-primary"
                      }`}
                    />
                  </div>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="space-y-2 border-t border-border pt-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-2">
          <span>ADI Status:</span>
          <span className="inline-flex items-center gap-1 font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Active / On Duty
          </span>
        </div>
        <div className="rounded-lg bg-surface-secondary p-2 text-center text-[10px] text-muted-foreground">
          <p className="font-semibold text-foreground">NextDrive Academy</p>
          <p>Manchester Fleet Operations</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
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
