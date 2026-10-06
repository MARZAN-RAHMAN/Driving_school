"use client";

import React from "react";

interface HeroBackgroundGridProps {
  className?: string;
}

/**
 * HeroBackgroundGrid renders a subtle perspective depth grid and automotive light trails
 * behind the vehicle and lower hero canvas, fading gracefully into the background.
 */
export function HeroBackgroundGrid({ className = "" }: HeroBackgroundGridProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* ========================================================================= */}
      {/* 1. PERSPECTIVE DEPTH GRID (Lower Hero Area) */}
      {/* ========================================================================= */}
      <div className="absolute inset-x-0 bottom-0 h-[65%] w-full overflow-hidden [mask-image:radial-gradient(ellipse_80%_60%_at_65%_75%,#000_20%,transparent_80%)]">
        <svg
          className="w-full h-full opacity-60 dark:opacity-80"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
        >
          <defs>
            {/* Grid Line Gradient - Fades toward edges */}
            <linearGradient id="hero-grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.02" />
              <stop offset="40%" stopColor="var(--primary)" stopOpacity="0.12" />
              <stop offset="85%" stopColor="var(--accent)" stopOpacity="0.16" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.04" />
            </linearGradient>

            <linearGradient id="hero-transversal-fade" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
              <stop offset="25%" stopColor="var(--primary)" stopOpacity="0.10" />
              <stop offset="65%" stopColor="var(--accent)" stopOpacity="0.14" />
              <stop offset="90%" stopColor="var(--primary)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Perspective Vanishing Lines (radiating from horizon coordinate ~ 960, 80) */}
          <g stroke="url(#hero-grid-fade)" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {/* Leftward perspective rays */}
            <line x1="960" y1="80" x2="-200" y2="600" />
            <line x1="960" y1="80" x2="40" y2="600" />
            <line x1="960" y1="80" x2="260" y2="600" />
            <line x1="960" y1="80" x2="460" y2="600" />
            <line x1="960" y1="80" x2="640" y2="600" />
            <line x1="960" y1="80" x2="800" y2="600" />

            {/* Central road vanishing guide lines */}
            <line x1="960" y1="80" x2="940" y2="600" strokeWidth="1.5" strokeOpacity="0.18" />
            <line x1="960" y1="80" x2="1060" y2="600" strokeWidth="1.5" strokeOpacity="0.18" />

            {/* Rightward perspective rays */}
            <line x1="960" y1="80" x2="1180" y2="600" />
            <line x1="960" y1="80" x2="1320" y2="600" />
            <line x1="960" y1="80" x2="1480" y2="600" />
            <line x1="960" y1="80" x2="1680" y2="600" />
          </g>

          {/* Perspective Transversals (increasingly spaced toward foreground) */}
          <g stroke="url(#hero-transversal-fade)" strokeWidth="1" vectorEffect="non-scaling-stroke">
            <line x1="0" y1="120" x2="1440" y2="120" strokeOpacity="0.04" />
            <line x1="0" y1="170" x2="1440" y2="170" strokeOpacity="0.06" />
            <line x1="0" y1="230" x2="1440" y2="230" strokeOpacity="0.08" />
            <line x1="0" y1="305" x2="1440" y2="305" strokeOpacity="0.11" />
            <line x1="0" y1="395" x2="1440" y2="395" strokeOpacity="0.14" />
            <line x1="0" y1="500" x2="1440" y2="500" strokeOpacity="0.18" />
          </g>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 2. AUTOMOTIVE LIGHT TRAILS (Subtle flowing streaks) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden opacity-40 dark:opacity-60">
        {/* Light Trail 1: Primary Indigo (High Depth, Upper Tarmac) */}
        <div
          className="animate-light-trail-slow absolute top-[36%] left-[10%] h-[1.5px] w-[280px] sm:w-[420px] rounded-full blur-[0.5px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--primary) 50%, transparent 100%)",
          }}
        />

        {/* Light Trail 2: Cyan Accent (Mid Depth, Center Lane) */}
        <div
          className="animate-light-trail-medium absolute top-[52%] left-[20%] h-[2px] w-[320px] sm:w-[500px] rounded-full blur-[1px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--accent) 45%, var(--primary) 75%, transparent 100%)",
          }}
        />

        {/* Light Trail 3: Purple Secondary (Lower Foreground Streak) */}
        <div
          className="animate-light-trail-fast absolute top-[68%] left-[5%] h-[1.5px] w-[260px] sm:w-[380px] rounded-full blur-[0.5px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, var(--secondary) 50%, transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}
