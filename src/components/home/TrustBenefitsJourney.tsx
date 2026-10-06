"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Car,
  Sliders,
  Route,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export interface TrustBenefitItem {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: "shield" | "car" | "sliders" | "route";
  accentColor: string;
}

const DEFAULT_BENEFITS: TrustBenefitItem[] = [
  {
    id: "dvsa-approved",
    step: "01",
    title: "DVSA Approved",
    description: "Certified Grade A Instructors",
    icon: "shield",
    accentColor: "emerald",
  },
  {
    id: "transmission-choice",
    step: "02",
    title: "Manual & Automatic",
    description: "Modern Dual-Control Cars",
    icon: "car",
    accentColor: "indigo",
  },
  {
    id: "dual-control-safety",
    step: "03",
    title: "Dual-Control Fleet",
    description: "Full Safety Dual-Pedal System",
    icon: "sliders",
    accentColor: "purple",
  },
  {
    id: "structured-tuition",
    step: "04",
    title: "Structured Lessons",
    description: "Practical DVSA Test Prep",
    icon: "route",
    accentColor: "cyan",
  },
];

interface TrustBenefitsJourneyProps {
  items?: TrustBenefitItem[];
  eyebrow?: string;
  headline?: string;
  className?: string;
}

/**
 * Individual Trust Benefit Card with subtle desktop cursor glow & refined depth
 */
function BenefitCard({
  item,
  index,
  isActive,
  isRevealed,
  prefersReducedMotion,
  isTouchDevice,
}: {
  item: TrustBenefitItem;
  index: number;
  isActive: boolean;
  isRevealed: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
}) {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const renderIcon = () => {
    const iconClasses = "w-5 h-5 transition-transform duration-400 ease-out";
    switch (item.icon) {
      case "shield":
        return (
          <ShieldCheck
            className={`${iconClasses} text-emerald-500 dark:text-emerald-400 ${
              isActive && !prefersReducedMotion ? "scale-115" : "scale-100"
            }`}
          />
        );
      case "car":
        return (
          <Car
            className={`${iconClasses} text-indigo-500 dark:text-indigo-400 ${
              isActive && !prefersReducedMotion ? "translate-x-1" : "translate-x-0"
            }`}
          />
        );
      case "sliders":
        return (
          <Sliders
            className={`${iconClasses} text-purple-500 dark:text-purple-400 ${
              isActive && !prefersReducedMotion ? "-translate-y-1" : "translate-y-0"
            }`}
          />
        );
      case "route":
      default:
        return (
          <Route
            className={`${iconClasses} text-cyan-500 dark:text-cyan-400 ${
              isActive && !prefersReducedMotion ? "scale-115" : "scale-100"
            }`}
          />
        );
    }
  };

  // Stagger reveal delay
  const revealDelayStyle = prefersReducedMotion
    ? {}
    : { transitionDelay: `${index * 130}ms` };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={revealDelayStyle}
      className={`group relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-500 ease-out select-none ${
        isRevealed || prefersReducedMotion
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-[0.97]"
      } ${
        isActive && !prefersReducedMotion
          ? "border-primary/60 dark:border-primary/70 -translate-y-1 shadow-lg shadow-primary/15 bg-card/95 dark:bg-slate-900/95"
          : "border-border/75 dark:border-white/10 bg-card/85 dark:bg-slate-900/80 hover:border-primary/45 dark:hover:border-primary/50 hover:-translate-y-1 hover:shadow-md hover:shadow-primary/5"
      }`}
    >
      {/* Subtle internal gradient highlight */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent dark:from-white/[0.03] dark:to-transparent"
        aria-hidden="true"
      />

      {/* Interactive Cursor Spotlight Glow on Desktop */}
      {mousePos && !prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 -z-5 transition-opacity duration-200"
          style={{
            background: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, rgba(79, 70, 229, 0.08), transparent 65%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Step Number Subtle Watermark (Top-Right) */}
      <div className="absolute top-3.5 right-4 font-mono text-[11px] font-bold text-muted-foreground/35 dark:text-muted-foreground/25 tracking-widest pointer-events-none">
        {item.step}
      </div>

      <div className="flex items-start gap-3.5 relative z-10">
        {/* Soft Glass Rounded Icon Container (48px) */}
        <div
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-400 ease-out ${
            isActive && !prefersReducedMotion
              ? "border-primary/40 bg-primary/20 shadow-[0_0_18px_rgba(79,70,229,0.3)] ring-2 ring-primary/20"
              : "border-primary/20 dark:border-primary/30 bg-primary/10 group-hover:border-primary/35 group-hover:bg-primary/15 group-hover:shadow-xs"
          }`}
        >
          {renderIcon()}
        </div>

        {/* Content Hierarchy */}
        <div className="min-w-0 flex-1 pr-6">
          <div className="text-xs sm:text-sm font-bold text-foreground tracking-tight leading-snug">
            {item.title}
          </div>
          <div className="mt-1 text-[11px] sm:text-xs text-muted-foreground leading-normal">
            {item.description}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrustBenefitsJourney({
  items = DEFAULT_BENEFITS,
  eyebrow = "WHY LEARN WITH NEXTDRIVE",
  headline = "Everything You Need to Drive With Confidence",
  className = "",
}: TrustBenefitsJourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isInView, setIsInView] = useState(false);
  const [progressStarted, setProgressStarted] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window !== "undefined") {
      return !window.matchMedia("(pointer: fine)").matches;
    }
    return false;
  });

  // Track prefers-reduced-motion and pointer media queries
  useEffect(() => {
    if (typeof window === "undefined") return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");

    const onMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const onPointerChange = (e: MediaQueryListEvent) => setIsTouchDevice(!e.matches);

    motionQuery.addEventListener("change", onMotionChange);
    pointerQuery.addEventListener("change", onPointerChange);

    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      pointerQuery.removeEventListener("change", onPointerChange);
    };
  }, []);

  // Derived states respecting prefers-reduced-motion
  const effectiveInView = prefersReducedMotion || isInView;
  const effectiveProgress = prefersReducedMotion || progressStarted;

  // IntersectionObserver: trigger animation once upon entering viewport
  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Trigger once only
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  // Sequential progression orchestration when entering viewport
  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;

    // Start progress line animation
    const progressTimer = setTimeout(() => {
      setProgressStarted(true);
    }, 80);

    // Staggered active pulses as line passes each node (0 -> 1 -> 2 -> 3)
    const timers: NodeJS.Timeout[] = [];
    const stepDuration = 300;
    const initialDelay = 180;

    items.forEach((_, idx) => {
      const t = setTimeout(() => {
        setActiveStepIndex(idx);
      }, initialDelay + idx * stepDuration);
      timers.push(t);
    });

    // Clear active highlight after journey concludes
    const settleTimer = setTimeout(() => {
      setActiveStepIndex(-1);
    }, initialDelay + items.length * stepDuration + 450);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(settleTimer);
      timers.forEach((t) => clearTimeout(t));
    };
  }, [isInView, prefersReducedMotion, items]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
    >
      {/* Background Soft Ambient Indigo Glow */}
      <div
        className="pointer-events-none absolute -inset-x-10 top-1/2 -translate-y-1/2 h-36 rounded-full bg-primary/5 dark:bg-primary/8 blur-3xl -z-10"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 1. COMPACT SECTION HEADER (Eyebrow & Focused Headline) */}
      {/* ========================================================================= */}
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-primary mb-2 shadow-2xs">
          <Sparkles className="w-3 h-3 text-primary shrink-0" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
          {headline}
        </h2>
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP CONNECTING JOURNEY LINE & STEP NODES (lg+ screens) */}
      {/* ========================================================================= */}
      <div className="hidden lg:block relative mb-6 px-12 select-none" aria-hidden="true">
        {/* Subtle Dashed Road Guide Rail Behind Nodes */}
        <div className="absolute top-1/2 left-12 right-12 -translate-y-1/2 h-[2px] border-b border-dashed border-border/80 dark:border-white/10 z-0" />

        {/* Animated Progress Gradient Line (indigo -> purple -> cyan) */}
        <div
          className="absolute top-1/2 left-12 -translate-y-1/2 h-[2.5px] rounded-full transition-all duration-[1100ms] ease-out z-1"
          style={{
            width: effectiveProgress ? "calc(100% - 6rem)" : "0%",
            background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)",
            boxShadow: "0 0 12px rgba(99, 102, 241, 0.45)",
          }}
        >
          {/* Subtle Moving Light Beacon Traveling Once at the Front of the Line */}
          {effectiveInView && progressStarted && !prefersReducedMotion && (
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_#22d3ee] animate-pulse" />
          )}
        </div>

        {/* Journey Step Nodes */}
        <div className="relative flex justify-between items-center z-10">
          {items.map((item, idx) => {
            const isNodePassed =
              prefersReducedMotion || (effectiveInView && activeStepIndex >= idx) || (activeStepIndex === -1 && effectiveInView);
            const isCurrentlyActive = activeStepIndex === idx;

            return (
              <div key={item.id} className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all duration-300 ${
                    isCurrentlyActive && !prefersReducedMotion
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/35 ring-4 ring-primary/25 scale-110"
                      : isNodePassed
                      ? "bg-primary/90 text-primary-foreground shadow-xs ring-2 ring-primary/20 scale-100"
                      : "bg-card border border-border text-muted-foreground"
                  }`}
                >
                  {item.step}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DESKTOP & TABLET CARD GRID (2 cols on md, 4 cols on lg) */}
      {/* ========================================================================= */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
        {items.map((item, idx) => (
          <BenefitCard
            key={item.id}
            item={item}
            index={idx}
            isActive={activeStepIndex === idx}
            isRevealed={effectiveInView}
            prefersReducedMotion={prefersReducedMotion}
            isTouchDevice={isTouchDevice}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. MOBILE VERTICAL TIMELINE LAYOUT (< 640px) */}
      {/* ========================================================================= */}
      <div className="sm:hidden relative pl-7 space-y-3">
        {/* Vertical Road Guide Rail & Animated Progress Line */}
        <div className="absolute left-3 top-3 bottom-3 w-[2px]" aria-hidden="true">
          {/* Dashed Base Rail */}
          <div className="absolute inset-0 border-l border-dashed border-border/80 dark:border-white/10" />

          {/* Animated Gradient Vertical Progress Line */}
          <div
            className="absolute top-0 left-0 w-full rounded-full transition-all duration-[1100ms] ease-out"
            style={{
              height: effectiveProgress ? "100%" : "0%",
              background: "linear-gradient(180deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)",
              boxShadow: "0 0 10px rgba(99, 102, 241, 0.45)",
            }}
          >
            {/* Mobile Moving Light Beacon (Runs once) */}
            {effectiveInView && progressStarted && !prefersReducedMotion && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
            )}
          </div>
        </div>

        {/* Vertical Timeline Nodes & Connected Cards */}
        {items.map((item, idx) => {
          const isNodePassed =
            prefersReducedMotion || (effectiveInView && activeStepIndex >= idx) || (activeStepIndex === -1 && effectiveInView);
          const isCurrentlyActive = activeStepIndex === idx;

          return (
            <div key={item.id} className="relative">
              {/* Vertical Step Node Pin */}
              <div
                className={`absolute -left-7 top-4 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center font-mono text-[9px] font-bold transition-all duration-300 z-10 ${
                  isCurrentlyActive && !prefersReducedMotion
                    ? "bg-primary text-primary-foreground ring-3 ring-primary/25 scale-105"
                    : isNodePassed
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/15"
                    : "bg-card border border-border text-muted-foreground"
                }`}
                aria-hidden="true"
              >
                {item.step}
              </div>

              {/* Benefit Card */}
              <BenefitCard
                item={item}
                index={idx}
                isActive={activeStepIndex === idx}
                isRevealed={isInView}
                prefersReducedMotion={prefersReducedMotion}
                isTouchDevice={isTouchDevice}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Summary Verified Micro-Tag */}
      <div className="mt-5 sm:mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
        <span>Fully DVSA compliant, dual-pedal safety equipped, and insured for all learners</span>
      </div>
    </div>
  );
}

export default TrustBenefitsJourney;
