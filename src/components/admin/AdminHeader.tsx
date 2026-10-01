"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  ExternalLink,
  Plus,
  Menu,
  X,
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Car,
  MapPin,
  GraduationCap,
  Sparkles,
  Star,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  Building2,
  Users,
  ShieldAlert,
  LogOut,
  Layers,
  Award,
  Clock,
  Mail,
} from "lucide-react";
import { User } from "@/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminHeaderProps {
  user?: User;
}

const mobileNavSections = [
  {
    title: "Operations & Fleet",
    items: [
      { name: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Bookings & Dispatch", href: "/admin/bookings", icon: CalendarCheck },
      { name: "Lessons & Pricing", href: "/admin/lessons", icon: BookOpen },
      { name: "Instructors Fleet", href: "/admin/instructors", icon: Car },
      { name: "Service Locations", href: "/admin/locations", icon: MapPin },
      { name: "Learners & Students", href: "/admin/customers", icon: GraduationCap },
      { name: "Contact Enquiries", href: "/admin/enquiries", icon: Mail },
    ],
  },
  {
    title: "Marketing & CMS",
    items: [
      { name: "Homepage CMS", href: "/admin/cms", icon: Sparkles },
      { name: "Content Items", href: "/admin/content", icon: FileText },
      { name: "Reviews & Passes", href: "/admin/reviews", icon: Star },
      { name: "FAQs & Guides", href: "/admin/faqs", icon: HelpCircle },
      { name: "Blog & Highway Code", href: "/admin/blog", icon: FileText },
      { name: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "Platform & Settings",
    items: [
      { name: "Business Settings", href: "/admin/settings", icon: Building2 },
      { name: "Team & RBAC", href: "/admin/users", icon: Users },
      { name: "Audit & Security Logs", href: "/admin/logs", icon: ShieldAlert },
    ],
  },
];

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AV";

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur sm:px-6 lg:px-8 transition-colors duration-200 text-card-foreground">
        {/* Left: Mobile hamburger + Search Input */}
        <div className="flex flex-1 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Quick Search Bar */}
          <div className="relative w-full max-w-xs sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookings, students, instructors..."
              className="w-full rounded-lg border border-input-border bg-input py-1.5 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Action: New Booking */}
          <Link
            href="/admin/bookings"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Booking</span>
          </Link>

          {/* Environment / Fleet Indicator */}
          <div className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success ring-1 ring-inset ring-success/20">
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
              className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
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
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    3 New
                  </span>
                </div>
                <div className="mt-3 space-y-3">
                  <div className="flex items-start gap-2.5 text-xs">
                    <div className="rounded-md bg-success/15 p-1.5 text-success shrink-0">
                      <Award className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Student Passed Practical Test!</p>
                      <p className="text-[11px] text-muted-foreground">Hannah Adams passed at Sidcup DTC (0 minors)</p>
                      <span className="text-[10px] text-muted-foreground font-mono">Yesterday 11:30</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    <div className="rounded-md bg-primary/10 p-1.5 text-primary shrink-0">
                      <CalendarCheck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">New Intensive Booking</p>
                      <p className="text-[11px] text-muted-foreground">20-Hour Fast-Pass assigned to Liam O.</p>
                      <span className="text-[10px] text-muted-foreground font-mono">Today 08:15</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 text-xs">
                    <div className="rounded-md bg-warning/15 p-1.5 text-warning shrink-0">
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

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-r border-border pb-4 pt-5 shadow-2xl transition-colors duration-200 text-card-foreground">
            <div className="flex items-center justify-between px-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-foreground">NextDrive</span>
                  <span className="block text-[9px] font-semibold text-primary uppercase">
                    Admin Center
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
              {mobileNavSections.map((sec) => (
                <div key={sec.title}>
                  <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {sec.title}
                  </div>
                  <nav className="space-y-0.5">
                    {sec.items.map((item) => {
                      const isActive =
                        item.href === "/admin"
                          ? pathname === "/admin"
                          : pathname.startsWith(item.href);
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileNavOpen(false)}
                          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${
                              isActive ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            <div className="border-t border-border px-4 pt-3 space-y-2">
              <Link
                href="/"
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                View Public Site
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileNavOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-error hover:bg-error/10 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
