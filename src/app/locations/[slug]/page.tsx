import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import {
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Star,
  Car,
  Zap,
  Phone,
  ArrowRight,
  Navigation,
  FileCheck,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { db } from "@/lib/db";
import { getPageMetadata, getLocalBusinessSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface LocationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await db.getLocationBySlug(slug);

  if (!location) {
    return { title: "Location Not Found | NextDrive" };
  }

  return getPageMetadata(`/locations/${slug}`, {
    title: `Driving Lessons in ${location.name} | NextDrive Academy`,
    description: `DVSA Grade A driving lessons across ${location.name} (${location.postcodes.join(", ")}). Manual & automatic dual-control vehicles with high pass rates.`,
  });
}

export default async function LocationDetailPage({ params }: LocationPageProps) {
  const { slug } = await params;

  const [location, allLocations, settings, instructors, testCentres, packages, pageSeo] =
    await Promise.all([
      db.getLocationBySlug(slug),
      db.getLocations(true),
      db.getBusinessSettings(),
      db.getInstructors(),
      db.getLocalTestCentres(),
      db.getLessonPackages(),
      db.getPageSEO(`/locations/${slug}`),
    ]);

  if (!location) {
    notFound();
  }

  const localTestCentre = testCentres.find(
    (tc) =>
      tc.associatedLocationSlug === slug ||
      tc.name.toLowerCase() === (location.testCenterName || "").toLowerCase()
  );

  const localInstructors = instructors.filter((inst) => {
    if (inst.status !== "ACTIVE") return false;
    const areas = inst.areasCovered || inst.areas || [];
    return (
      areas.some(
        (a: string) =>
          a.toLowerCase().includes(location.name.toLowerCase()) ||
          location.name.toLowerCase().includes(a.toLowerCase())
      ) ||
      areas.includes("All Manchester") ||
      areas.includes("Greater Manchester")
    );
  });

  const localBusinessSchema = getLocalBusinessSchema(location, settings, testCentres);

  const localFaqs = [
    {
      id: "loc_faq_1",
      question: `Do you provide door-to-door driving lesson pickup in ${location.name}?`,
      answer: `Yes, 100% of driving lessons in ${location.name} include free door-to-door home, workplace, or college pickup and drop-off across ${location.postcodes.join(", ")}.`,
      category: "Local",
      order: 1,
      status: "ACTIVE" as const,
      helpfulVotes: 24,
      createdAt: "2026-10-01",
    },
    {
      id: "loc_faq_2",
      question: `Which DVSA driving test centre will I use for my test in ${location.name}?`,
      answer: localTestCentre
        ? `Learners in ${location.name} typically take their practical driving test at ${localTestCentre.name} (${localTestCentre.postcode}). Your NextDrive instructor will rehearse all published local test routes with you beforehand.`
        : `Learners in ${location.name} usually take their practical test at their nearest Manchester DVSA test hub, with comprehensive mock test rehearsals.`,
      category: "Local",
      order: 2,
      status: "ACTIVE" as const,
      helpfulVotes: 19,
      createdAt: "2026-10-01",
    },
    {
      id: "loc_faq_3",
      question: `Are automatic driving lessons available in ${location.name}?`,
      answer: `Yes, we have certified automatic and manual Grade A driving instructors covering ${location.name}. Both options feature dual-control vehicles and structured syllabus tracking.`,
      category: "Local",
      order: 3,
      status: "ACTIVE" as const,
      helpfulVotes: 15,
      createdAt: "2026-10-01",
    },
  ];

  const nearbyLocations = allLocations.filter((l) => l.id !== location.id).slice(0, 3);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Service Locations", href: "/locations" },
                { label: location.name, href: `/locations/${slug}` },
              ]}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>Door-to-Door Tuition in {location.name}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold font-mono">
                {location.postcodes.join(", ")}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              {pageSeo?.h1 || `Driving Tuition in ${location.name}`}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {location.description ||
                `Pass your practical driving test with calm, patient Grade A instructors in ${location.name}. Comprehensive manual and automatic tuition with local test route mastery.`}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`/contact?area=${encodeURIComponent(location.name)}`}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition shadow-primary/25"
              >
                <span>Book First Lesson in {location.name}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground hover:bg-surface-secondary transition"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>Call {settings.phone}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Local Test Centre Spotlight */}
        {localTestCentre && (
          <section className="py-12 bg-background border-b border-border">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary mb-2">
                    <Navigation className="w-3 h-3" />
                    <span>Designated DVSA Test Hub</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{localTestCentre.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {localTestCentre.address}, {localTestCentre.postcode}
                  </p>
                  <p className="mt-3 text-xs text-foreground/90 max-w-xl leading-relaxed">
                    {localTestCentre.keyRoutesDescription}
                  </p>
                </div>

                <div className="shrink-0 text-left md:text-right border-t md:border-t-0 md:border-l border-primary/20 pt-4 md:pt-0 md:pl-6">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Recent Pass Rate
                  </span>
                  <span className="text-3xl font-extrabold text-success font-mono block">
                    {localTestCentre.passRateRecent}
                  </span>
                  <span className="text-[11px] text-muted-foreground block mt-1">
                    DVSA Centre #{localTestCentre.dvsaCentreId}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Local Instructors Spotlight */}
        <section className="py-16 lg:py-24 bg-surface-secondary/30 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="LOCAL FLEET"
              title={`Driving Instructors Serving`}
              titleHighlight={location.name}
              subtitle={`DVSA Grade A certified instructors providing door-to-door service across ${location.name}.`}
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(localInstructors.length > 0 ? localInstructors : instructors.slice(0, 3)).map(
                (inst) => (
                  <div
                    key={inst.id}
                    className="rounded-3xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border">
                          <Image
                            src={inst.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop"}
                            alt={inst.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-card-foreground text-sm">{inst.name}</h4>
                          <span className="text-[11px] text-primary font-mono font-bold block">
                            {inst.grade} Instructor
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {inst.transmission} Tuition
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 text-xs text-muted-foreground line-clamp-2">{inst.bio}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-success">
                        {inst.passRate || `${inst.totalPasses}+ Passes`}
                      </span>
                      <Link
                        href={`/contact?instructor=${encodeURIComponent(inst.name)}&area=${encodeURIComponent(location.name)}`}
                        className="rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground text-primary px-3 py-1.5 text-xs font-bold transition"
                      >
                        Book Lesson
                      </Link>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Local Area FAQs */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="LOCAL ADVICE"
              title={`${location.name} Tuition`}
              titleHighlight="Frequently Asked Questions"
              subtitle={`Everything you need to know about taking driving lessons in ${location.name}.`}
            />
            <div className="mt-10">
              <FaqAccordion faqs={localFaqs} />
            </div>
          </div>
        </section>

        {/* Nearby Service Areas Linking (prevents orphan pages) */}
        <section className="py-12 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Explore Other Greater Manchester Service Areas:
            </h4>
            <div className="flex flex-wrap gap-3">
              {nearbyLocations.map((nearby) => (
                <Link
                  key={nearby.id}
                  href={`/locations/${nearby.slug || "central-north-manchester"}`}
                  className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:border-primary transition"
                >
                  Driving Lessons {nearby.name} →
                </Link>
              ))}
              <Link
                href="/locations"
                className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition"
              >
                View All Service Locations →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={allLocations} />
    </div>
  );
}
