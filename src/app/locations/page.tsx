import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, Navigation, ArrowRight, ShieldCheck, Car, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ServiceLocationsMap } from "@/components/home/ServiceLocationsMap";
import { db } from "@/lib/db";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/locations", {
    title: "Manchester Driving Lesson Service Locations | NextDrive",
    description:
      "Explore NextDrive active service areas across Greater Manchester: Central Manchester, Didsbury, Sale, Trafford, Salford, Stockport, and Bury.",
  });
}

export default async function LocationsHubPage() {
  const [settings, locations, packages, testCentres] = await Promise.all([
    db.getBusinessSettings(),
    db.getLocations(true),
    db.getLessonPackages(),
    db.getLocalTestCentres(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Service Locations", href: "/locations" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Door-to-Door Pickup Across Greater Manchester</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              Driving Tuition Service Areas in Greater Manchester
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find Grade A driving tuition in your local neighborhood. We offer manual and automatic driving lessons with dedicated test centre preparation.
            </p>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-16 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="COVERAGE MAP"
              icon={<Navigation className="w-3.5 h-3.5" />}
              title="Interactive Manchester"
              titleHighlight="Service Locations"
              subtitle="Click on any region marker to view postcodes, instructors, and associated test centres."
            />

            <div className="mt-10">
              <ServiceLocationsMap locations={locations} />
            </div>
          </div>
        </section>

        {/* Locations Directory List */}
        <section className="py-16 lg:py-24 bg-surface-secondary/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="REGIONAL HUBS"
              title="Browse by"
              titleHighlight="Local Borough &amp; District"
              subtitle="Each location hub features localized route rehearsals, local instructor pairings, and test preparation."
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {locations.map((loc) => {
                const matchedTc = testCentres.find(
                  (tc) => tc.associatedLocationSlug === loc.slug || tc.name === loc.testCenterName
                );

                return (
                  <div
                    key={loc.id}
                    className="rounded-3xl border border-border bg-card p-7 shadow-xs hover:border-primary/50 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-card-foreground">{loc.name}</h3>
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary font-mono">
                          {loc.activeInstructors} Instructors
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                        {loc.description ||
                          `Professional manual and automatic driving lessons covering ${loc.name} and surrounding postcodes.`}
                      </p>

                      <div className="mt-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Postcodes Covered:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {loc.postcodes.map((pc) => (
                            <span
                              key={pc}
                              className="rounded bg-surface-secondary px-2 py-0.5 text-[11px] font-mono text-foreground font-semibold"
                            >
                              {pc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {matchedTc && (
                        <div className="mt-4 rounded-xl bg-surface-secondary/60 p-3 text-xs">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold block">
                            Assigned Test Centre:
                          </span>
                          <span className="font-bold text-foreground block mt-0.5">
                            {matchedTc.name}
                          </span>
                          <span className="text-[11px] text-success font-semibold">
                            Recent pass rate: {matchedTc.passRateRecent}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                      <Link
                        href={`/locations/${loc.slug || "central-north-manchester"}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <span>View Location Hub</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/contact?area=${encodeURIComponent(loc.name)}`}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Book Lesson
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
