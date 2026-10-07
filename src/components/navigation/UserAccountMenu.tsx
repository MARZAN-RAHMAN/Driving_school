"use client";

import React, { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserRound,
  Settings,
  ShieldCheck,
  Calendar,
  LogOut,
  ChevronDown,
  X,
  Loader2,
} from "lucide-react";
import { User, UserRole } from "@/types";
import { UserAvatar } from "@/components/ui/UserAvatar";

const emptySubscribe = () => () => {};

export interface UserAccountMenuProps {
  user?: User;
  role?: UserRole;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerClassName?: string;
}

export function UserAccountMenu({
  user: initialUser,
  role: initialRole,
  isOpen: controlledIsOpen,
  onOpenChange,
  triggerClassName = "",
}: UserAccountMenuProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | undefined>(initialUser);
  const [prevInitialUser, setPrevInitialUser] = useState(initialUser);
  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser);
    setCurrentUser(initialUser);
  }

  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isClient = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const isMenuOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
  const setIsMenuOpen = useCallback(
    (open: boolean) => {
      if (onOpenChange) {
        onOpenChange(open);
      } else {
        setUncontrolledIsOpen(open);
      }
    },
    [onOpenChange]
  );

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  // Fetch real authenticated user from /api/auth/me on mount if not provided or to ensure fresh data
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

  // Click outside and Escape key handling
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const clickedInsideTrigger =
        triggerButtonRef.current && triggerButtonRef.current.contains(target);
      const clickedInsideDesktop =
        desktopDropdownRef.current && desktopDropdownRef.current.contains(target);
      const clickedInsideMobile =
        mobilePanelRef.current && mobilePanelRef.current.contains(target);

      if (!clickedInsideTrigger && !clickedInsideDesktop && !clickedInsideMobile) {
        setIsMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        triggerButtonRef.current?.focus();
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
  }, [isMenuOpen, setIsMenuOpen]);

  // Mobile background scroll lock
  useEffect(() => {
    if (isMenuOpen && typeof window !== "undefined" && window.innerWidth < 640) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow || "";
      };
    }
  }, [isMenuOpen]);

  const activeRole: UserRole = currentUser?.role || initialRole || "STUDENT";
  const displayName = currentUser?.name || "NextDrive User";
  const displayEmail = currentUser?.email || "user@nextdrive.uk";
  const avatarUrl = currentUser?.avatar || null;

  // Real Sign Out handler
  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setIsMenuOpen(false);
      // Invalidate client router cache and redirect to login
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Role-aware navigation links
  const getNavLinks = () => {
    switch (activeRole) {
      case "ADMIN":
      case "EDITOR":
        return [
          {
            label: "My Profile",
            href: "/admin/profile",
            icon: UserRound,
            desc: "Personal info & credentials",
          },
          {
            label: "Account Settings",
            href: "/admin/settings",
            icon: Settings,
            desc: "Platform & business preferences",
          },
          {
            label: "Security & Passwords",
            href: "/admin/profile?tab=security",
            icon: ShieldCheck,
            desc: "Password & connected logins",
          },
        ];
      case "INSTRUCTOR":
        return [
          {
            label: "My Profile",
            href: "/instructor/profile",
            icon: UserRound,
            desc: "DVSA badge & learner bio",
          },
          {
            label: "Account Settings",
            href: "/instructor/settings",
            icon: Settings,
            desc: "Social logins & notifications",
          },
          {
            label: "Availability & Dispatch",
            href: "/instructor/availability",
            icon: Calendar,
            desc: "Manage working hours",
          },
          {
            label: "Security & Passwords",
            href: "/instructor/settings",
            icon: ShieldCheck,
            desc: "Password & identity verification",
          },
        ];
      case "STUDENT":
      default:
        return [
          {
            label: "My Profile",
            href: "/student/profile",
            icon: UserRound,
            desc: "Contact details & licence number",
          },
          {
            label: "Account Settings",
            href: "/student/settings",
            icon: Settings,
            desc: "Social logins & preferences",
          },
          {
            label: "Security & Passwords",
            href: "/student/settings",
            icon: ShieldCheck,
            desc: "Password & identity credentials",
          },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="relative inline-block text-left">
      {/* Interactive Account Trigger */}
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${displayName}`}
        className={`group flex items-center gap-2.5 rounded-2xl p-1.5 transition-all cursor-pointer hover:bg-muted/70 active:scale-98 focus-visible:outline-2 focus-visible:outline-primary ${triggerClassName}`}
      >
        <UserAvatar
          src={avatarUrl}
          name={displayName}
          size="sm"
          showStatusDot={true}
          statusColor="bg-emerald-500"
        />

        {/* Desktop / Tablet Details */}
        <div className="hidden md:flex flex-col text-left pr-1">
          <span className="block text-xs font-semibold text-foreground leading-tight truncate max-w-[140px] sm:max-w-[180px]">
            {displayName}
          </span>
          <span className="block text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            {activeRole}
          </span>
        </div>

        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
            isMenuOpen ? "rotate-180 text-foreground" : "group-hover:text-foreground"
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Desktop Dropdown Menu (sm+ screens) */}
      {isMenuOpen && (
        <div
          ref={desktopDropdownRef}
          role="menu"
          aria-label="User Account Menu"
          className="hidden sm:block absolute right-0 mt-2 w-80 rounded-2xl border border-border bg-card p-3 shadow-2xl z-50 text-card-foreground animate-in fade-in zoom-in-95 duration-100"
        >
          {/* User Header Summary Card */}
          <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 border border-border/60">
            <UserAvatar
              src={avatarUrl}
              name={displayName}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">{displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold text-primary uppercase tracking-wider">
                  {activeRole}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-2 space-y-0.5" role="none">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-xs text-foreground hover:bg-muted transition group cursor-pointer"
                >
                  <div className="rounded-lg bg-muted p-1.5 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block font-semibold leading-tight text-foreground">
                      {link.label}
                    </span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      {link.desc}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Sign Out Option */}
          <div className="mt-2 pt-2 border-t border-border" role="none">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-destructive hover:bg-destructive/10 transition cursor-pointer disabled:opacity-50"
            >
              <div className="rounded-lg bg-destructive/10 p-1.5 text-destructive shrink-0">
                {isLoggingOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
              </div>
              <span className="flex-1 text-left">
                {isLoggingOut ? "Signing out..." : "Sign Out"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Account Panel via Portal (viewport-safe) */}
      {isClient &&
        isMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div className="sm:hidden">
            {/* Backdrop Overlay */}
            <div
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
              onClick={() => {
                setIsMenuOpen(false);
                triggerButtonRef.current?.focus();
              }}
              aria-hidden="true"
            />

            {/* Mobile Sheet / Floating Panel */}
            <div
              ref={mobilePanelRef}
              role="dialog"
              aria-modal="true"
              aria-label="User Account Menu"
              className="fixed top-[68px] inset-x-3 z-50 max-h-[calc(100dvh-80px)] overflow-y-auto rounded-3xl border border-border bg-card p-5 shadow-2xl text-card-foreground mx-auto max-w-[380px] animate-in fade-in slide-in-from-top-2 duration-150"
            >
              {/* Top Bar with Title and Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  My Account
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    triggerButtonRef.current?.focus();
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition cursor-pointer"
                  aria-label="Close account menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Centered User Profile Summary */}
              <div className="flex flex-col items-center justify-center py-5 text-center">
                <UserAvatar
                  src={avatarUrl}
                  name={displayName}
                  size="xl"
                  showStatusDot={true}
                  className="shadow-md"
                />
                <h3 className="mt-3 text-base font-bold text-foreground">{displayName}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{displayEmail}</p>
                <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-extrabold text-primary uppercase tracking-wider">
                  {activeRole}
                </span>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 border-t border-border pt-3">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex min-h-[44px] items-center gap-3 rounded-2xl px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
                    >
                      <div className="rounded-xl bg-muted p-2 text-muted-foreground shrink-0">
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div className="text-left flex-1">
                        <span className="block text-xs font-semibold text-foreground">
                          {link.label}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">
                          {link.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Sign Out Button */}
              <div className="mt-4 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-destructive/10 px-4 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>{isLoggingOut ? "Signing Out..." : "Sign Out"}</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
