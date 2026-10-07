"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/ui/UserAvatar";
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
  Megaphone,
  PanelBottom,
  Search,
  UserRound,
  MessageSquare,
} from "lucide-react";
import { User, UserRole } from "@/types";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NextDriveLogo } from "@/components/ui/NextDriveLogo";

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
        name: "Enquiries",
        href: "/admin/enquiries",
        aliases: ["/admin/leads"],
        icon: MessageSquare,
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
    title: "MARKETING",
    items: [
      {
        name: "Popup Manager",
        href: "/admin/popup",
        icon: Megaphone,
        badge: "Active",
      },
      {
        name: "Footer Manager",
        href: "/admin/footer",
        aliases: ["/admin/footer-manager"],
        icon: PanelBottom,
        badge: "Live",
      },
      {
        name: "SEO Manager",
        href: "/admin/seo",
        icon: Search,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "My Profile",
        href: "/admin/profile",
        icon: UserRound,
      },
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

  const [currentUser, setCurrentUser] = useState<User | undefined>(user);

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  // Fetch real authenticated user from /api/auth/me on mount to ensure fresh profile data & avatar
  useEffect(() => {
    let active = true;
    const fetchFreshUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok && active) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch {
        // Silently preserve initial user
      }
    };

    fetchFreshUser();

    // Listen to local user update events (e.g. after photo crop or profile save)
    const handleUserUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<User>>;
      if (customEvent.detail) {
        setCurrentUser((prev) => {
          if (!prev) return prev;
          return { ...prev, ...customEvent.detail };
        });
      }
    };

    window.addEventListener("nextdrive:user-updated", handleUserUpdate);

    return () => {
      active = false;
      window.removeEventListener("nextdrive:user-updated", handleUserUpdate);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const userInitials = (currentUser?.name || user?.name)
    ? (currentUser?.name || user?.name || "")
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
                <NextDriveLogo size={36} className="shrink-0" />
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
                      // Collapsed Icon View with 3D button and Floating Tooltip
                      return (
                        <div key={item.name} className="relative group flex justify-center">
                          <Link
                            href={item.href}
                            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border overflow-hidden nav-item-3d focus-visible:outline-2 focus-visible:outline-primary ${
                              active
                                ? "nav-item-3d-active bg-gradient-to-br from-primary/20 to-primary/10 border-primary/50 text-primary font-semibold"
                                : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-card hover:text-foreground"
                            }`}
                            aria-label={item.name}
                          >
                            {/* Specular sheen on hover */}
                            <span
                              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                              aria-hidden="true"
                            />

                            {/* Active left 3D capsule */}
                            {active && (
                              <span
                                className="absolute left-0.5 top-2 bottom-2 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 to-primary shadow-[0_0_8px_rgba(34,211,238,0.85)]"
                                aria-hidden="true"
                              />
                            )}

                            <Icon
                              className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg] ${
                                active
                                  ? "text-primary drop-shadow-[0_2px_4px_rgba(99,102,241,0.4)]"
                                  : "text-muted-foreground group-hover:text-primary"
                              }`}
                            />

                            {/* Badge dot */}
                            {item.badge && (
                              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 ring-2 ring-card shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                            )}
                          </Link>

                          {/* Accessible Floating Hover Tooltip with 3D Depth */}
                          <div className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50 flex items-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                            <div className="whitespace-nowrap rounded-xl bg-card text-card-foreground px-3 py-1.5 text-xs font-semibold shadow-xl border border-border flex items-center gap-2">
                              <span>{item.name}</span>
                              {item.badge && (
                                <span className="rounded-full bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.2 text-[9px] font-bold">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    // Expanded List View with 3D Elevation, Specular Light Sweep & Animated Road Capsule
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2.5 text-xs font-medium overflow-hidden border nav-item-3d focus-visible:outline-2 focus-visible:outline-primary ${
                          active
                            ? "nav-item-3d-active bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-primary/40 text-primary font-semibold"
                            : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-card hover:text-foreground"
                        }`}
                      >
                        {/* 3D Specular Sheen Beam on Hover */}
                        <span
                          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                          aria-hidden="true"
                        />

                        {/* Top Beveled Highlight Edge for 3D tactile lift */}
                        <span
                          className={`pointer-events-none absolute inset-x-2 top-0 h-px transition-opacity duration-200 ${
                            active
                              ? "bg-white/40 dark:bg-white/20 opacity-100"
                              : "bg-white/30 dark:bg-white/10 opacity-0 group-hover:opacity-100"
                          }`}
                          aria-hidden="true"
                        />

                        {/* 3D Illuminated Road Indicator Capsule */}
                        {active ? (
                          <span
                            className="absolute left-1 top-2 bottom-2 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 via-primary to-indigo-600 shadow-[0_0_8px_rgba(34,211,238,0.85)] animate-pulse"
                            aria-hidden="true"
                          />
                        ) : (
                          <span
                            className="absolute left-1 top-2.5 bottom-2.5 w-1 rounded-full bg-primary/70 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shadow-[0_0_6px_rgba(99,102,241,0.6)]"
                            aria-hidden="true"
                          />
                        )}

                        <div className="flex items-center gap-2.5 truncate pl-1">
                          <div className="relative shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-115 group-hover:-translate-y-0.5 group-hover:rotate-[-5deg]">
                            <Icon
                              className={`h-4 w-4 shrink-0 transition-colors ${
                                active
                                  ? "text-primary drop-shadow-[0_2px_4px_rgba(99,102,241,0.4)]"
                                  : "text-muted-foreground group-hover:text-primary"
                              }`}
                            />
                          </div>
                          <span className="truncate tracking-tight">{item.name}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold shrink-0 transition-all duration-200 group-hover:scale-105 ${
                              active
                                ? "bg-primary/25 text-primary border border-primary/30 shadow-xs"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:border group-hover:border-primary/20"
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
              <Link
                href="/admin/profile"
                className="group relative flex items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-primary hover:opacity-90"
                title={`${currentUser?.name || "Admin"} (${userRole}) - View Profile`}
              >
                <UserAvatar
                  src={currentUser?.avatar}
                  name={currentUser?.name || "Admin User"}
                  size="sm"
                  showStatusDot
                  statusColor="bg-emerald-500"
                />
              </Link>
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
              <Link
                href="/admin/profile"
                className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-muted/60"
                title="View Admin Profile"
              >
                <UserAvatar
                  src={currentUser?.avatar}
                  name={currentUser?.name || "Admin User"}
                  size="sm"
                  showStatusDot
                  statusColor="bg-emerald-500"
                />
                <div className="truncate min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                    {currentUser?.name || "Admin User"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary uppercase">
                      {userRole}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {currentUser?.email || "admin@nextdrive.uk"}
                    </span>
                  </div>
                </div>
              </Link>

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
                <NextDriveLogo size={32} className="shrink-0" />
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
                            className={`group relative flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium overflow-hidden border nav-item-3d ${
                              active
                                ? "nav-item-3d-active bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border-primary/40 text-primary font-semibold"
                                : "border-transparent text-muted-foreground hover:border-border/80 hover:bg-card hover:text-foreground"
                            }`}
                          >
                            {/* Specular sheen */}
                            <span
                              className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                              aria-hidden="true"
                            />

                            {/* Active road indicator capsule */}
                            {active && (
                              <span
                                className="absolute left-1 top-2 bottom-2 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 via-primary to-indigo-600 shadow-[0_0_8px_rgba(34,211,238,0.85)]"
                                aria-hidden="true"
                              />
                            )}

                            <div className="flex items-center gap-2.5 truncate pl-1">
                              <div className="relative shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110">
                                <Icon
                                  className={`h-4 w-4 shrink-0 transition-colors ${
                                    active
                                      ? "text-primary drop-shadow-[0_2px_4px_rgba(99,102,241,0.4)]"
                                      : "text-muted-foreground group-hover:text-primary"
                                  }`}
                                />
                              </div>
                              <span className="truncate">{item.name}</span>
                            </div>

                            {item.badge && (
                              <span
                                className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                  active
                                    ? "bg-primary/25 text-primary border border-primary/30"
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
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-border px-4 pt-3 space-y-2">
              <Link
                href="/admin/profile"
                onClick={() => toggleMobile(false)}
                className="flex items-center gap-3 rounded-xl p-2 bg-surface-secondary/40 hover:bg-muted transition"
                title="View Admin Profile"
              >
                <UserAvatar
                  src={currentUser?.avatar}
                  name={currentUser?.name || "Admin User"}
                  size="sm"
                  showStatusDot
                  statusColor="bg-emerald-500"
                />
                <div className="min-w-0 flex-1 truncate">
                  <div className="truncate text-xs font-bold text-foreground">
                    {currentUser?.name || "Admin User"}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {currentUser?.email || "admin@nextdrive.uk"}
                  </div>
                </div>
              </Link>

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
