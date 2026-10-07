import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Phone,
  FileCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { db } from "@/lib/db";
import { getPageMetadata, getCourseSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/intensive-courses", {
    title: "Fast-Track Intensive Driving Courses Manchester | NextDrive",
    description:
      "Pass your driving test in 1 to 3 weeks with our structured Manchester intensive driving courses. Includes fast-track DVSA practical test booking.",
  });
}

export default async function IntensiveCoursesPage() {
  const [settings, packages, locations, faqs, pageSeo] = await Promise.all([
    db.getBusinessSettings(),
    db.getLessonPackages(),
    db.getLocations(true),
    db.getFaqs("Courses", true),
    db.getPageSEO("/intensive-courses"),
  ]);

  const intensivePackages = packages.filter(
    (p) => p.popular || p.isPopular || p.durationHours >= 20 || p.title.toLowerCase().includes("intensive")
  );

  const primaryPackage = intensivePackages[0] || packages[0];
  const schema = primaryPackage ? getCourseSchema(primaryPackage, settings) : null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Intensive Courses", href: "/intensive-courses" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="primary" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary shadow-xs mb-6">
              <Zap className="w-3.5 h-3.5" />
              <span>Fast-Track Pass Guarantee Route</span>
              <span className="text-muted-foreground">•</span>
              <span>1 to 3 Week Completion</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              {pageSeo?.h1 || "Intensive Driving Courses & Crash Courses in Manchester"}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Accelerate your journey to a full UK driving licence. Condensed daily tuition blocks with dedicated Grade A instructors and fast-track practical test booking at your nearest Manchester test centre.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact?course=intensive"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition shadow-primary/25"
              >
                <span>Check Fast-Track Test Availability</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground hover:bg-surface-secondary transition"
              >
                <span>Compare Course Rates</span>
              </Link>
            </div>
          </div>
        </section>

        {/* How Intensive Courses Work */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="STRUCTURED ACCELERATION"
              icon={<Clock className="w-3.5 h-3.5" />}
              title="How Our Manchester"
              titleHighlight="Intensive Courses Work"
              subtitle="A focused, low-stress curriculum that compresses months of weekly lessons into consecutive, high-retention driving days."
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                  01
                </div>
                <h4 className="text-base font-bold text-card-foreground">Initial Assessment Drive</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  A 2-hour practical evaluation where your instructor assesses steering, clutch or auto control, and road sense to match you with the ideal 20, 30, or 40-hour course.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                  02
                </div>
                <h4 className="text-base font-bold text-card-foreground">Consecutive Daily Tuition</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  3 to 4 hours of daily tuition across complex Manchester junctions, roundabouts, high-speed dual carriageways, and manoeuvres for rapid muscle-memory development.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-4">
                  03
                </div>
                <h4 className="text-base font-bold text-card-foreground">DVSA Practical Test Day</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Final pre-test rehearsal on official Cheetham Hill, West Didsbury, or Sale test routes, followed by instructor car hire for the practical driving examination.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Course Packages */}
        <section className="py-16 lg:py-24 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="INTENSIVE TIERS"
              title="Select Your Ideal"
              titleHighlight="Intensive Course Package"
              subtitle="All packages include DVSA practical test booking assistance and car hire on your test day."
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {intensivePackages.map((pkg) => {
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
                    {isFeatured && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-primary-foreground shadow-sm">
                        Most Popular Course
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider font-mono">
                          {pkg.durationHours} Hours Total
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
                        <span className="text-xs text-muted-foreground">/ course total</span>
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
                        href={`/contact?course=${encodeURIComponent(pkg.title)}`}
                        className={`w-full rounded-xl py-3 text-center text-xs font-bold block transition ${
                          isFeatured
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                            : "border border-border bg-card text-foreground hover:bg-surface-secondary"
                        }`}
                      >
                        Book This Course
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="INTENSIVE FAQS"
              title="Intensive Driving"
              titleHighlight="Frequently Asked Questions"
              subtitle="Everything you need to know about course scheduling, theory requirements, and test bookings."
            />
            <div className="mt-10">
              <FaqAccordion faqs={faqs} />
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
