"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  ExternalLink,
  Plus,
  Menu,
  CalendarCheck,
  Award,
  Clock,
  PanelLeft,
  ChevronRight,
} from "lucide-react";
import { User } from "@/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAdminSidebar } from "@/context/AdminSidebarContext";

interface AdminHeaderProps {
  user?: User;
}

// Map pathnames to human-readable breadcrumb labels
const routeTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/dashboard": "Overview",
  "/admin/customers": "Students & Learners",
  "/admin/students": "Students & Learners",
  "/admin/instructors": "Instructors Fleet",
  "/admin/enquiries": "Leads & Enquiries",
  "/admin/leads": "Leads & Enquiries",
  "/admin/bookings": "Bookings & Dispatch",
  "/admin/lessons": "Lessons & Pricing",
  "/admin/locations": "Service Locations",
  "/admin/cms": "Homepage CMS",
  "/admin/content": "Content Items",
  "/admin/reviews": "Reviews & Passes",
  "/admin/faqs": "FAQs & Knowledge",
  "/admin/blog": "Blog & Highway Code",
  "/admin/media": "Media Library",
  "/admin/settings": "Business Settings",
  "/admin/users": "Team & RBAC",
  "/admin/logs": "Audit & Security Logs",
};

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const { toggleCollapse, isCollapsed, toggleMobile } = useAdminSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AV";

  // Derive current page title for breadcrumb
  const currentSection =
    routeTitles[pathname] ||
    Object.entries(routeTitles).find(([route]) => route !== "/admin" && pathname.startsWith(route))?.[1] ||
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8 transition-colors duration-200 text-card-foreground">
      {/* Left controls: Sidebar toggles & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button (opens drawer) */}
        <button
          type="button"
          onClick={() => toggleMobile(true)}
          className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
          aria-label="Open mobile navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar collapse toggle */}
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
          title={isCollapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs">
          <Link
            href="/admin"
            className="font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground/60" aria-hidden="true" />
              <span className="font-semibold text-foreground">{currentSection}</span>
            </>
          )}
        </nav>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xs mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records..."
            className="w-full rounded-xl border border-input-border bg-input py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action: New Booking */}
        <Link
          href="/admin/bookings"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-primary"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Booking</span>
        </Link>

        {/* Fleet Indicator */}
        <div className="hidden xl:inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success ring-1 ring-inset ring-success/20">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          Fleet Active (5 ADI)
        </div>

        {/* Public site link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition hover:text-primary"
        >
          Public Site
          <ExternalLink className="h-3 w-3" />
        </Link>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-4 shadow-xl z-50 text-card-foreground">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Dispatch Alerts &amp; Passes
                </span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  3 New
                </span>
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-start gap-2.5 text-xs">
                  <div className="rounded-lg bg-success/15 p-1.5 text-success shrink-0">
                    <Award className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Student Passed Practical Test!</p>
                    <p className="text-[11px] text-muted-foreground">Hannah Adams passed at Sidcup DTC (0 minors)</p>
                    <span className="text-[10px] text-muted-foreground font-mono">Yesterday 11:30</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <div className="rounded-lg bg-primary/10 p-1.5 text-primary shrink-0">
                    <CalendarCheck className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">New Intensive Booking</p>
                    <p className="text-[11px] text-muted-foreground">20-Hour Fast-Pass assigned to Liam O.</p>
                    <span className="text-[10px] text-muted-foreground font-mono">Today 08:15</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <div className="rounded-lg bg-warning/15 p-1.5 text-warning shrink-0">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Lesson in Progress</p>
                    <p className="text-[11px] text-muted-foreground">Jordan Rivera with Liam O. (Bromley High St)</p>
                    <span className="text-[10px] text-muted-foreground font-mono">Live now</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-border text-center">
                <Link
                  href="/admin/bookings"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-xs font-semibold text-primary hover:text-primary-hover hover:underline"
                >
                  View All Dispatch Bookings →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User profile chip */}
        <div className="flex items-center gap-2 border-l border-border pl-2.5 sm:pl-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm">
            {userInitials}
          </div>
          <div className="hidden text-left sm:block">
            <span className="block text-xs font-semibold text-foreground leading-tight">
              {user?.name || "Admin"}
            </span>
            <span className="block text-[10px] font-bold text-primary uppercase">
              {user?.role || "ADMIN"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
