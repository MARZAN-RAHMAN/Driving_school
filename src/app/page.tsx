import React from "react";
import {
  Star,
  CheckCircle2,
  MapPin,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InstructorsCarousel } from "@/components/instructor/InstructorsCarousel";
import { NextDriveMethod } from "@/components/home/NextDriveMethod";
import { HeroSection } from "@/components/home/HeroSection";
import { CoursePackagesSection } from "@/components/home/CoursePackagesSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceLocationsMap } from "@/components/home/ServiceLocationsMap";
import { VisitorBookingPopupTrigger } from "@/components/booking/VisitorBookingPopupTrigger";
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
          <AmbientHalo position="center" variant="primary" size="xl" />

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
        <section id="instructors" className="relative py-20 lg:py-28 bg-surface-secondary/40 border-b border-border overflow-hidden">
          <AmbientHalo position="top-right" variant="secondary" size="lg" />
          <AmbientHalo position="bottom-left" variant="primary" size="lg" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal animation="fade-up">
              <InstructorsCarousel instructors={instructors} />
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. COVERAGE & TEST CENTERS (#locations) */}
        {/* ========================================================================= */}
        <section id="locations" className="relative py-20 lg:py-28 border-b border-border bg-background overflow-hidden">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="MANCHESTER COVERAGE"
              icon={<MapPin className="w-3.5 h-3.5" />}
              title="Interactive Service"
              titleHighlight="Locations & Test Centers"
              subtitle="Explore our active Greater Manchester coverage zones, designated DVSA test hubs, and live instructor dispatch."
            />

            <div className="mt-10 sm:mt-14">
              <ScrollReveal animation="fade-up">
                <ServiceLocationsMap locations={locations} />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. VERIFIED STUDENT PASS STORIES (#reviews) */}
        {/* ========================================================================= */}
        <section id="reviews" className="relative py-20 lg:py-28 bg-surface-secondary/40 border-b border-border overflow-hidden">
          <AmbientHalo position="center" variant="tricolor" size="lg" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="VERIFIED TEST RESULTS"
              icon={<Award className="w-3.5 h-3.5" />}
              title="Recent Student"
              titleHighlight="Pass Stories"
              subtitle={`Over 500 learners have earned their full UK driving licence with ${settings.businessName.split(" ")[0] || "NextDrive"}.`}
            />

            <div className="mt-12 sm:mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
              {reviews.slice(0, 3).map((p, idx) => (
                <ScrollReveal
                  key={p.id}
                  animation="fade-up"
                  delay={idx * 90}
                  className="h-full"
                >
                  <div className="relative rounded-2xl border border-border bg-card p-7 shadow-xs card-interactive flex flex-col justify-between text-card-foreground h-full overflow-hidden group">
                    {/* Top ambient highlight on hover */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success via-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-hidden="true"
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-0.5 text-[10px] font-bold text-success border border-success/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{p.result}</span>
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{p.date}</span>
                      </div>

                      <div className="mt-4 flex items-center gap-1">
                        {[...Array(p.rating || 5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>

                      <p className="mt-3.5 text-xs text-foreground/90 leading-relaxed italic">
                        &quot;{p.quote}&quot;
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-card-foreground group-hover:text-primary transition-colors">
                            {p.student}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Instructor: {p.instructor}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-primary block">
                            🎯 {p.testCenter}
                          </span>
                          <span className="text-[10px] text-success font-mono font-bold">
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
        <section id="faqs" className="relative py-20 lg:py-28 border-b border-border bg-background overflow-hidden">
          <AmbientHalo position="center" variant="primary" size="lg" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="FAQ &amp; ADVICE"
              title="Frequently Asked"
              titleHighlight="Questions"
              subtitle="Everything you need to know about starting driving lessons, test bookings, and pricing."
            />

            <ScrollReveal animation="fade-up" delay={120} className="mt-12 sm:mt-14 max-w-3xl mx-auto">
              <FaqAccordion faqs={faqs} />
            </ScrollReveal>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. PREMIUM FINAL CALL TO ACTION (#contact) */}
        {/* ========================================================================= */}
        <FinalCtaSection
          phone={settings.phone}
          phoneHref={phoneHref}
          assessmentPrice={assessmentPrice}
        />

        {/* Timed visitor booking popup trigger (fires once per session after 10s) */}
        <VisitorBookingPopupTrigger delayMs={10000} />
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
