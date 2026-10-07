"use client";

import React, { useEffect, useState } from "react";
import { NextDrive3DCanvas, BackgroundVariant } from "@/components/ui/NextDrive3DCanvas";

interface NextDriveBackgroundProps {
  variant?: BackgroundVariant;
  showOrbs?: boolean;
  showCanvas?: boolean;
  speedMultiplier?: number;
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * NextDriveBackground: Master 3D Animated Background System
 * 
 * Provides a sophisticated, multi-layered visual environment:
 * Layer 1: Base theme background
 * Layer 2: 3D Perspective Road Grid, Light Trails & Depth Particles (NextDrive3DCanvas)
 * Layer 3: Ambient Automotive Light Orbs (Indigo, Cyan, Violet)
 * Layer 4: Optional Section Content (with relative z-10)
 * 
 * Performance & Accessibility:
 * - 60fps lightweight HTML5 Canvas + CSS 3D
 * - Automatically pauses RAF when offscreen via IntersectionObserver
 * - Full prefers-reduced-motion support
 * - Zero interference with buttons/links (pointer-events: none)
 */
export function NextDriveBackground({
  variant = "full",
  showOrbs = true,
  showCanvas = true,
  speedMultiplier = 1,
  interactive = true,
  className = "",
  children,
}: NextDriveBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. LAYER 2: 3D INTERACTIVE CANVAS (Perspective Road, Trails, Particles) */}
      {/* ========================================================================= */}
      {showCanvas && (
        <NextDrive3DCanvas
          variant={variant}
          speedMultiplier={speedMultiplier}
          interactive={interactive}
          className="z-0"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. LAYER 3: AMBIENT AUTOMOTIVE LIGHT ORBS (Indigo, Violet, Cyan) */}
      {/* ========================================================================= */}
      {showOrbs && (
        <div className="absolute inset-0 overflow-hidden z-1">
          {/* Orb 1: Primary Indigo Glow (Top Right / Center) */}
          <div
            className={`absolute rounded-full blur-[90px] sm:blur-[130px] transition-all duration-1000 ${
              variant === "hero"
                ? "top-[-10%] right-[5%] w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] bg-primary/14 dark:bg-primary/20"
                : variant === "route"
                ? "top-[10%] right-[10%] w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] bg-primary/10 dark:bg-primary/15"
                : variant === "locations"
                ? "top-[20%] right-[15%] w-[360px] sm:w-[480px] h-[360px] sm:h-[480px] bg-primary/10 dark:bg-primary/14"
                : "top-[5%] right-[10%] w-[320px] sm:w-[460px] h-[320px] sm:h-[460px] bg-primary/8 dark:bg-primary/12"
            } ${!prefersReducedMotion ? "animate-halo-pulse" : ""}`}
            style={{ animationDuration: "14s" }}
          />

          {/* Orb 2: Cyan Navigation Glow (Left / Bottom-Left) */}
          <div
            className={`absolute rounded-full blur-[80px] sm:blur-[120px] transition-all duration-1000 ${
              variant === "hero"
                ? "top-[40%] left-[-5%] w-[360px] sm:w-[540px] h-[360px] sm:h-[540px] bg-accent/12 dark:bg-accent/16"
                : variant === "locations"
                ? "bottom-[10%] left-[5%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-accent/14 dark:bg-accent/18"
                : "bottom-[5%] left-[5%] w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] bg-accent/8 dark:bg-accent/10"
            } ${!prefersReducedMotion ? "animate-halo-pulse" : ""}`}
            style={{ animationDuration: "18s", animationDelay: "2s" }}
          />

          {/* Orb 3: Violet Secondary Accent (Subtle Depth) */}
          {(variant === "hero" || variant === "full" || variant === "route") && (
            <div
              className={`absolute rounded-full blur-[100px] sm:blur-[140px] transition-all duration-1000 ${
                variant === "hero"
                  ? "bottom-[-15%] right-[25%] w-[400px] sm:w-[580px] h-[400px] sm:h-[580px] bg-secondary/10 dark:bg-secondary/16"
                  : "bottom-[10%] right-[15%] w-[300px] sm:w-[420px] h-[300px] sm:h-[420px] bg-secondary/7 dark:bg-secondary/11"
              } ${!prefersReducedMotion ? "animate-halo-pulse" : ""}`}
              style={{ animationDuration: "16s", animationDelay: "4s" }}
            />
          )}

          {/* Subtle Top Gradient Taper */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent opacity-80" />
          
          {/* Subtle Bottom Gradient Taper */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent opacity-80" />
        </div>
      )}

      {children}
    </div>
  );
}

export default NextDriveBackground;
