/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  X,
  Phone,
  Sparkles,
  GraduationCap,
} from "lucide-react";

import { BusinessSettings } from "@/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useBookingModal } from "@/context/BookingModalContext";
import { NextDriveLogo } from "@/components/ui/NextDriveLogo";

interface UserSession {
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface NavbarProps {
  initialSettings?: BusinessSettings;
}

export function Navbar({ initialSettings }: NavbarProps = {}) {
  const router = useRouter();
  const { openBookingModal } = useBookingModal();
  const [settings, setSettings] = useState<BusinessSettings | null>(initialSettings || null);
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Fetch live session
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data?.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));

    // Fetch live business settings if not provided or to sync
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => {});

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open; cleanly restore on close
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Dynamically sync actual rendered header height to CSS custom variables
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = Math.round(headerRef.current.getBoundingClientRect().height);
        if (height > 0) {
          document.documentElement.style.setProperty("--site-header-height", `${height}px`);
          document.documentElement.style.setProperty("--mobile-header-height", `${height}px`);
        }
      }
    };
    updateHeaderHeight();
    const ro = new ResizeObserver(updateHeaderHeight);
    if (headerRef.current) {
      ro.observe(headerRef.current);
    }
    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const businessName = settings?.businessName || "NextDrive";
  const phone = settings?.phone || "+44 161 946 0921";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const tagline = settings?.tagline || "DVSA Certified • Manchester";
  const logoBadge = settings?.logoBadgeText || "Academy";
  const assessmentPrice = settings?.hourlyRateManual ? Math.round(settings.hourlyRateManual * 2) : 75;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full transition-all duration-300 border-b pt-[env(safe-area-inset-top,0px)] ${
        scrolled
          ? "glass-nav-scrolled border-border/80 shadow-xs"
          : "bg-card/95 backdrop-blur-md border-border/60 shadow-2xs"
      }`}
    >
      <div className="mx-auto flex h-16 sm:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 transition hover:opacity-95 shrink-0">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={businessName}
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl object-cover shadow-xs ring-1 ring-border shrink-0"
            />
          ) : (
            <NextDriveLogo size={42} className="shrink-0" />
          )}
          <div className="shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-bold tracking-tight text-foreground font-sans whitespace-nowrap">
                {businessName.includes("NextDrive") ? (
                  <>
                    Next<span className="text-primary">Drive</span>
                  </>
                ) : businessName.includes("NexusDrive") ? (
                  <>
                    Nexus<span className="text-primary">Drive</span>
                  </>
                ) : (
                  businessName
                )}
              </span>
              {logoBadge && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-primary whitespace-nowrap">
                  {logoBadge}
                </span>
              )}
            </div>
            <span className="block text-[9px] sm:text-[10px] font-medium tracking-wide uppercase text-muted-foreground whitespace-nowrap">
              {tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Visible on lg screens 1024px+) with comfortable separation from brand */}
        {/* Desktop Nav Links (Visible on lg screens 1024px+) with 3D Tactile Hover Animation */}
        <nav className="hidden items-center gap-1 xl:gap-2 2xl:gap-3 lg:flex shrink-0 lg:ml-7 xl:ml-10">
          {[
            { href: "/driving-lessons", label: "Lessons" },
            { href: "/pricing", label: "Pricing" },
            { href: "/instructors", label: "Instructors" },
            { href: "/locations", label: "Locations" },
            { href: "/test-centres", label: "Test Centres" },
            { href: "/faq", label: "FAQ" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground overflow-hidden border border-transparent nav-item-3d hover:text-foreground hover:border-border/60 hover:bg-card/90"
            >
              {/* Specular sheen beam on hover */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
                aria-hidden="true"
              />

              {/* Glowing road lane underline */}
              <span
                className="pointer-events-none absolute bottom-0 inset-x-2 h-0.5 rounded-full bg-gradient-to-r from-cyan-400 via-primary to-indigo-600 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                aria-hidden="true"
              />

              <span className="relative z-10 transition-colors group-hover:text-primary">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions & Theme Toggle */}
        <div className="hidden items-center gap-2 xl:gap-2.5 lg:flex shrink-0">
          <div className="hidden xl:block h-4 w-px bg-border shrink-0" aria-hidden="true" />
          <a
            href={phoneHref}
            className="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3 py-1.5 text-xs font-semibold text-foreground shadow-2xs transition hover:border-primary/40 hover:bg-card hover:text-primary shrink-0 whitespace-nowrap"
            title={`Call ${businessName}: ${phone}`}
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="whitespace-nowrap">{phone}</span>
          </a>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {!loading && user ? (
            <div className="flex items-center gap-2">
              {user.role === "ADMIN" || user.role === "EDITOR" ? (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover whitespace-nowrap shrink-0"
                >
                  <LayoutDashboard className="h-3.5 w-3.5 shrink-0" />
                  Admin Center
                </Link>
              ) : user.role === "INSTRUCTOR" ? (
                <Link
                  href="/instructor"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover whitespace-nowrap shrink-0"
                >
                  <Car className="h-3.5 w-3.5 shrink-0" />
                  Instructor Portal
                </Link>
              ) : (
                <Link
                  href="/student"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover whitespace-nowrap shrink-0"
                >
                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                  Student Portal
                </Link>
              )}
              <button
                onClick={handleLogout}
                title="Sign out"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card p-2 text-xs font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground shrink-0"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-muted-foreground transition hover:text-foreground whitespace-nowrap shrink-0"
              >
                <LogIn className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                Sign In
              </Link>
              <button
                type="button"
                onClick={() =>
                  openBookingModal({
                    course: "Introductory 2-Hour Assessment",
                    source: "navbar-desktop",
                  })
                }
                className="hidden xl:inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover whitespace-nowrap shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span>Book Assessment</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls (Theme Switcher + Hamburger) */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-card p-2 text-foreground shadow-xs hover:bg-muted active:scale-95 transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-card px-5 py-5 lg:hidden shadow-xl">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/driving-lessons"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Driving Lessons
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Prices &amp; Course Packages
            </Link>
            <Link
              href="/instructors"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Driving Instructors Fleet
            </Link>
            <Link
              href="/locations"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Service Locations &amp; Map
            </Link>
            <Link
              href="/test-centres"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Test Centres Guide
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Driving Guides &amp; Blog
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Frequently Asked Questions
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Contact Us
            </Link>

            <div className="border-t border-border pt-4 mt-2 space-y-2.5">
              <a
                href={phoneHref}
                className="flex items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <Phone className="h-3.5 w-3.5 text-primary" />
                Call: {phone}
              </a>

              {!loading && user ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 text-xs text-muted-foreground">
                    <span>
                      Signed in as <strong className="text-foreground">{user.name}</strong>
                    </span>
                    <span className="rounded-lg bg-primary/10 px-2 py-0.5 font-bold text-primary text-[10px]">
                      {user.role}
                    </span>
                  </div>
                  {user.role === "ADMIN" || user.role === "EDITOR" ? (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Admin Control Center
                    </Link>
                  ) : user.role === "INSTRUCTOR" ? (
                    <Link
                      href="/instructor"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover"
                    >
                      <Car className="h-4 w-4" />
                      Instructor Portal Dashboard
                    </Link>
                  ) : (
                    <Link
                      href="/student"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover"
                    >
                      <GraduationCap className="h-4 w-4" />
                      Student Portal Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2 text-xs font-semibold text-error hover:bg-error/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
                  >
                    <LogIn className="h-3.5 w-3.5 text-muted-foreground" />
                    Sign In to Portal
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openBookingModal({
                        course: "Introductory 2-Hour Assessment",
                        source: "navbar-mobile",
                      });
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Book Assessment Lesson (£{assessmentPrice})
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
