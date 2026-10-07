"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MapPin,
  Phone,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { BusinessSettings } from "@/types";
import { BookLessonButton } from "@/components/booking/BookLessonButton";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { HeroBackgroundGrid } from "@/components/home/HeroBackgroundGrid";
import { Hero3DStage } from "@/components/home/Hero3DStage";
import { TrustBenefitsJourney } from "@/components/home/TrustBenefitsJourney";

interface HeroSectionProps {
  settings: BusinessSettings;
  assessmentPrice?: number;
}

export function HeroSection({ settings, assessmentPrice = 75 }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Desktop Cursor Spotlight coordinates inside Hero
  const sectionRef = useRef<HTMLElement>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // 0ms: background ready, start staggered entrance sequence
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      cancelAnimationFrame(handle);
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // Track cursor position inside Hero section for subtle desktop spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setCursorPos(null);
  };

  const phone = settings.phone || "+44 161 946 0921";
  const phoneHref = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const heroImage =
    settings.heroImageUrl ||
    "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&fit=crop";

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20 xl:pt-20 xl:pb-22 border-b border-border bg-background transition-colors duration-200"
    >
      {/* ========================================================================= */}
      {/* LAYER 1 & 2: BASE BACKGROUND & MULTI-POINT AMBIENT GLOWS */}
      {/* ========================================================================= */}
      <AmbientHalo position="top-right" variant="dual" size="full" />
      <AmbientHalo position="left" variant="accent" size="lg" />

      {/* ========================================================================= */}
      {/* LAYER 3 & 4: 3D PERSPECTIVE DEPTH GRID & LIGHT TRAILS */}
      {/* ========================================================================= */}
      <HeroBackgroundGrid />

      {/* ========================================================================= */}
      {/* DESKTOP CURSOR SPOTLIGHT (Subtle radial light in Hero only) */}
      {/* ========================================================================= */}
      {cursorPos && !prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 -z-5 hidden md:block transition-opacity duration-300"
          style={{
            background: `radial-gradient(650px circle at ${cursorPos.x}px ${cursorPos.y}px, rgba(79, 70, 229, 0.08), transparent 65%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTAINER: TWO-COLUMN BALANCED 3D AUTOMOTIVE HERO */}
      {/* ========================================================================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          {/* ===================================================================== */}
          {/* LEFT COLUMN: Authority, Value Proposition & Action (6 cols on lg) */}
          {/* ===================================================================== */}
          <div className="lg:col-span-6 flex flex-col items-start text-left z-10">
            {/* 1. Small Trust Badge (Reveals @ ~150ms) */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-border bg-card/90 px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-5 sm:mb-6 backdrop-blur-md transition-all duration-500 ${
                mounted && !prefersReducedMotion
                  ? "opacity-100 translate-y-0"
                  : mounted
                  ? "opacity-100"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-muted-foreground uppercase tracking-wider text-[11px] font-bold">
                DVSA APPROVED DRIVING ACADEMY
              </span>
              <span className="text-muted-foreground/30">•</span>
              <span className="text-primary font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
                MANCHESTER
              </span>
            </div>

            {/* 2. Authoritative Main Headline (Reveals @ ~250ms) */}
            <h1
              className={`text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] transition-all duration-600 delay-100 ${
                mounted && !prefersReducedMotion
                  ? "opacity-100 translate-y-0"
                  : mounted
                  ? "opacity-100"
                  : "opacity-0 translate-y-5"
              }`}
            >
              Master the Road.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-primary">
                Pass With Confidence
              </span>
              <br />
              in Manchester.
            </h1>

            {/* 3. Crisp Supporting Text (Reveals @ ~400ms) */}
            <p
              className={`mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[520px] font-normal transition-all duration-600 delay-200 ${
                mounted && !prefersReducedMotion
                  ? "opacity-100 translate-y-0"
                  : mounted
                  ? "opacity-100"
                  : "opacity-0 translate-y-5"
              }`}
            >
              Professional manual and automatic driving lessons with DVSA Grade A instructors, modern dual-control training vehicles, and structured tuition designed to pass your practical test first time.
            </p>

            {/* 4. Conversion CTA Group (Reveals @ ~550ms) */}
            <div
              className={`mt-7 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto transition-all duration-600 delay-300 ${
                mounted && !prefersReducedMotion
                  ? "opacity-100 translate-y-0"
                  : mounted
                  ? "opacity-100"
                  : "opacity-0 translate-y-5"
              }`}
            >
              {/* Primary CTA with 2-3px lift, subtle glow & arrow movement */}
              <BookLessonButton
                course="Introductory 2-Hour Assessment"
                source="hero-primary"
                title={`Book Introductory 2-Hour Assessment (From £${assessmentPrice})`}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-primary px-7 py-4 text-sm font-bold text-primary-foreground shadow-md shadow-primary/25 transition-all duration-200 hover:bg-primary-hover hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/35 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-primary-foreground/90 shrink-0" />
                <span>Book Your First Lesson</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 shrink-0" />
              </BookLessonButton>

              {/* Secondary CTA with subtle hover transition */}
              <a
                href={phoneHref}
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card/85 px-6 py-4 text-sm font-semibold text-foreground shadow-xs transition-all duration-200 hover:bg-muted hover:border-primary/40 hover:-translate-y-0.5 backdrop-blur-xs"
              >
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>Call Us: {phone}</span>
              </a>
            </div>

            {/* 5. Micro Verified Coverage Note (Reveals @ ~650ms) */}
            <div
              className={`mt-6 flex items-center gap-2 text-xs text-muted-foreground transition-all duration-600 delay-400 ${
                mounted && !prefersReducedMotion
                  ? "opacity-100 translate-y-0"
                  : mounted
                  ? "opacity-100"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Door-to-door learner pickup across Greater Manchester &amp; test centers</span>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT COLUMN: 3D Automotive Stage & Vehicle Visual (6 cols on lg) */}
          {/* ===================================================================== */}
          <div
            className={`lg:col-span-6 relative w-full flex items-center justify-center transition-all duration-800 ease-out delay-150 ${
              mounted && !prefersReducedMotion
                ? "opacity-100 translate-x-0 scale-100"
                : mounted
                ? "opacity-100"
                : "opacity-0 translate-x-[30px] scale-[0.98]"
            }`}
          >
            <Hero3DStage
              heroImage={heroImage}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ANIMATED NEXTDRIVE TRUST & BENEFITS JOURNEY */}
        {/* ========================================================================= */}
        <div className="mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-border/70">
          <TrustBenefitsJourney />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HERO -> NEXT SECTION SEAMLESS TRANSITION GLOW */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-background via-background/60 to-transparent z-10"
        aria-hidden="true"
      />
    </section>
  );
}

export default HeroSection;
