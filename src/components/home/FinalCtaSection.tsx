"use client";

import React from "react";
import {
  Zap,
  ArrowRight,
  Phone,
  ShieldCheck,
  Car,
  MapPin,
  Sparkles,
} from "lucide-react";
import { BookLessonButton } from "@/components/booking/BookLessonButton";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface FinalCtaSectionProps {
  phone: string;
  phoneHref: string;
  assessmentPrice: number;
}

export function FinalCtaSection({
  phone,
  phoneHref,
  assessmentPrice,
}: FinalCtaSectionProps) {
  return (
    <section
      id="contact"
      className="relative py-20 sm:py-24 lg:py-28 overflow-hidden bg-gradient-to-b from-background via-surface-secondary/20 to-card transition-colors duration-200"
    >
      {/* Soft ambient halo lighting system */}
      <AmbientHalo position="center" variant="tricolor" size="full" />
      <AmbientHalo position="bottom" variant="dual" size="lg" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-up">
          {/* Premium Automotive Action Card */}
          <div className="relative mx-auto max-w-5xl rounded-3xl sm:rounded-[32px] border border-border/80 bg-gradient-to-b from-card/95 via-card/90 to-card/95 p-8 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-md overflow-hidden text-center">
            {/* Subtle inner top glow highlight */}
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10"
              aria-hidden="true"
            />

            {/* Subtle automotive accent strip on top edge */}
            <div
              className="pointer-events-none absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
              aria-hidden="true"
            />

            {/* 1. Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-xs backdrop-blur-xs mb-5">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>START YOUR JOURNEY</span>
            </div>

            {/* 2. Confident Main Headline */}
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground leading-[1.12]">
              Ready to Get{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-primary">
                Behind the Wheel?
              </span>
            </h2>

            {/* 3. Approved Business Supporting Copy */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-normal">
              Book your introductory 2-hour assessment lesson today with our Grade A certified instructors across Manchester and begin your journey to a full UK driving licence.
            </p>

            {/* 4. Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md mx-auto sm:max-w-none">
              <BookLessonButton
                course="Introductory 2-Hour Assessment"
                source="final-cta"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:-translate-y-0.5 group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[48px]"
              >
                <Sparkles className="h-4 w-4 text-primary-foreground/90 shrink-0" />
                <span>Book Assessment Lesson (£{assessmentPrice})</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
              </BookLessonButton>

              <a
                href={phoneHref}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl border border-border bg-surface-secondary/80 hover:bg-muted px-7 py-4 text-sm font-semibold text-foreground shadow-xs transition-all duration-200 hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[48px]"
              >
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>Call Hotline: {phone}</span>
              </a>
            </div>

            {/* 5. Refined Premium Trust Badges */}
            <div className="mt-10 sm:mt-12 pt-8 border-t border-border/60">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-foreground">
                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-secondary/60 border border-border/80 shadow-2xs hover:border-primary/30 transition-colors">
                  <ShieldCheck className="h-4 w-4 text-success shrink-0" />
                  <span>Grade A DVSA Instructors</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-secondary/60 border border-border/80 shadow-2xs hover:border-primary/30 transition-colors">
                  <Car className="h-4 w-4 text-primary shrink-0" />
                  <span>Dual-Control Modern Fleet</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-surface-secondary/60 border border-border/80 shadow-2xs hover:border-primary/30 transition-colors">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span>Door-to-Door Manchester Pickup</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default FinalCtaSection;
