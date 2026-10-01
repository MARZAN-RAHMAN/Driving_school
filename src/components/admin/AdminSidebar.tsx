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
  GraduationCap,
  Sparkles,
  Star,
  HelpCircle,
  FileText,
  Image as ImageIcon,
  Building2,
  Users,
  ShieldAlert,
  ShieldCheck,
  ArrowLeft,
  LogOut,
  Layers,
  Mail,
} from "lucide-react";
import { User, UserRole } from "@/types";

interface AdminSidebarProps {
  userRole?: UserRole;
  user?: User;
}

interface NavItem {
  name: string;
  href: string;
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
    title: "Operations & Fleet",
    items: [
      {
        name: "Dashboard Overview",
        href: "/admin",
        icon: LayoutDashboard,
        badge: "Live",
      },
      {
        name: "Bookings & Dispatch",
        href: "/admin/bookings",
        icon: CalendarCheck,
        badge: "7",
      },
      {
        name: "Lessons & Pricing",
        href: "/admin/lessons",
        icon: BookOpen,
        badge: "5",
      },
      {
        name: "Instructors Fleet",
        href: "/admin/instructors",
        icon: Car,
        badge: "5",
      },
      {
        name: "Service Locations",
        href: "/admin/locations",
        icon: MapPin,
        badge: "4",
      },
      {
        name: "Learners & Students",
        href: "/admin/customers",
        icon: GraduationCap,
      },
      {
        name: "Contact Enquiries",
        href: "/admin/enquiries",
        icon: Mail,
        badge: "New",
      },
    ],
  },
  {
    title: "Marketing & CMS",
    items: [
      {
        name: "Homepage CMS",
        href: "/admin/cms",
        icon: Sparkles,
      },
      {
        name: "Content Items",
        href: "/admin/content",
        icon: FileText,
        badge: "4",
      },
      {
        name: "Reviews & Passes",
        href: "/admin/reviews",
        icon: Star,
        badge: "New",
      },
      {
        name: "FAQs & Guides",
        href: "/admin/faqs",
        icon: HelpCircle,
      },
      {
        name: "Blog & Highway Code",
        href: "/admin/blog",
        icon: FileText,
      },
      {
        name: "Media Library",
        href: "/admin/media",
        icon: ImageIcon,
      },
    ],
  },
  {
    title: "Platform & Governance",
    items: [
      {
        name: "Business Settings",
        href: "/admin/settings",
        icon: Building2,
        adminOnly: true,
      },
      {
        name: "Team & RBAC",
        href: "/admin/users",
        icon: Users,
        badge: "5",
        adminOnly: true,
      },
      {
        name: "Audit & Security Logs",
        href: "/admin/logs",
        icon: ShieldAlert,
        adminOnly: true,
      },
    ],
  },
];

export function AdminSidebar({ userRole = "ADMIN", user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card lg:flex transition-colors duration-200 text-card-foreground">
      {/* Brand header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="font-bold text-foreground tracking-tight">NextDrive</span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-primary">
              Operations Center
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {navSections.map((section) => {
          // Filter items based on user role
          const visibleItems = section.items.filter((item) => {
            if (item.adminOnly && userRole !== "ADMIN") {
              return false;
            }
            return true;
          });

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {visibleItems.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`h-4 w-4 shrink-0 transition ${
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold shrink-0 ${
                            isActive
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

        {/* Security telemetry status widget */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Dispatch System Active
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
            Edge RBAC, DVSA compliance checks &amp; tamper-evident audit logs online.
          </p>
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-primary">
            <span>Status: Operational</span>
            <span className="rounded bg-success/15 px-1 py-0.2 text-[9px] text-success font-bold">
              SLA 99.98%
            </span>
          </div>
        </div>
      </div>

      {/* User profile & exit */}
      <div className="border-t border-border p-3.5 space-y-2">
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
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
            Public Portal
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
      </div>
    </aside>
  );
}
