"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  Car,
  MapPin,
  Sparkles,
  Star,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  Users,
  ShieldCheck,
  History,
  LogOut,
  Layers,
  Settings,
  UserPlus,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  X,
} from "lucide-react";
import { User, UserRole } from "@/types";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminSidebarProps {
  userRole?: UserRole;
  user?: User;
}

interface NavItem {
  name: string;
  href: string;
  aliases?: string[];
  icon: React.ElementType;
  badge?: string | null;
  adminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        aliases: ["/admin/dashboard"],
        icon: LayoutDashboard,
        badge: "Live",
      },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      {
        name: "Students",
        href: "/admin/customers",
        aliases: ["/admin/students"],
        icon: Users,
      },
      {
        name: "Instructors",
        href: "/admin/instructors",
        icon: Car,
        badge: "5",
      },
      {
        name: "Leads",
        href: "/admin/enquiries",
        aliases: ["/admin/leads"],
        icon: UserPlus,
        badge: "New",
      },
      {
        name: "Bookings",
        href: "/admin/bookings",
        icon: CalendarCheck,
        badge: "7",
      },
      {
        name: "Lessons",
        href: "/admin/lessons",
        icon: BookOpen,
        badge: "5",
      },
    ],
  },
  {
    title: "CONTENT",
    items: [
      {
        name: "Locations",
        href: "/admin/locations",
        icon: MapPin,
        badge: "4",
      },
      {
        name: "Homepage CMS",
        href: "/admin/cms",
        icon: Sparkles,
      },
      {
        name: "Content",
        href: "/admin/content",
        icon: Layers,
        badge: "4",
      },
      {
        name: "Reviews",
        href: "/admin/reviews",
        icon: Star,
        badge: "New",
      },
      {
        name: "FAQs",
        href: "/admin/faqs",
        icon: HelpCircle,
      },
      {
        name: "Blog",
        href: "/admin/blog",
        icon: FileText,
      },
      {
        name: "Media",
        href: "/admin/media",
        icon: ImageIcon,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
        adminOnly: true,
      },
      {
        name: "Team & RBAC",
        href: "/admin/users",
        icon: ShieldCheck,
        badge: "5",
        adminOnly: true,
      },
      {
        name: "Audit Logs",
        href: "/admin/logs",
        icon: History,
        adminOnly: true,
      },
    ],
  },
];

export function AdminSidebar({ userRole = "ADMIN", user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleCollapse, isMobileOpen, toggleMobile } = useAdminSidebar();

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
    : "AD";

  // Route-aware active match: handles exact matches, aliases, and nested routes
  const isItemActive = (href: string, aliases: string[] = []) => {
    if (href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/dashboard";
    }
    if (pathname.startsWith(href)) {
      return true;
    }
    return aliases.some((alias) => pathname.startsWith(alias));
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR (lg:flex) */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-card transition-[width] duration-300 ease-in-out text-card-foreground shadow-2xs lg:flex ${
          isCollapsed ? "w-[72px]" : "w-64"
        }`}
        aria-label="Admin Navigation"
      >
        {/* Brand header / Toggle */}
        <div
          className={`flex h-16 items-center border-b border-border transition-colors duration-200 ${
            isCollapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
        >
          {isCollapsed ? (
            <button
              onClick={toggleCollapse}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition cursor-pointer"
              title="Expand sidebar (Ctrl+B)"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-5 w-5" />
            </button>
          ) : (
            <>
              <Link href="/admin" className="flex items-center gap-2.5 truncate">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-foreground tracking-tight block text-sm">
                    NextDrive
                  </span>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary truncate">
                    Operations Center
                  </span>
                </div>
              </Link>
              <button
                onClick={toggleCollapse}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                title="Collapse sidebar (Ctrl+B)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5 scrollbar-thin">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) => {
              if (item.adminOnly && userRole !== "ADMIN") return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title}>
                {/* Section title (expanded) or subtle divider (collapsed) */}
                {isCollapsed ? (
                  <div className="my-2 mx-auto w-6 h-px bg-border/60" aria-hidden="true" />
                ) : (
                  <div className="mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    {section.title}
                  </div>
                )}

                <nav className="space-y-1">
                  {visibleItems.map((item) => {
                    const active = isItemActive(item.href, item.aliases);
                    const Icon = item.icon;

                    if (isCollapsed) {
                      // Collapsed Icon View with Floating Tooltip
                      return (
                        <div key={item.name} className="relative group flex justify-center">
                          <Link
                            href={item.href}
                            className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary ${
                              active
                                ? "bg-primary/15 text-primary shadow-xs font-semibold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                            aria-label={item.name}
                          >
                            {/* Subtle left active bar indicator */}
                            {active && (
                              <span
                                className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                                aria-hidden="true"
                              />
                            )}
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-colors ${
                                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            />
                            {/* Badge dot indicator if badge exists */}
                            {item.badge && (
                              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-2 ring-card" />
                            )}
                          </Link>

                          {/* Accessible Floating Hover Tooltip */}
                          <div className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50 flex items-center opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150">
                            <div className="whitespace-nowrap rounded-lg bg-popover text-popover-foreground px-2.5 py-1 text-xs font-semibold shadow-xl border border-border flex items-center gap-1.5">
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className="rounded-full bg-primary/20 text-primary px-1.5 py-0.2 text-[9px] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Expanded List View
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary ${
                          active
                            ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                            : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        {/* Active left indicator */}
                        {active && (
                          <span
                            className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                            aria-hidden="true"
                          />
                        )}
                        <div className="flex items-center gap-2.5 truncate">
                          <Icon
                            className={`h-4 w-4 shrink-0 transition-colors ${
                              active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold shrink-0 ${
                              active
                                ? "bg-primary/20 text-primary"
                                : "bg-muted text-muted-foreground"
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
            );
          })}
        </div>

        {/* Footer User Profile & System Exit */}
        <div className="border-t border-border p-2.5 space-y-2">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm cursor-default"
                title={`${user?.name || "Admin"} (${userRole})`}
              >
                {userInitials}
              </div>
              <button
                onClick={handleLogout}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-error/10 hover:text-error transition cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 px-2 py-1">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground shadow-sm shrink-0">
                  {userInitials}
                </div>
                <div className="truncate">
                  <div className="truncate text-xs font-semibold text-foreground">
                    {user?.name || "Admin User"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary uppercase">
                      {userRole}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {user?.email || "admin@nextdrive.uk"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 pt-1 border-t border-border">
                <Link
                  href="/"
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  Public Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-error transition hover:bg-error/10 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Exit
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MOBILE NAVIGATION DRAWER (lg:hidden) */}
      {/* ========================================================================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => toggleMobile(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-card border-r border-border pb-4 pt-4 shadow-2xl text-card-foreground transition-all duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-foreground text-sm">NextDrive</span>
                  <span className="block text-[9px] font-semibold text-primary uppercase">
                    Admin Center
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => toggleMobile(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Navigation items */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
              {navSections.map((section) => {
                const visibleItems = section.items.filter((item) => {
                  if (item.adminOnly && userRole !== "ADMIN") return false;
                  return true;
                });

                if (visibleItems.length === 0) return null;

                return (
                  <div key={section.title}>
                    <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                      {section.title}
                    </div>
                    <nav className="space-y-0.5">
                      {visibleItems.map((item) => {
                        const active = isItemActive(item.href, item.aliases);
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => toggleMobile(false)}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                              active
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Icon
                                className={`h-4 w-4 shrink-0 ${
                                  active ? "text-primary" : "text-muted-foreground"
                                }`}
                              />
                              <span className="truncate">{item.name}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                                  active
                                    ? "bg-primary/20 text-primary"
                                    : "bg-muted text-muted-foreground"
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
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-border px-4 pt-3 space-y-2">
              <Link
                href="/"
                target="_blank"
                onClick={() => toggleMobile(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                View Public Site
              </Link>
              <button
                type="button"
                onClick={() => {
                  toggleMobile(false);
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

export default AdminSidebar;
