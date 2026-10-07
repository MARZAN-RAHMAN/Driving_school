import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Car,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Phone,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CoursePackagesSection } from "@/components/home/CoursePackagesSection";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { db } from "@/lib/db";
import { getPageMetadata, getCourseSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/driving-lessons", {
    title: "Driving Lessons Manchester | Manual & Automatic | NextDrive",
    description:
      "Professional 1-to-1 driving lessons across Manchester and Greater Manchester. Grade A DVSA certified instructors with high pass rates. Book assessment lesson.",
  });
}

export default async function DrivingLessonsPage() {
  const [settings, packages, instructors, locations, faqs, pageSeo] = await Promise.all([
    db.getBusinessSettings(),
    db.getLessonPackages(),
    db.getInstructors(),
    db.getLocations(true),
    db.getFaqs("General", true),
    db.getPageSEO("/driving-lessons"),
  ]);

  const assessmentPrice = Math.round(settings.hourlyRateManual * 2);
  const primaryCourse = packages[0];
  const courseSchema = primaryCourse ? getCourseSchema(primaryCourse, settings) : null;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
        />
      )}
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Top Breadcrumb Bar */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Driving Lessons", href: "/driving-lessons" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>DVSA Certified Grade A Instructors</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">Manchester &amp; Greater Manchester</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              {pageSeo?.h1 || "Professional Driving Lessons Across Greater Manchester"}
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Master the road with calm, structured, and modern 1-to-1 driving tuition. Dual-control manual and automatic vehicles available with fast-track practical test route training.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg hover:bg-primary/90 transition shadow-primary/25"
              >
                <span>Book 2-Hr Assessment (£{assessmentPrice})</span>
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

            {/* Trust badges */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-3xl mx-auto pt-8 border-t border-border/60 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">DVSA Grade A</div>
                  <div className="text-[11px] text-muted-foreground">Certified Instructors</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10 text-success shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">89.4% Pass Rate</div>
                  <div className="text-[11px] text-muted-foreground">First-Time Average</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Dual-Control Fleet</div>
                  <div className="text-[11px] text-muted-foreground">Manual &amp; Automatic</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Local Coverage</div>
                  <div className="text-[11px] text-muted-foreground">Door-to-Door Pickup</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transmission Choice: Manual vs Automatic */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="CHOOSE YOUR PATH"
              icon={<Car className="w-3.5 h-3.5" />}
              title="Manual &amp; Automatic"
              titleHighlight="Tuition Options"
              subtitle="Tailored lesson plans designed around your learning pace, vehicle preference, and practical test goals."
            />

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-5xl mx-auto">
              {/* Manual Lessons Card */}
              <div className="rounded-3xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 mb-4">
                    <span>Full UK Driving Licence</span>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">Manual Driving Lessons</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Learn complete clutch control, hill starts, and smooth gear transitions. Qualifying in a manual vehicle allows you to drive both manual and automatic cars across the UK and internationally.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-foreground/90 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>Clutch bite-point mastery and stall prevention</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>Eco-driving gear selection and engine braking</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>From £{settings.hourlyRateManual.toFixed(2)}/hour with block discounts</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">High Fleet Availability</span>
                  <Link
                    href="/contact?transmission=MANUAL"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Enquire for Manual</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Automatic Lessons Card */}
              <div className="rounded-3xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400 mb-4">
                    <span>Smoother, Faster Progression</span>
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground">Automatic Driving Lessons</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    No clutch pedals and no risk of stalling. Focus 100% on road positioning, junction anticipation, hazard perception, and complex Manchester roundabouts with effortless ease.
                  </p>
                  <ul className="mt-6 space-y-2.5 text-xs text-foreground/90 font-medium">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>Zero clutch coordination fatigue in heavy urban traffic</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>Ideal for nervous learners or learners requiring faster pass</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      <span>From £{settings.hourlyRateAutomatic.toFixed(2)}/hour with modern hybrid cars</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">High Demand Service</span>
                  <Link
                    href="/contact?transmission=AUTOMATIC"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <span>Enquire for Automatic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tuition Packages & Course Pricing */}
        <CoursePackagesSection packages={packages} />

        {/* Local Service Areas Hub Linking */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="LOCAL SERVICE AREAS"
              icon={<MapPin className="w-3.5 h-3.5" />}
              title="Where We Teach in"
              titleHighlight="Greater Manchester"
              subtitle="Door-to-door home, workplace, or college pickup across all major Manchester districts and DVSA test centres."
            />

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((loc) => (
                <Link
                  key={loc.id}
                  href={`/locations/${loc.slug || "central-north-manchester"}`}
                  className="group rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-card-foreground group-hover:text-primary transition-colors text-base">
                        {loc.name}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                        {loc.activeInstructors} Instructors
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {loc.description || `Door-to-door driving tuition and practical test training in ${loc.name}.`}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {loc.postcodes.slice(0, 4).map((pc) => (
                        <span key={pc} className="text-[10px] bg-surface-secondary px-2 py-0.5 rounded font-mono text-muted-foreground">
                          {pc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-border flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Target Test Centre: {loc.testCenterName}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Related Service Links */}
            <div className="mt-12 rounded-2xl border border-border bg-surface-secondary/40 p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-foreground text-sm">Need faster completion?</h5>
                <p className="text-xs text-muted-foreground">Explore our 1 to 3 week intensive driving crash courses.</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/intensive-courses"
                  className="rounded-xl bg-card border border-border px-4 py-2 text-xs font-bold text-foreground hover:border-primary transition"
                >
                  Intensive Driving Courses →
                </Link>
                <Link
                  href="/test-centres"
                  className="rounded-xl bg-card border border-border px-4 py-2 text-xs font-bold text-foreground hover:border-primary transition"
                >
                  Test Centres Guide →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 lg:py-24 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="COMMON QUESTIONS"
              title="Driving Lessons"
              titleHighlight="Frequently Asked Questions"
              subtitle="Answers to common queries regarding lesson bookings, licence requirements, and test preparation."
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
