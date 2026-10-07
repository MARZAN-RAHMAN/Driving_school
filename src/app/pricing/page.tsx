import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Tag,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Car,
  HelpCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { db } from "@/lib/db";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/pricing", {
    title: "Driving Lesson Prices & Course Packages Manchester | NextDrive",
    description:
      "Transparent driving lesson prices in Manchester. Manual lessons from £37.50/hr, Automatic from £40/hr. Block booking discounts and student offers available.",
  });
}

export default async function PricingPage() {
  const [settings, packages, locations, pageSeo] = await Promise.all([
    db.getBusinessSettings(),
    db.getLessonPackages(),
    db.getLocations(true),
    db.getPageSEO("/pricing"),
  ]);

  const assessmentPrice = Math.round(settings.hourlyRateManual * 2);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Pricing & Packages", href: "/pricing" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <Tag className="w-3.5 h-3.5 text-primary" />
              <span>Transparent Rates • No Hidden Administration Fees</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              {pageSeo?.h1 || "Transparent Driving Tuition Rates & Packages"}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Clear, competitive pricing for manual and automatic driving tuition across Manchester. Invest in quality tuition with DVSA Grade A instructors.
            </p>

            {/* Quick Hourly Rate Spotlight */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-left flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Manual Tuition
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">
                    £{settings.hourlyRateManual.toFixed(2)}
                    <span className="text-xs font-medium text-muted-foreground"> / hour</span>
                  </div>
                  <div className="text-[11px] text-success font-semibold mt-1">
                    Block discounts available
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Car className="w-6 h-6" />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-left flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Automatic Tuition
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">
                    £{settings.hourlyRateAutomatic.toFixed(2)}
                    <span className="text-xs font-medium text-muted-foreground"> / hour</span>
                  </div>
                  <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1">
                    Modern hybrid dual-control fleet
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Packages Grid */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="BLOCK BOOKINGS & PACKAGES"
              title="Tuition Packages"
              titleHighlight="&amp; Block Savings"
              subtitle="Save money with upfront block bookings. All hours are logged with your instructor."
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => {
                const isFeatured = pkg.popular || pkg.isPopular;
                return (
                  <div
                    key={pkg.id}
                    className={`rounded-3xl border p-8 flex flex-col justify-between transition ${
                      isFeatured
                        ? "border-primary bg-card shadow-xl ring-2 ring-primary/20 relative"
                        : "border-border bg-card shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                          {pkg.durationHours} Hours
                        </span>
                        <span className="text-xs bg-surface-secondary px-2.5 py-0.5 rounded font-medium text-muted-foreground">
                          {pkg.transmission}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-card-foreground">{pkg.title}</h3>
                      {pkg.description && (
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{pkg.description}</p>
                      )}

                      <div className="mt-6 flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-foreground">£{pkg.price}</span>
                        <span className="text-xs text-muted-foreground">/ package</span>
                      </div>

                      <ul className="mt-6 space-y-2.5 text-xs text-foreground/90">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-6 border-t border-border">
                      <Link
                        href={`/contact?package=${encodeURIComponent(pkg.title)}`}
                        className={`w-full rounded-xl py-3 text-center text-xs font-bold block transition ${
                          isFeatured
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                            : "border border-border bg-card text-foreground hover:bg-surface-secondary"
                        }`}
                      >
                        Book This Package
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What's Included Guarantee */}
        <section className="py-16 lg:py-24 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="OUR PROMISE"
              title="What is Included in"
              titleHighlight="Every Lesson"
              subtitle="Full transparency — every booking with NextDrive comes standard with complete peace-of-mind."
            />

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-primary mb-3" />
                <h4 className="font-bold text-sm text-foreground">Dual-Control Safety</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  He-Man certified dual-brake controls installed and inspected across every manual and automatic vehicle.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-success mb-3" />
                <h4 className="font-bold text-sm text-foreground">1-to-1 Dedicated Tuition</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  No car sharing or piggybacking other students. You have your instructor&apos;s complete 100% attention.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <Car className="w-6 h-6 text-purple-600 mb-3" />
                <h4 className="font-bold text-sm text-foreground">Comprehensive Insurance</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Full commercial driving school insurance coverage, fuel, and pupil indemnity included at zero extra surcharge.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <Zap className="w-6 h-6 text-amber-500 mb-3" />
                <h4 className="font-bold text-sm text-foreground">Official Test Preparation</h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Structured rehearsal of published Cheetham Hill, West Didsbury, Sale, and Bury driving test centre routes.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
