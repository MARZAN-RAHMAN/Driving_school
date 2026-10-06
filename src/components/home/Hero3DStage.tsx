"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ShieldCheck,
  Car,
  MapPin,
} from "lucide-react";

interface Hero3DStageProps {
  heroImage: string;
  prefersReducedMotion?: boolean;
}

/**
 * 8 Ambient Floating Particles (rendered on sm+ viewports only to keep mobile clean)
 */
const PARTICLES = [
  { id: 1, top: "16%", left: "16%", size: 3, delay: "0s", duration: "10s", opacity: 0.22 },
  { id: 2, top: "24%", left: "84%", size: 3.5, delay: "1.5s", duration: "12s", opacity: 0.28 },
  { id: 3, top: "42%", left: "10%", size: 2, delay: "2.8s", duration: "9.5s", opacity: 0.18 },
  { id: 4, top: "48%", left: "88%", size: 3, delay: "0.8s", duration: "13s", opacity: 0.25 },
  { id: 5, top: "66%", left: "20%", size: 2.5, delay: "3.5s", duration: "11s", opacity: 0.2 },
  { id: 6, top: "74%", left: "80%", size: 3.5, delay: "2.2s", duration: "10s", opacity: 0.3 },
  { id: 7, top: "20%", left: "52%", size: 2.5, delay: "2.5s", duration: "11.5s", opacity: 0.22 },
  { id: 8, top: "84%", left: "84%", size: 3, delay: "0.6s", duration: "12.5s", opacity: 0.25 },
];

export function Hero3DStage({
  heroImage,
  prefersReducedMotion = false,
}: Hero3DStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Coordinates: Normalized [-1, 1]
  const targetCoords = useRef({ x: 0, y: 0 });
  const currentCoords = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  // Staggered entrance mount state
  const [mounted, setMounted] = useState(false);

  // Interactive 3D Transform States (Subtle, clamped parallax)
  const [transformStyles, setTransformStyles] = useState({
    vehicleRotateX: 0,
    vehicleRotateY: 0,
    vehicleTranslateX: 0,
    vehicleTranslateY: 0,
    roadTranslateX: 0,
    roadTranslateY: 0,
    glowTranslateX: 0,
    glowTranslateY: 0,
    card1Offset: { x: 0, y: 0 },
    card2Offset: { x: 0, y: 0 },
    card3Offset: { x: 0, y: 0 },
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(() => {
    if (typeof window !== "undefined") {
      return !window.matchMedia("(pointer: fine)").matches;
    }
    return false;
  });

  // Trigger smooth staggered entrance on mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Track touch / pointer capability changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(pointer: fine)");
    const handler = (e: MediaQueryListEvent) => {
      setIsTouchDevice(!e.matches);
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const loopRef = useRef<() => void>(() => {});

  // Smooth RAF Animation Loop using Lerp (Subtle, clamped motion)
  const updateParallax = useCallback(() => {
    if (prefersReducedMotion || isTouchDevice) return;

    const lerpFactor = 0.055;
    currentCoords.current.x +=
      (targetCoords.current.x - currentCoords.current.x) * lerpFactor;
    currentCoords.current.y +=
      (targetCoords.current.y - currentCoords.current.y) * lerpFactor;

    const { x, y } = currentCoords.current;

    // Clamped subtle rotation limits: rotateX: ±1.0deg, rotateY: ±1.5deg
    const vehicleRotateX = -y * 1.0;
    const vehicleRotateY = x * 1.5;

    // Layer Translations:
    // Background / ambient elements: 2-3px
    const glowTranslateX = -x * 2.5;
    const glowTranslateY = -y * 2.0;

    // Ground / road plane: 2-3px
    const roadTranslateX = x * 3.0;
    const roadTranslateY = y * 2.0;

    // Vehicle hero layer: 3-5px
    const vehicleTranslateX = x * 4.0;
    const vehicleTranslateY = y * 2.5;

    // Foreground customer cards: 4-7px with layered depth separation
    // Card 1: DVSA Certified (Foreground depth)
    const card1Offset = { x: x * 6.0, y: y * 4.5 };
    // Card 2: Manual & Automatic (Middle depth, positive x translation preserves left boundary)
    const card2Offset = { x: x * 4.5, y: y * 3.5 };
    // Card 3: Manchester Coverage (Middle depth)
    const card3Offset = { x: x * 4.0, y: -y * 3.0 };

    setTransformStyles({
      vehicleRotateX,
      vehicleRotateY,
      vehicleTranslateX,
      vehicleTranslateY,
      roadTranslateX,
      roadTranslateY,
      glowTranslateX,
      glowTranslateY,
      card1Offset,
      card2Offset,
      card3Offset,
    });

    const isMoving =
      Math.abs(targetCoords.current.x - currentCoords.current.x) > 0.001 ||
      Math.abs(targetCoords.current.y - currentCoords.current.y) > 0.001;

    if (isMoving || isHovered) {
      rafId.current = requestAnimationFrame(loopRef.current);
    }
  }, [prefersReducedMotion, isTouchDevice, isHovered]);

  useEffect(() => {
    loopRef.current = updateParallax;
  }, [updateParallax]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || isTouchDevice) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Normalized coordinates (-1 to 1) from container center
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    targetCoords.current.x = (relativeX - 0.5) * 2;
    targetCoords.current.y = (relativeY - 0.5) * 2;

    if (!rafId.current) {
      rafId.current = requestAnimationFrame(loopRef.current);
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(loopRef.current);
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    targetCoords.current.x = 0;
    targetCoords.current.y = 0;
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(loopRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-2xl mx-auto lg:max-w-none perspective-1200 preserve-3d select-none"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* ========================================================================= */}
      {/* LAYER 1: AMBIENT FLOATING PARTICLES (Restrained, sm+ only) */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 -z-5 overflow-hidden hidden sm:block"
        aria-hidden="true"
      >
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="animate-particle-drift absolute rounded-full bg-primary/40 dark:bg-accent/40 shadow-xs"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: p.delay,
              animationDuration: p.duration,
              transform: `translate3d(${transformStyles.glowTranslateX * 0.4}px, ${transformStyles.glowTranslateY * 0.4}px, 0)`,
              transition: "transform 0.25s cubic-bezier(0.2, 0, 0, 1)",
            }}
          />
        ))}
      </div>

      {/* ========================================================================= */}
      {/* LAYER 2: MULTI-POINT AMBIENT GLOW SYSTEM BEHIND VEHICLE */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${transformStyles.glowTranslateX}px, ${transformStyles.glowTranslateY}px, 0)`,
        }}
        aria-hidden="true"
      >
        {/* Primary Indigo Ambient Flare */}
        <div className="absolute w-[380px] sm:w-[520px] h-[280px] sm:h-[380px] rounded-full bg-primary/18 dark:bg-primary/22 blur-[90px] sm:blur-[120px]" />

        {/* Secondary Purple Atmospheric Backlight */}
        <div className="absolute -top-8 -right-8 w-[260px] sm:w-[340px] h-[220px] sm:h-[280px] rounded-full bg-secondary/12 dark:bg-secondary/18 blur-[80px] sm:blur-[100px]" />

        {/* Accent Cyan Tarmac Ground Rim Glow */}
        <div className="absolute -bottom-6 w-[320px] sm:w-[440px] h-[150px] sm:h-[200px] rounded-full bg-accent/18 dark:bg-accent/22 blur-[65px] sm:blur-[85px]" />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: 3D ROAD ENVIRONMENT & PERSPECTIVE PLANE (Underneath Vehicle) */}
      {/* ========================================================================= */}
      <div
        className="pointer-events-none absolute -bottom-5 sm:-bottom-7 inset-x-3 sm:inset-x-6 h-28 sm:h-36 -z-5 overflow-hidden transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${transformStyles.roadTranslateX}px, ${transformStyles.roadTranslateY}px, -15px)`,
        }}
        aria-hidden="true"
      >
        {/* Tapered 3D Perspective Road Deck */}
        <div className="relative w-full h-full [mask-image:linear-gradient(to_bottom,transparent_0%,black_30%,black_85%,transparent_100%)]">
          <svg
            className="w-full h-full opacity-55 dark:opacity-75"
            preserveAspectRatio="none"
            viewBox="0 0 800 240"
          >
            <defs>
              {/* Road Asphalt Gradient */}
              <linearGradient id="road-asphalt-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--card)" stopOpacity="0.1" />
                <stop offset="45%" stopColor="var(--border)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--border)" stopOpacity="0.08" />
              </linearGradient>

              {/* Road Border Line Gradient */}
              <linearGradient id="road-border-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.05" />
                <stop offset="40%" stopColor="var(--primary)" stopOpacity="0.5" />
                <stop offset="80%" stopColor="var(--accent)" stopOpacity="0.65" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.08" />
              </linearGradient>
            </defs>

            {/* Road Surface Polygon */}
            <polygon
              points="240,10 560,10 740,240 60,240"
              fill="url(#road-asphalt-grad)"
            />

            {/* Left Road Boundary Line */}
            <line
              x1="240"
              y1="10"
              x2="60"
              y2="240"
              stroke="url(#road-border-glow)"
              strokeWidth="2"
            />

            {/* Right Road Boundary Line */}
            <line
              x1="560"
              y1="10"
              x2="740"
              y2="240"
              stroke="url(#road-border-glow)"
              strokeWidth="2"
            />

            {/* Center Dashed Road Markings */}
            <g
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="14 12"
              className="animate-road-pulse"
              strokeOpacity="0.65"
            >
              <line x1="400" y1="15" x2="400" y2="235" />
            </g>

            {/* Distance Milestone Ticks on Roadside */}
            <line x1="280" y1="50" x2="260" y2="50" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.25" />
            <line x1="520" y1="50" x2="540" y2="50" stroke="var(--primary)" strokeWidth="1" strokeOpacity="0.25" />
            <line x1="320" y1="110" x2="295" y2="110" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.35" />
            <line x1="480" y1="110" x2="505" y2="110" stroke="var(--primary)" strokeWidth="1.5" strokeOpacity="0.35" />
            <line x1="365" y1="180" x2="330" y2="180" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="435" y1="180" x2="470" y2="180" stroke="var(--accent)" strokeWidth="1.5" strokeOpacity="0.4" />
          </svg>
        </div>

        {/* Anchored Multi-layered Floor Contact Shadow directly beneath tires/chassis */}
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[82%] h-8 sm:h-12 rounded-[100%] bg-black/55 dark:bg-black/85 blur-md sm:blur-lg"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-[62%] h-4 sm:h-6 rounded-[100%] bg-black/75 dark:bg-black blur-xs"
          aria-hidden="true"
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 4: 3D VEHICLE STAGE CONTAINER (Primary Focal Point with Breathing Room) */}
      {/* ========================================================================= */}
      <div
        className="relative z-10 transition-transform duration-200 ease-out will-change-transform animate-hero-float"
        style={{
          transform: `translate3d(${transformStyles.vehicleTranslateX}px, ${transformStyles.vehicleTranslateY}px, 15px) rotateX(${transformStyles.vehicleRotateX}deg) rotateY(${transformStyles.vehicleRotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Exterior Ambient Backing Glow */}
        <div
          className="absolute -inset-2 sm:-inset-3 rounded-2xl sm:rounded-3xl border border-primary/15 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 -z-10 blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Vehicle Showcase Frame with Refined Padding & Bezel */}
        <div className="group relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[5/4] xl:aspect-[4/3] rounded-2xl sm:rounded-3xl border border-border/70 dark:border-white/10 bg-card/85 dark:bg-slate-900/85 p-1 sm:p-1.5 shadow-2xl overflow-hidden backdrop-blur-xs transition-all duration-300">
          <div className="relative w-full h-full rounded-xl sm:rounded-[20px] overflow-hidden bg-slate-950">
            {/* Main Driving Academy Vehicle Photograph */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="NextDrive modern dual-control training vehicle in Manchester"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="eager"
            />

            {/* Cinematic Automotive Lighting Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

            {/* Subtle Chassis Floor Reflection Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-primary/15 via-transparent to-transparent pointer-events-none" />

            {/* Clean Customer-Facing Driving Academy Badges (Top Bar) */}
            <div className="absolute top-2.5 sm:top-3.5 left-2.5 sm:left-3.5 right-2.5 sm:right-3.5 flex items-center justify-between text-white/95 z-20 pointer-events-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-black/60 dark:bg-black/75 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-semibold tracking-wide shadow-sm">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400" />
                <span>NEXTDRIVE • MANCHESTER</span>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 dark:bg-black/75 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white/90 shadow-sm">
                <Car className="w-3 h-3 text-cyan-400" />
                <span>DUAL-CONTROL FLEET</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LAYER 5: 3 REFINED FLOATING CUSTOMER INDICATORS (Layered Depth) */}
      {/* ========================================================================= */}

      {/* Floating Card 1: DVSA APPROVED (Top-Right, Foreground depth: translateZ 35px) */}
      <div
        className={`absolute top-4 sm:top-6 right-3 sm:right-5 z-25 flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-card/92 dark:bg-slate-900/90 backdrop-blur-md border border-border/80 dark:border-white/15 shadow-xl shadow-black/8 transition-all duration-700 ease-out pointer-events-auto ${
          mounted && !prefersReducedMotion
            ? "opacity-100 translate-y-0"
            : mounted
            ? "opacity-100"
            : "opacity-0 -translate-y-3"
        }`}
        style={{
          transform: `translate3d(${transformStyles.card1Offset.x}px, ${transformStyles.card1Offset.y}px, 35px) scale(1.0)`,
        }}
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
            DVSA Certified
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
            Grade A ADI Fleet
          </div>
        </div>
      </div>

      {/* Floating Card 2: DUAL TRANSMISSION (Bottom-Left, completely inside container, translateZ 20px) */}
      <div
        className={`absolute bottom-4 sm:bottom-6 left-3 sm:left-5 z-25 flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-card/92 dark:bg-slate-900/90 backdrop-blur-md border border-border/80 dark:border-white/15 shadow-lg shadow-black/6 transition-all duration-700 ease-out delay-150 pointer-events-auto ${
          mounted && !prefersReducedMotion
            ? "opacity-100 translate-y-0"
            : mounted
            ? "opacity-100"
            : "opacity-0 translate-y-3"
        }`}
        style={{
          transform: `translate3d(${transformStyles.card2Offset.x}px, ${transformStyles.card2Offset.y}px, 20px) scale(0.98)`,
        }}
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
          <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Transmission
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
            Manual &amp; Automatic
          </div>
        </div>
      </div>

      {/* Floating Card 3: MANCHESTER COVERAGE (Bottom-Right, translateZ 20px) */}
      <div
        className={`absolute bottom-4 sm:bottom-6 right-3 sm:right-5 z-25 flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-card/92 dark:bg-slate-900/90 backdrop-blur-md border border-border/80 dark:border-white/15 shadow-lg shadow-black/6 transition-all duration-700 ease-out delay-300 pointer-events-auto ${
          mounted && !prefersReducedMotion
            ? "opacity-100 translate-y-0"
            : mounted
            ? "opacity-100"
            : "opacity-0 translate-y-3"
        }`}
        style={{
          transform: `translate3d(${transformStyles.card3Offset.x}px, ${transformStyles.card3Offset.y}px, 20px) scale(0.98)`,
        }}
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
            Coverage
          </div>
          <div className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">
            All M-Postcodes &amp; DTCs
          </div>
        </div>
      </div>
    </div>
  );
}
