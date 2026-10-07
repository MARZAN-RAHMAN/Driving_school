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
  ExternalLink,
  ChevronDown,
  ArrowRight,
  MessageCircle,
  Clock,
} from "lucide-react";
import { db } from "@/lib/db";
import {
  BusinessSettings,
  FooterSettings,
  LessonPackage,
  LocationArea,
  FooterSocialPlatform,
} from "@/types";
import { BookLessonButton } from "@/components/booking/BookLessonButton";
import { NextDriveLogo } from "@/components/ui/NextDriveLogo";

interface FooterProps {
  settings?: BusinessSettings;
  footerSettings?: FooterSettings;
  packages?: LessonPackage[];
  locations?: LocationArea[];
}

/**
 * Social media platform SVG icons
 */
function SocialIcon({ platform }: { platform: FooterSocialPlatform }) {
  switch (platform) {
    case "facebook":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case "x":
      return (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "whatsapp":
      return (
        <MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" />
      );
    default:
      return null;
  }
}

export async function Footer({
  settings: initialSettings,
  footerSettings: initialFooterSettings,
  packages: initialPackages,
  locations: initialLocations,
}: FooterProps = {}) {
  // Load data from parameters or database
  const settings = initialSettings || (await db.getBusinessSettings());
  const footer = initialFooterSettings || (await db.getFooterSettings(true));
  const packages = initialPackages || (await db.getLessonPackages());
  const locations = initialLocations || (await db.getLocations());

  // Master disable check
  if (footer.isEnabled === false) {
    return null;
  }

  // Resolve Brand Information
  const businessName = footer.useBusinessBrand && settings.businessName
    ? settings.businessName
    : footer.brandName || settings.businessName || "NextDrive";
  const tagline = footer.useBusinessBrand && settings.tagline
    ? settings.tagline
    : footer.tagline || settings.tagline || "Driving Academy Manchester";
  const description =
    footer.description ||
    "DVSA-approved professional driving tuition across Greater Manchester. Dual-control manual and automatic instruction with structured practical test preparation.";
  const logoUrl = footer.logoUrl || settings.logoUrl;

  // Resolve Contact Information
  const phone = footer.useBusinessContact && settings.phone
    ? settings.phone
    : footer.phone || settings.phone || "+44 161 946 0921";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const email = footer.useBusinessContact && settings.email
    ? settings.email
    : footer.email || settings.email || "support@nextdrive.uk";
  const address = footer.useBusinessContact && settings.headOfficeAddress
    ? settings.headOfficeAddress
    : footer.address || settings.headOfficeAddress || "Peter House, Oxford Street, Manchester, M1 5AN";
  const dvsaId = footer.dvsaSchoolId || settings.dvsaSchoolId || "DVSA-SCH-90412";
  const regNo = settings.companyRegistrationNumber || "12948210";
  const passRate = settings.firstTimePassRate || "89.4%";

  // Container width classes
  const containerWidthClass =
    footer.containerWidth === "compact"
      ? "max-w-5xl"
      : footer.containerWidth === "wide"
      ? "max-w-[1400px]"
      : "max-w-7xl";

  // Vertical padding classes
  const spacingClass =
    footer.spacing === "compact"
      ? "py-10"
      : footer.spacing === "spacious"
      ? "py-24"
      : "py-16";

  // Background style classes
  const bgClass =
    footer.backgroundStyle === "subtle_gradient"
      ? "bg-gradient-to-b from-card via-card/95 to-background"
      : "bg-card";

  // Dynamic Copyright Text
  const currentYear = new Date().getFullYear().toString();
  const copyrightRendered = (footer.copyrightText || "© {year} NextDrive UK Ltd. All rights reserved.")
    .replace("{year}", currentYear);

  // Filter active navigation columns
  const activeColumns = (footer.columns || []).filter((col) => col.isEnabled !== false);

  return (
    <footer
      className={`relative border-t border-border ${bgClass} text-card-foreground transition-colors duration-200 overflow-hidden`}
    >
      {/* Top Ambient Accent Line */}
      {footer.topDivider !== false && (
        <div
          className={`absolute top-0 left-0 right-0 h-[1px] pointer-events-none ${
            footer.topDividerStyle === "solid"
              ? "bg-border"
              : footer.topDividerStyle === "subtle"
              ? "bg-border/40"
              : "bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          }`}
          aria-hidden="true"
        />
      )}

      {/* Automotive Radial Glow Accent */}
      {footer.backgroundStyle === "premium_glow" && (
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[120px] w-[600px] rounded-full bg-primary/10 blur-[80px] opacity-40 dark:opacity-20 select-none"
          aria-hidden="true"
        />
      )}

      {/* Optional High-Conversion Footer CTA Strip */}
      {footer.showCTA && (
        <div className="border-b border-border/80 bg-muted/30 backdrop-blur-xs">
          <div className={`mx-auto ${containerWidthClass} px-4 py-8 sm:px-6 lg:px-8`}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                {footer.ctaEyebrow && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {footer.ctaEyebrow}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {footer.ctaHeading || "Ready to Pass Your Driving Test First Time?"}
                </h3>
                {footer.ctaDescription && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {footer.ctaDescription}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {footer.ctaPrimaryText && (
                  footer.ctaPrimaryAction === "booking_modal" ? (
                    <BookLessonButton
                      source="footer-cta"
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {footer.ctaPrimaryText}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </BookLessonButton>
                  ) : footer.ctaPrimaryAction === "courses_link" ? (
                    <Link
                      href="/#courses"
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                    >
                      {footer.ctaPrimaryText}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <a
                      href={footer.ctaPrimaryUrl || "/#courses"}
                      className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                    >
                      {footer.ctaPrimaryText}
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  )
                )}

                {footer.ctaSecondaryText && (
                  footer.ctaSecondaryAction === "call_phone" ? (
                    <a
                      href={phoneHref}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition"
                    >
                      <Phone className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {footer.ctaSecondaryText}
                    </a>
                  ) : footer.ctaSecondaryAction === "contact_page" ? (
                    <Link
                      href="/contact"
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition"
                    >
                      {footer.ctaSecondaryText}
                    </Link>
                  ) : (
                    <a
                      href={footer.ctaSecondaryUrl || "/contact"}
                      className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition"
                    >
                      {footer.ctaSecondaryText}
                    </a>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content Container */}
      <div className={`mx-auto ${containerWidthClass} px-4 ${spacingClass} sm:px-6 lg:px-8`}>
        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand & Accreditation Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              {footer.showLogo !== false && (
                logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={businessName}
                    className="h-10 w-10 rounded-2xl object-cover shadow-xs ring-1 ring-border"
                  />
                ) : (
                  <NextDriveLogo size={42} className="shrink-0" />
                )
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
                  {tagline}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-muted-foreground leading-relaxed max-w-sm">
              {description}
            </p>

            {/* Contact Details */}
            {footer.showContact !== false && (
              <div className="mt-5 space-y-2 text-xs text-muted-foreground">
                {phone && (
                  <div className="flex items-center gap-2">
                    {footer.showContactIcons !== false && (
                      <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                    <a href={phoneHref} className="hover:text-primary transition">
                      {phone} (Hotline)
                    </a>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-2">
                    {footer.showContactIcons !== false && (
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                    <a href={`mailto:${email}`} className="hover:text-primary transition">
                      {email}
                    </a>
                  </div>
                )}
                {address && (
                  <div className="flex items-center gap-2">
                    {footer.showContactIcons !== false && (
                      <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                    <span>{address}</span>
                  </div>
                )}
                {footer.openingHours && (
                  <div className="flex items-center gap-2">
                    {footer.showContactIcons !== false && (
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                    <span>{footer.openingHours}</span>
                  </div>
                )}
              </div>
            )}

            {/* Social Media Links */}
            {footer.showSocial !== false && (
              <div className="mt-4 flex items-center gap-3">
                {(footer.socialLinks || [])
                  .filter((s) => s.isEnabled)
                  .map((social) => (
                    <a
                      key={social.id}
                      href={social.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition p-1"
                      aria-label={social.platform}
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  ))}
              </div>
            )}

            {/* DVSA Certified School Badge */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
              <ShieldCheck className="h-4 w-4 text-success shrink-0" />
              DVSA Certified School: {dvsaId}
            </div>
          </div>

          {/* Dynamic Navigation Columns (Desktop Grid) */}
          <div className="hidden md:contents">
            {activeColumns.map((column) => {
              const isLocationCol = column.source === "locations_sync" || column.isLocationColumn;

              return (
                <div key={column.id}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    {column.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
                    {isLocationCol ? (
                      // Render dynamically synchronized locations
                      locations.slice(0, 5).map((loc) => (
                        <li key={loc.id}>
                          <Link
                            href="/#locations"
                            className="group flex items-center justify-between hover:text-primary transition"
                          >
                            <span>{loc.testCenterName}</span>
                            {footer.showLinkArrows && (
                              <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </Link>
                        </li>
                      ))
                    ) : (
                      // Render custom column links
                      (column.links || [])
                        .filter((link) => link.isEnabled !== false)
                        .map((link) => (
                          <li key={link.id}>
                            <a
                              href={link.url}
                              {...(link.newTab || link.openInNewTab
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                              className="group flex items-center justify-between hover:text-primary transition"
                            >
                              <span className="flex items-center gap-1.5">
                                <span>{link.label}</span>
                                {link.badge && (
                                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                                    {link.badge}
                                  </span>
                                )}
                              </span>
                              {(link.newTab || link.openInNewTab) ? (
                                <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                              ) : footer.showLinkArrows ? (
                                <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                              ) : null}
                            </a>
                          </li>
                        ))
                    )}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Mobile Accordion View for Columns (<md) */}
          <div className="md:hidden space-y-2 border-t border-border/60 pt-4">
            {activeColumns.map((column) => {
              const isLocationCol = column.source === "locations_sync" || column.isLocationColumn;

              return (
                <details
                  key={column.id}
                  className="group rounded-xl border border-border/40 bg-card/50 overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-3.5 text-xs font-bold uppercase tracking-wider text-foreground select-none list-none">
                    <span>{column.title}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-3.5 pb-4 pt-1">
                    <ul className="space-y-2.5 text-xs text-muted-foreground">
                      {isLocationCol ? (
                        locations.slice(0, 6).map((loc) => (
                          <li key={loc.id}>
                            <Link
                              href="/#locations"
                              className="block hover:text-primary transition py-0.5"
                            >
                              {loc.testCenterName}
                            </Link>
                          </li>
                        ))
                      ) : (
                        (column.links || [])
                          .filter((link) => link.isEnabled !== false)
                          .map((link) => (
                            <li key={link.id}>
                              <a
                                href={link.url}
                                {...(link.newTab || link.openInNewTab
                                  ? { target: "_blank", rel: "noopener noreferrer" }
                                  : {})}
                                className="flex items-center justify-between hover:text-primary transition py-0.5"
                              >
                                <span>{link.label}</span>
                                {(link.newTab || link.openInNewTab) && (
                                  <ExternalLink className="h-3 w-3 opacity-40" />
                                )}
                              </a>
                            </li>
                          ))
                      )}
                    </ul>
                  </div>
                </details>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accreditation */}
        {footer.bottomDivider !== false && (
          <div className="mt-12 border-t border-border pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-muted-foreground">
            <p className="text-center sm:text-left">
              {copyrightRendered}
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
        )}

        {/* Developer Credit & Legal Links Sub-Bar */}
        <div className="mt-4 pt-4 border-t border-border/50 flex flex-col items-center justify-between gap-3 sm:flex-row text-[11px] text-muted-foreground">
          {/* Legal Compliance Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-muted-foreground/80">
            {(footer.legalLinks || [])
              .filter((item) => item.isEnabled !== false)
              .map((item, idx) => (
                <React.Fragment key={item.id}>
                  <Link href={item.url} className="hover:text-primary transition">
                    {item.label}
                  </Link>
                  {idx < (footer.legalLinks || []).length - 1 && (
                    <span className="text-muted-foreground/40">•</span>
                  )}
                </React.Fragment>
              ))}
          </div>

          {/* Developer Credit Tag */}
          {footer.showDeveloperCredit !== false && (
            <div className="flex items-center justify-center gap-1.5 text-center">
              <span className="text-muted-foreground">
                {footer.developerPrefix || "Designed & Developed by"}
              </span>

              {footer.developerStyle === "badge" ? (
                <a
                  href={footer.developerUrl || "https://crftdev.com"}
                  {...(footer.developerNewTab !== false
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={`Visit ${footer.developerName || "Crftdev Technology"} website`}
                  className="group inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 font-semibold text-primary hover:bg-primary/20 transition-all duration-200"
                >
                  <span>{footer.developerName || "Crftdev Technology"}</span>
                  {footer.developerShowIcon !== false && (
                    <ExternalLink className="h-2.5 w-2.5 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  )}
                </a>
              ) : footer.developerStyle === "text" ? (
                <a
                  href={footer.developerUrl || "https://crftdev.com"}
                  {...(footer.developerNewTab !== false
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={`Visit ${footer.developerName || "Crftdev Technology"} website`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {footer.developerName || "Crftdev Technology"}
                </a>
              ) : (
                // Minimal default style
                <a
                  href={footer.developerUrl || "https://crftdev.com"}
                  {...(footer.developerNewTab !== false
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  aria-label={`Visit ${footer.developerName || "Crftdev Technology"} website`}
                  className="group inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary dark:text-slate-200 dark:hover:text-primary transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xs"
                >
                  <span className="underline-offset-4 group-hover:underline">
                    {footer.developerName || "Crftdev Technology"}
                  </span>
                  {footer.developerShowIcon !== false && (
                    <ExternalLink className="h-3 w-3 text-muted-foreground/70 transition-all duration-200 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  )}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
export default Footer;
