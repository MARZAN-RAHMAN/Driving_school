/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import {
  Car,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Award,
} from "lucide-react";
import { db } from "@/lib/db";
import { BusinessSettings, LessonPackage, LocationArea } from "@/types";

interface FooterProps {
  settings?: BusinessSettings;
  packages?: LessonPackage[];
  locations?: LocationArea[];
}

export async function Footer({
  settings: initialSettings,
  packages: initialPackages,
  locations: initialLocations,
}: FooterProps = {}) {
  const settings = initialSettings || (await db.getBusinessSettings());
  const packages = initialPackages || (await db.getLessonPackages());
  const locations = initialLocations || (await db.getLocations());

  const businessName = settings.businessName || "NextDrive";
  const tradingName = settings.tradingName || "NextDrive UK Ltd";
  const phone = settings.phone || "+44 20 7946 0921";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const email = settings.email || "support@nextdrive.uk";
  const address = settings.headOfficeAddress || "124 Baker Street, Marylebone, London, NW1 6XE";
  const regNo = settings.companyRegistrationNumber || "12948210";
  const dvsaId = settings.dvsaSchoolId || "DVSA-SCH-90412";
  const passRate = settings.firstTimePassRate || "89.4%";

  return (
    <footer className="border-t border-border bg-card text-card-foreground transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand & Accreditation */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt={businessName}
                  className="h-10 w-10 rounded-2xl object-cover shadow-xs ring-1 ring-border"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
                  <Car className="h-5 w-5" />
                </div>
              )}
              <div>
                <span className="text-xl font-bold tracking-tight text-foreground">
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
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {settings.tagline || "Driving Academy London"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground leading-relaxed max-w-sm">
              DVSA-approved professional driving tuition across London. Dual-control manual and automatic instruction with industry-leading {passRate} first-time pass rates.
            </p>

            <div className="mt-5 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href={phoneHref} className="hover:text-primary transition">
                  {phone} (Hotline)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-primary transition">
                  {email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>{address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-4 flex items-center gap-3">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition"
                  aria-label="Facebook"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  aria-label="Instagram"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  aria-label="YouTube"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
              {settings.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition"
                  aria-label="Twitter / X"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
              <ShieldCheck className="h-4 w-4 text-success" />
              DVSA Certified School: {dvsaId}
            </div>
          </div>

          {/* Column 1: Courses */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Tuition Courses
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              {packages.slice(0, 5).map((pkg) => (
                <li key={pkg.id}>
                  <Link href="/#courses" className="hover:text-primary transition">
                    {pkg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Test Centers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Coverage &amp; Centers
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              {locations.slice(0, 4).map((loc) => (
                <li key={loc.id}>
                  <Link href="/#locations" className="hover:text-primary transition">
                    {loc.testCenterName}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/#instructors" className="hover:text-primary transition">
                  Our Certified ADI Fleet
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform Governance */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition">
                  Student / Instructor Login
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary transition">
                  Admin Control Center
                </Link>
              </li>
              <li>
                <Link href="/admin/cms" className="hover:text-primary transition">
                  Homepage CMS
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="hover:text-primary transition">
                  Business Settings &amp; Rates
                </Link>
              </li>
              <li>
                <Link href="/api/health" target="_blank" className="hover:text-primary transition">
                  System Health Telemetry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {tradingName}. Registered in England &amp; Wales #{regNo}. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
              <Award className="h-3.5 w-3.5 text-primary" />
              {passRate} Practical Pass Rate
            </span>
            <span className="text-muted-foreground/40">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              He-Man Dual Controls
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
