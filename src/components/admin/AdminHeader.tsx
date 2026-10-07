"use client";

import React, { useState, useRef, useEffect, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};
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
  X,
  MessageSquare,
  CheckCheck,
  Check,
  Sparkles,
} from "lucide-react";
import { User } from "@/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useAdminSidebar } from "@/context/AdminSidebarContext";
import { UserAccountMenu } from "@/components/navigation/UserAccountMenu";

interface AdminHeaderProps {
  user?: User;
}

export interface AdminNotification {
  id: string;
  rawId: string;
  type: "query" | "booking" | "pass";
  title: string;
  description: string;
  sender?: string;
  phone?: string;
  email?: string;
  course?: string;
  postcode?: string;
  message?: string;
  timestamp: string;
  createdAt: string;
  status?: string;
  isNew: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "query-inq_03",
    rawId: "inq_03",
    type: "query",
    title: "New Enquiry: Ryan Taylor",
    description: "Introductory 2-Hour Assessment • Salford Quays & MediaCity • \"Looking to start automatic lessons next week in Salford Quays.\"",
    sender: "Ryan Taylor",
    phone: "+44 7700 900888",
    email: "ryan.taylor@student.nextdrive.uk",
    course: "Introductory 2-Hour Assessment",
    postcode: "M5 4WT",
    message: "Looking to start automatic lessons next week in Salford Quays.",
    timestamp: "Today 08:45",
    createdAt: "2026-09-30 08:45",
    status: "NEW",
    isNew: true,
    link: "/admin/enquiries?id=inq_03",
  },
  {
    id: "booking-bk-01",
    rawId: "bk-01",
    type: "booking",
    title: "Dispatch: Marcus Thorne",
    description: "2-Hour Practical Test Simulation with Dave Miller • West Didsbury DTC",
    timestamp: "Today 14:00",
    createdAt: "2026-09-30 14:00",
    status: "CONFIRMED",
    isNew: false,
    link: "/admin/bookings",
  },
  {
    id: "pass-std_01",
    rawId: "std_01",
    type: "pass",
    title: "Pass: Hannah Adams passed practical test!",
    description: "Passed at West Didsbury DTC (0 minors) • Practical Driving Test Verified",
    timestamp: "Yesterday",
    createdAt: "2026-09-29 11:30",
    status: "PASSED",
    isNew: false,
    link: "/admin/customers",
  },
];

function NotificationItem({
  item,
  isUnread,
  onItemClick,
  isMobile,
}: {
  item: AdminNotification;
  isUnread: boolean;
  onItemClick: (item: AdminNotification) => void;
  isMobile?: boolean;
}) {
  return (
    <Link
      href={item.link}
      onClick={() => onItemClick(item)}
      className={`group flex items-start ${
        isMobile ? "gap-3 p-3" : "gap-2.5 p-2.5"
      } rounded-xl text-xs transition border cursor-pointer ${
        isUnread
          ? "bg-primary/5 hover:bg-primary/10 border-primary/25 shadow-xs"
          : "hover:bg-muted/40 border-transparent"
      }`}
    >
      <div
        className={`rounded-lg ${isMobile ? "p-2" : "p-1.5"} shrink-0 ${
          item.type === "query"
            ? "bg-primary/15 text-primary"
            : item.type === "booking"
            ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400"
            : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        }`}
      >
        {item.type === "query" ? (
          <MessageSquare className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
        ) : item.type === "booking" ? (
          <CalendarCheck className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
        ) : (
          <Award className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <p
              className={`font-semibold text-foreground ${
                isMobile ? "text-sm" : "text-xs"
              } leading-snug truncate`}
            >
              {item.title}
            </p>
            {isUnread && (
              <span className="shrink-0 h-2 w-2 rounded-full bg-primary" title="New unread message" />
            )}
          </div>
          <span
            className={`shrink-0 ${
              isMobile ? "text-[11px]" : "text-[10px]"
            } text-muted-foreground font-mono`}
          >
            {item.timestamp}
          </span>
        </div>
        <p
          className={`mt-0.5 ${
            isMobile ? "text-xs" : "text-[11px]"
          } text-muted-foreground leading-relaxed line-clamp-2`}
        >
          {item.description}
        </p>

        {item.message && (
          <p className="mt-1 text-[11px] italic text-foreground/80 bg-muted/40 px-2 py-1 rounded-md border border-border/60">
            &ldquo;{item.message}&rdquo;
          </p>
        )}

        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-primary group-hover:underline">
            {item.type === "query" ? "View Enquiry Details →" : "View Details →"}
          </span>
          {item.status && (
            <span
              className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                item.isNew
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {item.status}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// Map pathnames to human-readable breadcrumb labels
const routeTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/dashboard": "Overview",
  "/admin/customers": "Students & Learners",
  "/admin/students": "Students & Learners",
  "/admin/instructors": "Instructors Fleet",
  "/admin/enquiries": "Enquiries",
  "/admin/leads": "Enquiries",
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
  "/admin/profile": "Admin Profile",
  "/admin/users": "Team & RBAC",
  "/admin/logs": "Audit & Security Logs",
};

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const { toggleCollapse, isCollapsed, toggleMobile, isMobileOpen } = useAdminSidebar();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [notifications, setNotifications] = useState<AdminNotification[]>(INITIAL_NOTIFICATIONS);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [hasLoadedReadState, setHasLoadedReadState] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [filterType, setFilterType] = useState<"ALL" | "QUERIES" | "DISPATCH">("ALL");

  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isNotificationsOpen = notificationsOpen && !isMobileOpen;

  const bellButtonRef = useRef<HTMLButtonElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // 1. Load persisted read notification IDs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nextdrive_admin_read_notifs");
      if (stored) {
        setReadIds(JSON.parse(stored));
      }
    } catch {}
    setHasLoadedReadState(true);
  }, []);

  // 2. Fetch live notifications from API
  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      }
    } catch {}
  };

  // 3. Setup polling, window focus, custom event, and cross-tab storage sync
  useEffect(() => {
    fetchNotifications();

    // Poll every 10 seconds for new queries / alerts
    const interval = setInterval(fetchNotifications, 10000);

    // Refocus listener
    const handleFocus = () => fetchNotifications();
    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", handleFocus);

    // Instant custom event listener when an enquiry is created in this browser
    const handleNewQueryEvent = () => fetchNotifications();
    window.addEventListener("nextdrive:new-query", handleNewQueryEvent);

    // Cross-tab storage synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "nextdrive_admin_read_notifs" && e.newValue) {
        try {
          setReadIds(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("nextdrive:new-query", handleNewQueryEvent);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Unread list: Any notification whose ID has not been marked as read in localStorage
  const unreadNotifications = useMemo(() => {
    if (!hasLoadedReadState) return [];
    return notifications.filter((n) => !readIds.includes(n.id));
  }, [notifications, readIds, hasLoadedReadState]);

  const hasUnread = unreadNotifications.length > 0;

  // Mark all current notifications as read
  const markAllAsRead = () => {
    const allIds = Array.from(new Set([...readIds, ...notifications.map((n) => n.id)]));
    setReadIds(allIds);
    try {
      localStorage.setItem("nextdrive_admin_read_notifs", JSON.stringify(allIds));
      localStorage.setItem("nextdrive_admin_notifs_viewed_at", new Date().toISOString());
    } catch {}
  };

  // Mark a single notification as read
  const markSingleAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem("nextdrive_admin_read_notifs", JSON.stringify(updated));
      } catch {}
    }
  };

  // Click outside & Escape key listeners
  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const clickedInsideDesktop =
        desktopDropdownRef.current && desktopDropdownRef.current.contains(target);
      const clickedInsideMobile =
        mobilePanelRef.current && mobilePanelRef.current.contains(target);
      const clickedBell =
        bellButtonRef.current && bellButtonRef.current.contains(target);

      if (!clickedInsideDesktop && !clickedInsideMobile && !clickedBell) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotificationsOpen(false);
        bellButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNotificationsOpen]);

  // Prevent background scroll on mobile while notifications popover is open
  useEffect(() => {
    if (isNotificationsOpen && typeof window !== "undefined" && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }
  }, [isNotificationsOpen]);

  // When opening the notification dropdown to view messages, mark all as read so the dot signal disappears!
  const handleToggleNotifications = () => {
    if (isMobileOpen) {
      toggleMobile(false);
    }
    if (accountMenuOpen) {
      setAccountMenuOpen(false);
    }
    const willOpen = !notificationsOpen;
    setNotificationsOpen(willOpen);

    if (willOpen && hasUnread) {
      markAllAsRead();
    }
  };

  const handleItemClick = (item: AdminNotification) => {
    markSingleAsRead(item.id);
    setNotificationsOpen(false);
  };

  // Helper to simulate a new query for immediate live testing
  const handleSimulateNewQuery = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSimulating(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "simulate-query" }),
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } finally {
      setIsSimulating(false);
    }
  };

  // Filtered notifications based on tab
  const filteredNotifications = useMemo(() => {
    if (filterType === "QUERIES") {
      return notifications.filter((n) => n.type === "query");
    }
    if (filterType === "DISPATCH") {
      return notifications.filter((n) => n.type !== "query");
    }
    return notifications;
  }, [notifications, filterType]);

  const queryCount = notifications.filter((n) => n.type === "query").length;
  const dispatchCount = notifications.filter((n) => n.type !== "query").length;

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
          onClick={() => {
            setNotificationsOpen(false);
            setAccountMenuOpen(false);
            toggleMobile(true);
          }}
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

        {/* Notifications Dropdown Button */}
        <div className="relative">
          <button
            ref={bellButtonRef}
            type="button"
            onClick={handleToggleNotifications}
            className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="View notifications"
            aria-expanded={isNotificationsOpen}
            aria-haspopup="true"
            aria-controls="admin-notifications-dropdown"
          >
            <Bell className="h-4 w-4" />
            {/* The Dot Signal: Displayed when new messages/queries exist; disappears when viewed */}
            {hasUnread && (
              <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-card shadow-xs" />
              </span>
            )}
          </button>

          {/* Desktop Notification Dropdown (Anchored to bell on sm+ screens) */}
          {isNotificationsOpen && (
            <div
              ref={desktopDropdownRef}
              id="admin-notifications-dropdown"
              role="region"
              aria-label="Dispatch Alerts and Student Enquiries"
              className="hidden sm:block absolute right-0 mt-2 w-80 sm:w-[410px] rounded-2xl border border-border bg-card p-4 shadow-xl z-50 text-card-foreground animate-in fade-in zoom-in-95 duration-100"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Alerts &amp; Queries
                  </span>
                  {unreadNotifications.length > 0 ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                      {unreadNotifications.length} New
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      All Read
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                    title="Mark all notifications as read"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Read all</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulateNewQuery}
                    disabled={isSimulating}
                    className="inline-flex items-center gap-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 text-[11px] font-bold transition cursor-pointer disabled:opacity-50"
                    title="Simulate an incoming student query to test live notification"
                  >
                    <Sparkles className={`h-3 w-3 ${isSimulating ? "animate-spin" : ""}`} />
                    <span>+ Test Query</span>
                  </button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1 pt-2 pb-1 border-b border-border/60">
                <button
                  type="button"
                  onClick={() => setFilterType("ALL")}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                    filterType === "ALL"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("QUERIES")}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                    filterType === "QUERIES"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Queries ({queryCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterType("DISPATCH")}
                  className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition cursor-pointer ${
                    filterType === "DISPATCH"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Dispatch ({dispatchCount})
                </button>
              </div>

              {/* Notification List */}
              <div className="mt-2 space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                {filteredNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    <Check className="h-6 w-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                    No notifications in this category. You&apos;re all caught up!
                  </div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <NotificationItem
                      key={notif.id}
                      item={notif}
                      isUnread={!readIds.includes(notif.id)}
                      onItemClick={handleItemClick}
                      isMobile={false}
                    />
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
                <Link
                  href="/admin/enquiries"
                  onClick={() => setNotificationsOpen(false)}
                  className="font-semibold text-primary hover:text-primary-hover hover:underline"
                >
                  View All Enquiries ({queryCount}) →
                </Link>
                <Link
                  href="/admin/bookings"
                  onClick={() => setNotificationsOpen(false)}
                  className="font-semibold text-muted-foreground hover:text-foreground transition"
                >
                  Dispatch Bookings →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Notification Popover via Portal */}
        {isClient &&
          isNotificationsOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <div className="sm:hidden">
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
                onClick={() => {
                  setNotificationsOpen(false);
                  bellButtonRef.current?.focus();
                }}
                aria-hidden="true"
              />

              {/* Viewport-safe Popover Container */}
              <div
                ref={mobilePanelRef}
                id="admin-notifications-panel-mobile"
                role="dialog"
                aria-modal="true"
                aria-label="Dispatch Alerts and Passes"
                className="fixed top-[68px] inset-x-3 z-50 max-h-[calc(100dvh-80px)] overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-2xl text-card-foreground mx-auto max-w-[420px] animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Alerts &amp; Queries
                    </span>
                    {unreadNotifications.length > 0 ? (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {unreadNotifications.length} New
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="h-3 w-3" />
                        All Read
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSimulateNewQuery}
                      disabled={isSimulating}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary px-2 py-1 text-[11px] font-bold"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>+ Query</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        bellButtonRef.current?.focus();
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                      aria-label="Close notifications"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 pt-2 pb-2 border-b border-border/60">
                  <button
                    type="button"
                    onClick={() => setFilterType("ALL")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                      filterType === "ALL"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("QUERIES")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                      filterType === "QUERIES"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Queries ({queryCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterType("DISPATCH")}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-bold transition ${
                      filterType === "DISPATCH"
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    Dispatch ({dispatchCount})
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground">
                      No notifications in this category.
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        item={notif}
                        isUnread={!readIds.includes(notif.id)}
                        onItemClick={handleItemClick}
                        isMobile={true}
                      />
                    ))
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2 text-center">
                  <Link
                    href="/admin/enquiries"
                    onClick={() => setNotificationsOpen(false)}
                    className="flex min-h-[44px] items-center justify-center rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary-hover transition"
                  >
                    View All Enquiries ({queryCount}) →
                  </Link>
                  <Link
                    href="/admin/bookings"
                    onClick={() => setNotificationsOpen(false)}
                    className="flex min-h-[40px] items-center justify-center rounded-xl bg-muted/50 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                  >
                    Dispatch Bookings
                  </Link>
                </div>
              </div>
            </div>,
            document.body
          )}

        {/* Interactive User Account Menu */}
        <div className="border-l border-border pl-2 sm:pl-2.5">
          <UserAccountMenu
            user={user}
            role="ADMIN"
            isOpen={accountMenuOpen && !isMobileOpen}
            onOpenChange={(open) => {
              if (open) {
                setNotificationsOpen(false);
              }
              setAccountMenuOpen(open);
            }}
          />
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
