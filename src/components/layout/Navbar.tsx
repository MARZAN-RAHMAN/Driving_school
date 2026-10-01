/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Car,
  ShieldCheck,
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

  useEffect(() => {
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
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const businessName = settings?.businessName || "NextDrive";
  const phone = settings?.phone || "+44 20 7946 0921";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const tagline = settings?.tagline || "DVSA Certified • London";
  const logoBadge = settings?.logoBadgeText || "Academy";
  const assessmentPrice = settings?.hourlyRateManual ? Math.round(settings.hourlyRateManual * 2) : 75;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-5 xl:px-6 2xl:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-90 shrink-0">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={businessName}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl object-cover shadow-xs ring-1 ring-border shrink-0"
            />
          ) : (
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs shrink-0">
              <Car className="h-5 w-5" />
            </div>
          )}
          <div className="shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-sans whitespace-nowrap">
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
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary whitespace-nowrap">
                  {logoBadge}
                </span>
              )}
            </div>
            <span className="block text-[10px] font-medium tracking-wide uppercase text-muted-foreground whitespace-nowrap">
              {tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links (Visible on lg screens 1024px+) */}
        <nav className="hidden items-center gap-1.5 xl:gap-3 2xl:gap-5 lg:flex shrink-0">
          <Link
            href="/#courses"
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-primary hover:bg-muted/80"
          >
            Courses &amp; Pricing
          </Link>
          <Link
            href="/#instructors"
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-primary hover:bg-muted/80"
          >
            Instructors Fleet
          </Link>
          <Link
            href="/#locations"
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-primary hover:bg-muted/80"
          >
            Test Centers
          </Link>
          <Link
            href="/#reviews"
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-primary hover:bg-muted/80"
          >
            Pass Stories
          </Link>
          <Link
            href="/#faqs"
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-primary hover:bg-muted/80"
          >
            FAQ
          </Link>
          <Link
            href="/contact"
            className="whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition hover:text-primary hover:bg-muted/80"
          >
            Contact
          </Link>
        </nav>

        {/* Desktop Actions & Theme Toggle */}
        <div className="hidden items-center gap-2 xl:gap-2.5 lg:flex shrink-0 ml-3 xl:ml-5 2xl:ml-7">
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
            className="rounded-xl border border-border bg-card p-2 text-foreground shadow-xs hover:bg-muted"
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
              href="/#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Courses &amp; Pricing
            </Link>
            <Link
              href="/#instructors"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Instructors Fleet
            </Link>
            <Link
              href="/#locations"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Test Centers &amp; Areas
            </Link>
            <Link
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted hover:text-primary"
            >
              Pass Stories &amp; Reviews
            </Link>
            <Link
              href="/#faqs"
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
