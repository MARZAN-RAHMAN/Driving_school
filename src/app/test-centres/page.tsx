import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Navigation,
  MapPin,
  CheckCircle2,
  FileCheck,
  Award,
  ArrowRight,
  ShieldCheck,
  Clock,
  Car,
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
  return getPageMetadata("/test-centres", {
    title: "Manchester Driving Test Centres & Pass Rates | NextDrive Guide",
    description:
      "Comprehensive guide to Manchester DVSA driving test centres: Cheetham Hill, West Didsbury, Sale, Bury, and Bredbury. Local pass rates and test route tips.",
  });
}

export default async function TestCentresPage() {
  const [settings, testCentres, locations, packages, pageSeo] = await Promise.all([
    db.getBusinessSettings(),
    db.getLocalTestCentres(),
    db.getLocations(true),
    db.getLessonPackages(),
    db.getPageSEO("/test-centres"),
  ]);

  const activeCentres = testCentres.filter((tc) => tc.isActive);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Test Centres", href: "/test-centres" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <Navigation className="w-3.5 h-3.5 text-primary" />
              <span>DVSA Practical Test Centre Route Guides</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              {pageSeo?.h1 || "Manchester Driving Test Centres & Route Preparation"}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore pass rates, address coordinates, and notorious route challenges for all major DVSA test centres across Greater Manchester. Train with NextDrive on official examiner routes.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact?course=mock_test"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition shadow-primary/25"
              >
                <span>Book a Mock Driving Test</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Test Centres List */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="OFFICIAL VENUES"
              title="Greater Manchester"
              titleHighlight="Practical Test Centres"
              subtitle="Detailed intelligence on each test hub to help you enter your practical driving test with complete confidence."
            />

            <div className="mt-12 space-y-8 max-w-5xl mx-auto">
              {activeCentres.map((tc) => (
                <div
                  key={tc.id}
                  className="rounded-3xl border border-border bg-card p-8 shadow-xs hover:border-primary/50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded bg-primary/10 text-primary">
                          {tc.dvsaCentreId}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground font-mono font-semibold">
                          {tc.postcode}
                        </span>
                      </div>

                      <h3 className="mt-2 text-2xl font-bold text-card-foreground">{tc.name}</h3>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{tc.address}</span>
                      </div>

                      <div className="mt-4 rounded-2xl bg-surface-secondary/60 p-4 border border-border">
                        <span className="text-[11px] font-bold text-foreground uppercase tracking-wider block mb-1">
                          Key Test Route Challenges &amp; Hazards:
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {tc.keyRoutesDescription}
                        </p>
                      </div>
                    </div>

                    {/* Stats Card */}
                    <div className="shrink-0 w-full md:w-56 rounded-2xl bg-surface-secondary/80 p-5 border border-border flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Recent Pass Rate
                        </span>
                        <span className="text-3xl font-extrabold text-success font-mono block mt-0.5">
                          {tc.passRateRecent}
                        </span>
                        <span className="text-[10px] text-muted-foreground mt-1 block">
                          Based on recent DVSA publishing
                        </span>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/80">
                        {tc.associatedLocationSlug && (
                          <Link
                            href={`/locations/${tc.associatedLocationSlug}`}
                            className="text-xs font-bold text-primary hover:underline block mb-2"
                          >
                            Explore Area Lessons →
                          </Link>
                        )}
                        <Link
                          href={`/contact?testCentre=${encodeURIComponent(tc.name)}`}
                          className="w-full rounded-xl bg-primary text-primary-foreground py-2 text-center text-xs font-bold block hover:bg-primary/90 transition shadow-xs"
                        >
                          Book Route Rehearsal
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mock Test Simulation Banner */}
        <section className="py-16 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-primary/20 bg-card p-8 md:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>NextDrive 40-Minute Mock Test Rehearsal</span>
                </div>
                <h3 className="text-2xl font-extrabold text-foreground">
                  Test Day Car Hire &amp; Mock Exam Simulation
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Drive the exact 40-minute test route under realistic exam conditions. Receive formal DVSA feedback, fault identification, and dual-control car hire for your official test day.
                </p>
              </div>

              <div className="shrink-0">
                <Link
                  href="/contact?course=mock_exam"
                  className="rounded-xl bg-primary text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-md hover:bg-primary/90 transition block text-center"
                >
                  Book Test Day Package
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
