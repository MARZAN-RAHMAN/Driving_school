/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  Zap,
  ExternalLink,
  ChevronRight,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookLessonButton } from "@/components/booking/BookLessonButton";
import { InstructorsCarousel } from "@/components/instructor/InstructorsCarousel";
import { NextDriveMethod } from "@/components/home/NextDriveMethod";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [packages, instructors, locations, settings, reviews, faqs] = await Promise.all([
    db.getLessonPackages(),
    db.getInstructors(),
    db.getLocations(),
    db.getBusinessSettings(),
    db.getReviews(),
    db.getFaqs(),
  ]);

  const syllabusSteps = [
    {
      step: "01",
      title: "Cockpit Drill & Car Controls",
      desc: "Mastering mirror checks, foot pedals, clutch bite-point control, and safe moving off and stopping.",
    },
    {
      step: "02",
      title: "Junctions & Roundabouts",
      desc: "T-junctions, cross-roads, box junctions, traffic lights, and complex multi-lane London roundabouts.",
    },
    {
      step: "03",
      title: "Maneuvers & Independent Driving",
      desc: "Parallel bay parking, reverse parking into a bay, pulling up on the right, and sat-nav navigation.",
    },
    {
      step: "04",
      title: "Dual Carriageways & Hazard Perception",
      desc: "Merging at speed, safe following distances, mirror-signal-maneuver routine, and anticipatory road safety.",
    },
    {
      step: "05",
      title: "Official DVSA Mock Test Simulation",
      desc: "Full 40-minute driving test rehearsal on published test center routes with formal fault marking.",
    },
  ];

  const assessmentPrice = Math.round(settings.hourlyRateManual * 2);
  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (Minimalist, Spacious, Premium, Light/Dark) */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-28 lg:pb-32 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-8">
                <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
                <span>{settings.heroBadge || "DVSA Approved Driving Academy"}</span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-primary font-bold">
                  {settings.heroPassRateBadge || `${settings.firstTimePassRate || "89.4%"} Practical Pass Rate`}
                </span>
              </div>

              {/* Grand Minimalist Headline */}
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.08]">
                {settings.heroHeadline || "Master the Road. Pass First Time in London."}
              </h1>

              {/* Crisp Subhead */}
              <p className="mt-6 sm:mt-8 text-base text-muted-foreground sm:text-xl sm:leading-relaxed max-w-2xl mx-auto font-normal">
                {settings.heroSubhead || "Premier manual and automatic driving tuition with certified Grade A ADI instructors, dual-control modern vehicles, and guaranteed test route mastery."}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row">
                <BookLessonButton
                  course="Introductory 2-Hour Assessment"
                  source="hero"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover sm:w-auto cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  {settings.heroPrimaryCtaText || "Book Assessment Lesson"} (£{assessmentPrice})
                  <ArrowRight className="h-4 w-4" />
                </BookLessonButton>

                <a
                  href={phoneHref}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-7 py-4 text-sm font-semibold text-foreground shadow-xs transition hover:bg-muted sm:w-auto"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {settings.heroSecondaryCtaText || "Call"}: {settings.phone}
                </a>
              </div>

              {/* Key Trust Stats */}
              <div className="mt-14 sm:mt-16 grid grid-cols-2 gap-4 border-t border-border pt-8 sm:pt-10 sm:grid-cols-4 text-left sm:text-center">
                <div className="p-3">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                    {settings.firstTimePassRate || "89.4%"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground font-medium">
                    First-Time Pass Rate (vs 48.2% UK avg)
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                    {settings.totalPassesCount || "500+"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground font-medium">
                    Verified London Passes Recorded
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                    {settings.activeFleetCount || "12"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground font-medium">
                    Dual-Control Fleet Vehicles
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                    {settings.googleRating || "4.9 ★"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground font-medium">
                    Google &amp; Trustpilot Student Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. TUITION PACKAGES & PRICING SECTION (#courses) */}
        {/* ========================================================================= */}
        <section id="courses" className="py-20 lg:py-28 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Transparent Tuition
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Structured Course Packages &amp; Pricing
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Zero hidden surcharges. All courses include door-to-door learner pickup, full insurance, and official DVSA test route preparation.
              </p>
            </div>

            <div className="mt-14 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between rounded-2xl bg-card text-card-foreground p-7 shadow-xs transition hover:shadow-md border ${
                    pkg.popular
                      ? "border-primary ring-1 ring-primary"
                      : "border-border"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
                      <Zap className="h-3 w-3 fill-current text-primary-foreground" />
                      Most Popular
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-foreground">
                        {pkg.level}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground font-mono">
                        {pkg.durationHours} Hours Instruction
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-foreground">{pkg.title}</h3>

                    <div className="mt-5 flex items-baseline gap-1.5 pb-5 border-b border-border">
                      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
                        £{pkg.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        (£{(pkg.price / pkg.durationHours).toFixed(2)}/hr)
                      </span>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-muted-foreground">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-5 border-t border-border">
                    <BookLessonButton
                      course={pkg.title}
                      source="pricing-package"
                      className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition cursor-pointer ${
                        pkg.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs"
                          : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                      }`}
                    >
                      Book Course Package
                      <ChevronRight className="h-3.5 w-3.5" />
                    </BookLessonButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. SYLLABUS & PROGRESSION (#curriculum) */}
        {/* ========================================================================= */}
        <section id="curriculum" className="relative py-20 lg:py-28 border-b border-border bg-background overflow-hidden">
          {/* Subtle ambient glow behind central content */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-40 dark:opacity-20" aria-hidden="true">
            <div className="h-[400px] w-[700px] rounded-full bg-primary/10 blur-[120px]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <NextDriveMethod
              businessName={settings.businessName.split(" ")[0] || "NextDrive"}
              steps={syllabusSteps}
            />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 4. INSTRUCTORS FLEET SPOTLIGHT (#instructors) */}
        {/* ========================================================================= */}
        <section id="instructors" className="py-20 lg:py-28 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <InstructorsCarousel instructors={instructors} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. COVERAGE & TEST CENTERS (#locations) */}
        {/* ========================================================================= */}
        <section id="locations" className="py-20 lg:py-28 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                London Coverage
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Designated DVSA Driving Test Centers
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We conduct intensive tuition directly on the official published test routes of your target test center.
              </p>
            </div>

            <div className="mt-14 sm:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between text-card-foreground"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-bold text-card-foreground">{loc.name}</h3>
                    </div>

                    <div className="mt-3 rounded-xl bg-surface-secondary/70 p-3">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        Test Center
                      </span>
                      <span className="text-xs font-semibold text-foreground mt-0.5 block">
                        🎯 {loc.testCenterName}
                      </span>
                    </div>

                    <div className="mt-4">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1.5">
                        Postcodes Covered
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {loc.postcodes.map((pc) => (
                          <span
                            key={pc}
                            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] font-semibold text-foreground"
                          >
                            {pc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-border text-[11px] text-muted-foreground">
                    {loc.activeInstructors} active ADI instructors on duty
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. VERIFIED STUDENT PASS STORIES (#reviews) */}
        {/* ========================================================================= */}
        <section id="reviews" className="py-20 lg:py-28 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Verified Test Results
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Recent Student Pass Stories
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Over 500 learners have earned their full UK driving license with {settings.businessName.split(" ")[0] || "NextDrive"}.
              </p>
            </div>

            <div className="mt-14 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {reviews.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-border bg-card p-7 shadow-xs flex flex-col justify-between text-card-foreground"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-bold text-success border border-success/20">
                        {p.result}
                      </span>
                      <span className="text-xs text-muted-foreground">{p.date}</span>
                    </div>

                    <div className="mt-4 flex items-center gap-1">
                      {[...Array(p.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="mt-3 text-xs text-foreground/90 leading-relaxed italic">
                      &quot;{p.quote}&quot;
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-card-foreground">{p.student}</div>
                        <div className="text-[11px] text-muted-foreground">Instructor: {p.instructor}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-primary block">
                          🎯 {p.testCenter}
                        </span>
                        <span className="text-[10px] text-success font-mono font-medium">
                          {p.minors}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FREQUENTLY ASKED QUESTIONS (#faqs) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-20 lg:py-28 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                FAQ
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Everything you need to know about starting driving lessons, test bookings, and pricing.
              </p>
            </div>

            <div className="mt-12 sm:mt-14 max-w-3xl mx-auto space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground">
                  <h3 className="text-sm font-bold text-card-foreground">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. MINIMALIST HIGH-IMPACT CALL TO ACTION */}
        {/* ========================================================================= */}
        <section className="py-20 lg:py-28 bg-card border-b border-border text-card-foreground">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              Ready to Get Behind the Wheel?
            </h2>
            <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto">
              Book your introductory 2-hour assessment lesson today with our Grade A certified instructors and begin your journey to a full UK driving license.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
              <BookLessonButton
                course="Introductory 2-Hour Assessment"
                source="bottom-cta"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover sm:w-auto cursor-pointer"
              >
                Book Assessment Lesson (£{assessmentPrice})
                <ArrowRight className="h-4 w-4" />
              </BookLessonButton>
              <a
                href={phoneHref}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface-secondary px-7 py-4 text-sm font-semibold text-foreground shadow-xs transition hover:bg-muted sm:w-auto"
              >
                <Phone className="h-4 w-4 text-primary" />
                Call Hotline: {settings.phone}
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. ENGINEERING SPECIFICATIONS & ARCHITECTURE STATUS (Preserved) */}
        {/* ========================================================================= */}
        <section id="architecture" className="py-12 bg-surface-secondary/60 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Full-Stack Architecture &amp; System Telemetry
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Next.js App Router • Prisma PostgreSQL Models • HMAC Edge RBAC • Zero TypeScript Errors
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors"
                >
                  Admin Dashboard
                </Link>
                <Link
                  href="/api/health"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition-colors"
                >
                  Live Health API
                  <ExternalLink className="h-3 w-3" />
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
