"use client";

import React from "react";
import {
  MapPin,
  Car,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Route,
  Sparkles,
} from "lucide-react";
import { BusinessSettings } from "@/types";
import { BookLessonButton } from "@/components/booking/BookLessonButton";

interface HeroSectionProps {
  settings: BusinessSettings;
  assessmentPrice?: number;
}

export function HeroSection({ settings, assessmentPrice = 75 }: HeroSectionProps) {
  const phone = settings.phone || "+44 20 7946 0921";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const heroImage =
    settings.heroImageUrl ||
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&fit=crop";

  return (
    <section className="relative overflow-hidden pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-border bg-background transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. FUTURISTIC AMBIENT BACKGROUND GLOWS */}
      {/* ========================================================================= */}
      {/* Soft Purple Glow Behind Right Column */}
      <div
        className="pointer-events-none absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] lg:w-[650px] rounded-full bg-primary/15 blur-[130px] opacity-70 dark:opacity-40"
        aria-hidden="true"
      />
      {/* Subtle Central Radial Highlight */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/2 -translate-y-1/2 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[100px] opacity-50 dark:opacity-20"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 2. MAIN CONTAINER & TWO-COLUMN SPLIT */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-12 items-center">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: Authority, Value Proposition & Action (7 cols on lg) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            {/* Small Trust Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6 backdrop-blur-md transition-all">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
                DVSA APPROVED DRIVING ACADEMY
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-primary font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
                MANCHESTER
              </span>
            </div>

            {/* Authoritative Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
              Master the Road.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-primary">
                Pass With Confidence
              </span>
              <br />
              in Manchester.
            </h1>

            {/* Crisp Supporting Text */}
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[540px] font-normal">
              Professional manual and automatic driving lessons with qualified instructors, modern dual-control vehicles and structured training designed to prepare you for your practical test.
            </p>

            {/* CTA Group */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
              {/* Primary CTA */}
              <BookLessonButton
                course="Introductory 2-Hour Assessment"
                source="hero-primary"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-primary-foreground/90 shrink-0" />
                <span>Book Your First Lesson</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
              </BookLessonButton>

              {/* Secondary CTA */}
              <a
                href={phoneHref}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-6 py-4 text-sm font-semibold text-foreground shadow-xs transition-all duration-200 hover:bg-muted hover:border-primary/40 backdrop-blur-xs"
              >
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>Call Us: {phone}</span>
              </a>
            </div>

            {/* Micro Verified Coverage Note */}
            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
              <span>Door-to-door learner pickup across Greater Manchester</span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: Premium Automotive Visual & Futuristic Telemetry (5 cols) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            {/* Ambient Background Vehicle Orbit */}
            <div
              className="absolute -inset-4 rounded-3xl border border-primary/20 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 -z-10 blur-xs transition-transform duration-500"
              aria-hidden="true"
            />

            {/* Main Visual Container */}
            <div className="group relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-2xl sm:rounded-3xl border border-border/80 bg-card/90 shadow-2xl overflow-hidden backdrop-blur-xs transition-all duration-500 hover:-translate-y-1 hover:border-primary/40">
              {/* Vehicle Photograph */}
              <img
                src={heroImage}
                alt="NextDrive modern dual-control training vehicle in Manchester"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />

              {/* Cinematic Vignette & Ambient Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30 pointer-events-none" />

              {/* Futuristic HUD Telemetry Strip (Top Bar) */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white/90 z-20 pointer-events-none">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-wider font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span>MCR // ADI FLEET 2025</span>
                </div>

                <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-white/80">
                  DUAL-CONTROL
                </div>
              </div>

              {/* Floating Information Card 1: Top-Right / Mid */}
              <div className="absolute top-16 right-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card/95 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-7 h-7 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0 border border-success/20">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    DVSA Certified
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    Grade A ADI Fleet
                  </div>
                </div>
              </div>

              {/* Floating Information Card 2: Bottom-Left */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-card/95 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    Transmission
                  </div>
                  <div className="text-xs font-bold text-foreground">
                    Manual & Automatic
                  </div>
                </div>
              </div>

              {/* Floating Information Card 3: Bottom-Right */}
              <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-card/95 dark:bg-card/90 backdrop-blur-md border border-border/80 shadow-lg">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                <span className="text-xs font-bold text-foreground">He-Man Controls</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. REFINED TRUST STRIP (Replacing Numerical Stats with Factual Features) */}
        {/* ========================================================================= */}
        <div className="mt-14 sm:mt-16 pt-8 border-t border-border">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {/* Feature 1 */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-surface-secondary/50 border border-border/60 shadow-2xs transition-colors hover:border-primary/40">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-foreground">
                  DVSA Approved
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Certified Grade A Instructors
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-surface-secondary/50 border border-border/60 shadow-2xs transition-colors hover:border-primary/40">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-foreground">
                  Manual & Automatic
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Modern Dual-Control Cars
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-surface-secondary/50 border border-border/60 shadow-2xs transition-colors hover:border-primary/40">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-foreground">
                  Dual-Control Fleet
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Full Safety Dual-Pedal System
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-surface-secondary/50 border border-border/60 shadow-2xs transition-colors hover:border-primary/40">
              <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                <Route className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-foreground">
                  Structured Lessons
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Practical DVSA Test Prep
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
