import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Award,
  ShieldCheck,
  Star,
  MapPin,
  Car,
  CheckCircle2,
  Calendar,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { db } from "@/lib/db";
import { getPageMetadata, getInstructorSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/instructors", {
    title: "DVSA Grade A Driving Instructors Manchester | NextDrive",
    description:
      "Get to know our certified male and female driving instructors across Manchester. High first-time pass rates, friendly tuition, and modern dual-control cars.",
  });
}

export default async function InstructorsPage() {
  const [settings, instructors, packages, locations, pageSeo] = await Promise.all([
    db.getBusinessSettings(),
    db.getInstructors(),
    db.getLessonPackages(),
    db.getLocations(true),
    db.getPageSEO("/instructors"),
  ]);

  const activeInstructors = instructors.filter((inst) => inst.status === "ACTIVE");
  const instructorSchemas = activeInstructors.map((inst) => getInstructorSchema(inst, settings));

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(instructorSchemas) }}
      />
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Instructors", href: "/instructors" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span>Certified DVSA Approved Driving Instructors (ADI)</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              {pageSeo?.h1 || "Certified DVSA Grade A Driving Instructors"}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Patient, friendly, and fully DBS-checked instructors dedicated to coaching confident, test-ready drivers. Both male and female instructors available across Greater Manchester.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition shadow-primary/25"
              >
                <span>Request Instructor Matching</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Instructor Profiles Grid */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="OUR TEAM"
              title="Meet Our Certified"
              titleHighlight="Teaching Staff"
              subtitle="Find an instructor covering your Manchester postcode with availability in your preferred vehicle type."
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeInstructors.map((inst) => (
                <div
                  key={inst.id}
                  className="rounded-3xl border border-border bg-card p-7 shadow-xs hover:border-primary/50 transition flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Avatar & Badges */}
                    <div className="flex items-start gap-4">
                      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 border-border shadow-xs">
                        <Image
                          src={inst.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"}
                          alt={inst.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-card-foreground truncate">
                            {inst.name}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary font-mono">
                            {inst.grade}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-xs text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{inst.rating || 5.0}</span>
                          <span className="text-muted-foreground font-normal">
                            ({inst.totalStudentsTrained || 80}+ students passed)
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground font-mono">
                          DVSA Badge: {inst.badgeNumber}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {inst.bio || "Experienced DVSA certified driving instructor with patient, student-first coaching."}
                    </p>

                    {/* Stats pills */}
                    <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-surface-secondary/70 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Pass Rate
                        </span>
                        <span className="font-extrabold text-foreground font-mono">
                          {inst.passRate || "90.2%"}
                        </span>
                      </div>
                      <div className="rounded-xl bg-surface-secondary/70 p-2.5">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                          Transmission
                        </span>
                        <span className="font-extrabold text-foreground">
                          {inst.transmission}
                        </span>
                      </div>
                    </div>

                    {/* Areas covered */}
                    <div className="mt-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                        Service Areas Covered:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {(inst.areasCovered || inst.areas || []).map((a: string) => (
                          <span
                            key={a}
                            className="rounded-md bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-foreground"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border">
                    <Link
                      href={`/contact?instructor=${encodeURIComponent(inst.name)}`}
                      className="w-full rounded-xl bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary py-2.5 text-center text-xs font-bold block transition"
                    >
                      Book With {inst.name.split(" ")[0]}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
