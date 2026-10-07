"use client";

import React, { useEffect, useState } from "react";

interface RoadProgressRouteProps {
  totalSteps?: number;
  hoveredIndex?: number | null;
  className?: string;
}

/**
 * RoadProgressRoute
 * 
 * Renders an animated automotive navigation path connecting the 5 syllabus stages:
 * - Subtle road dashed lane markings
 * - Moving automotive beacon pulse traveling from Stage 01 to Stage 05
 * - Interactive glow highlights that illuminate when hovering steps
 * - Seamless integration with dark/light mode
 */
export function RoadProgressRoute({
  totalSteps = 5,
  hoveredIndex = null,
  className = "",
}: RoadProgressRouteProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Calculate percentage of progress completed based on hover
  const progressPercent =
    hoveredIndex !== null ? ((hoveredIndex + 1) / totalSteps) * 100 : 100;

  return (
    <div
      className={`pointer-events-none w-full relative select-none -z-5 ${className}`}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* DESKTOP ROUTE (Horizontal lane between step indicators) */}
      {/* ========================================================================= */}
      <div className="relative w-full h-8 flex items-center">
        {/* Base Track Line */}
        <div className="absolute inset-x-[10%] h-[2px] bg-border/80 dark:bg-border/60" />

        {/* Dashed Road Markings */}
        <div
          className="absolute inset-x-[10%] h-[2px] opacity-35 dark:opacity-50"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, var(--muted-foreground) 0, var(--muted-foreground) 8px, transparent 8px, transparent 16px)",
          }}
        />

        {/* Active Illuminated Progress Path */}
        <div
          className="absolute left-[10%] h-[2px] transition-all duration-500 ease-out bg-gradient-to-r from-primary via-accent to-secondary shadow-sm shadow-primary/30"
          style={{
            width: `${(progressPercent * 0.8)}%`,
          }}
        />

        {/* Animated Moving Vehicle / Navigation Beacon along the track */}
        {!prefersReducedMotion && (
          <div
            className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center animate-light-trail-slow"
            style={{
              animationDuration: "8s",
              animationIterationCount: "infinite",
              animationTimingFunction: "ease-in-out",
            }}
          >
            <div className="w-2 h-2 rounded-full bg-accent shadow-md shadow-accent/80 animate-ping" />
          </div>
        )}

        {/* Step Waypoint Nodes */}
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepPercent = 10 + (i / (totalSteps - 1)) * 80;
          const isPassed = hoveredIndex === null || i <= hoveredIndex;

          return (
            <div
              key={i}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-300"
              style={{ left: `${stepPercent}%` }}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                  isPassed
                    ? "bg-primary border-primary shadow-xs shadow-primary/50 scale-110"
                    : "bg-card border-border/80"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoadProgressRoute;
