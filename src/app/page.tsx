/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import {
  Star,
  CheckCircle2,
  MapPin,
  Phone,
  ArrowRight,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookLessonButton } from "@/components/booking/BookLessonButton";
import { InstructorsCarousel } from "@/components/instructor/InstructorsCarousel";
import { NextDriveMethod } from "@/components/home/NextDriveMethod";
import { HeroSection } from "@/components/home/HeroSection";
import { CoursePackagesSection } from "@/components/home/CoursePackagesSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FaqAccordion } from "@/components/home/FaqAccordion";
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
      desc: "T-junctions, cross-roads, box junctions, traffic lights, and complex multi-lane roundabouts.",
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
        {/* 1. HERO SECTION (Automotive, Futuristic, Premium Manchester Driving Academy) */}
        {/* ========================================================================= */}
        <HeroSection settings={settings} assessmentPrice={assessmentPrice} />

        {/* ========================================================================= */}
        {/* 2. TUITION PACKAGES & PRICING SECTION (#courses) */}
        {/* ========================================================================= */}
        <CoursePackagesSection packages={packages} />

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
        {/* 4. INSTRUCTORS FLEET SPOTLIGHT (#instructors) */}
        {/* ========================================================================= */}
        <section id="instructors" className="py-20 lg:py-28 bg-surface-secondary/40 border-b border-border overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <InstructorsCarousel instructors={instructors} />
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. COVERAGE & TEST CENTERS (#locations) */}
        {/* ========================================================================= */}
        <section id="locations" className="py-20 lg:py-28 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Manchester Coverage
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Designated DVSA Driving Test Centers
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We conduct intensive tuition directly on the official published test routes of your target test center.
              </p>
            </ScrollReveal>

            <div className="mt-14 sm:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {locations.map((loc, idx) => (
                <ScrollReveal
                  key={loc.id}
                  animation="fade-up"
                  delay={idx * 75}
                  className="h-full"
                >
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-card-foreground h-full">
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
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. VERIFIED STUDENT PASS STORIES (#reviews) */}
        {/* ========================================================================= */}
        <section id="reviews" className="py-20 lg:py-28 bg-surface-secondary/40 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Verified Test Results
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Recent Student Pass Stories
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Over 500 learners have earned their full UK driving license with {settings.businessName.split(" ")[0] || "NextDrive"}.
              </p>
            </ScrollReveal>

            <div className="mt-14 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {reviews.slice(0, 3).map((p, idx) => (
                <ScrollReveal
                  key={p.id}
                  animation="fade-up"
                  delay={idx * 90}
                  className="h-full"
                >
                  <div className="rounded-2xl border border-border bg-card p-7 shadow-xs hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between text-card-foreground h-full">
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
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. FREQUENTLY ASKED QUESTIONS (#faqs) */}
        {/* ========================================================================= */}
        <section id="faqs" className="py-20 lg:py-28 border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up" className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                FAQ
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Everything you need to know about starting driving lessons, test bookings, and pricing.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={120} className="mt-12 sm:mt-14 max-w-3xl mx-auto">
              <FaqAccordion faqs={faqs} />
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. MINIMALIST HIGH-IMPACT CALL TO ACTION (#contact) */}
        {/* ========================================================================= */}
        <section id="contact" className="relative py-20 lg:py-28 bg-card border-b border-border text-card-foreground overflow-hidden">
          {/* Ambient background glow */}
          <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20" aria-hidden="true">
            <div className="h-[350px] w-[600px] rounded-full bg-primary/20 blur-[130px]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal animation="fade-up">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/20">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>START YOUR JOURNEY</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-foreground">
                Ready to Get Behind the Wheel?
              </h2>
              <p className="mt-4 text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Book your introductory 2-hour assessment lesson today with our Grade A certified instructors across Manchester and begin your journey to a full UK driving license.
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

              {/* High-trust proof badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Grade A DVSA Instructors
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Dual-Control Modern Fleet
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  Door-to-Door Manchester Pickup
                </span>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. ENGINEERING SPECIFICATIONS & ARCHITECTURE STATUS (Preserved) */}
        {/* ========================================================================= */}
        <section id="architecture" className="py-12 bg-surface-secondary/60 border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade">
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
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
