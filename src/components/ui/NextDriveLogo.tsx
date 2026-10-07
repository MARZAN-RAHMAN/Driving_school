"use client";

import React, { useState, useRef } from "react";

interface NextDriveLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  animated?: boolean;
  interactive?: boolean;
}

/**
 * NextDriveLogo: Premium 3D Driving Academy Steering Wheel & Highway Crest
 * 
 * Driving School Vibe Engineering:
 * 1. 3D Sculpted Ergonomic Steering Wheel with tubular volume, bevels & grip contours
 * 2. 12 O'Clock Precision Center Line marker (Motorsport / Advanced DVSA Training)
 * 3. 3-Spoke Metallic Sport Helm with brushed satin titanium finish
 * 4. Recessed Center Cockpit Window revealing the forward 3D Highway & Road Lanes
 * 5. Aerodynamic Forward Training Car / Horizon Navigation Beacon
 * 6. Interactive 3D Steering Physics: Hovering dynamically turns the wheel and tilts in 3D
 */
export function NextDriveLogo({
  size = "md",
  className = "",
  animated = true,
  interactive = true,
}: NextDriveLogoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 });
  const [isHovered, setIsHovered] = useState(false);

  // Compute pixel dimensions
  const getDimension = () => {
    if (typeof size === "number") return size;
    switch (size) {
      case "sm":
        return 32;
      case "md":
        return 40;
      case "lg":
        return 48;
      case "xl":
        return 64;
      default:
        return 40;
    }
  };

  const dim = getDimension();

  // Interactive 3D steering & tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    // Interactive steering effect: moving left/right turns the wheel
    const rotateZ = ((x - centerX) / centerX) * 9;

    setTilt({ rotateX, rotateY, rotateZ, scale: 1.08 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: dim,
        height: dim,
        perspective: "600px",
      }}
      className={`relative select-none shrink-0 group ${className}`}
      aria-label="NextDrive Driving Academy 3D Steering Wheel Emblem"
    >
      {/* ========================================================================= */}
      {/* 1. DYNAMIC ROAD AMBIENT UNDERGLOW AURA */}
      {/* ========================================================================= */}
      <div
        className={`absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-cyan-500 to-indigo-600 blur-md transition-all duration-300 ${
          isHovered ? "opacity-90 scale-110" : "opacity-45 group-hover:opacity-75"
        }`}
        style={{
          transform: `translate3d(${tilt.rotateY * 1.2}px, ${-tilt.rotateX * 1.2}px, -15px)`,
        }}
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* 2. 3D STEERING WHEEL EMBLEM (CSS 3D Transformed with Dynamic Steering) */}
      {/* ========================================================================= */}
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) rotateZ(${tilt.rotateZ}deg) scale3d(${tilt.scale}, ${tilt.scale}, 1)`,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 3D Tubular Steering Wheel Rim Gradient */}
            <linearGradient id="steering-rim-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="20%" stopColor="#CBD5E1" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#6366F1" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#312E81" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0B0F19" stopOpacity="1" />
            </linearGradient>

            {/* Rim Inner Shadow / Depth Groove */}
            <radialGradient id="rim-inner-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="65%" stopColor="transparent" />
              <stop offset="90%" stopColor="#020408" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#020408" stopOpacity="1" />
            </radialGradient>

            {/* 3D Brushed Chrome Spokes Gradient */}
            <linearGradient id="spoke-chrome" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E2E8F0" />
              <stop offset="65%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Recessed Road Highway Chamber */}
            <radialGradient id="road-chamber" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="40%" stopColor="#0F172A" />
              <stop offset="85%" stopColor="#090D16" />
              <stop offset="100%" stopColor="#030712" />
            </radialGradient>

            {/* 3D Highway Asphalt Gradient */}
            <linearGradient id="highway-tarmac" x1="50%" y1="90%" x2="50%" y2="25%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="40%" stopColor="#1E293B" />
              <stop offset="80%" stopColor="#312E81" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>

            {/* Glowing Road Center Lane */}
            <linearGradient id="road-lane-glow" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="60%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            {/* 3D Training Car Silhouette Gradient */}
            <linearGradient id="car-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#818CF8" />
              <stop offset="85%" stopColor="#4338CA" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>

            {/* Specular Curved Glass Dome Sheen */}
            <linearGradient id="glass-arc" x1="25%" y1="0%" x2="75%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Drop Shadow Filter for Central Elements */}
            <filter id="hub-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* ===================================================================== */}
          {/* A. 3D STEERING WHEEL RIM (Tubular Automotive Ring) */}
          {/* ===================================================================== */}
          {/* Rim Shadow Base */}
          <circle
            cx="50"
            cy="50"
            r="43"
            stroke="#090D16"
            strokeWidth="11"
            className="opacity-90"
          />

          {/* Tubular 3D Rim with Specular Lighting */}
          <circle
            cx="50"
            cy="50"
            r="43"
            stroke="url(#steering-rim-grad)"
            strokeWidth="8.5"
            strokeLinecap="round"
          />

          {/* Outer Bevel Highlight Arc (Top-Left Light Source) */}
          <path
            d="M14 36 C18 18 32 8 50 8 C68 8 82 18 86 36"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Inner Depth Rim Groove */}
          <circle
            cx="50"
            cy="50"
            r="38.5"
            stroke="rgba(0,0,0,0.7)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* 10 & 2 O'Clock Ergonomic Grip Contours (Classic DVSA Hand Placement) */}
          {/* Left Thumb Grip (10 o'clock) */}
          <path
            d="M17 32 C15 28 20 22 25 20 C27 23 23 30 17 32 Z"
            fill="#818CF8"
            opacity="0.4"
          />
          {/* Right Thumb Grip (2 o'clock) */}
          <path
            d="M83 32 C85 28 80 22 75 20 C73 23 77 30 83 32 Z"
            fill="#818CF8"
            opacity="0.4"
          />

          {/* 12 O'Clock Centering Racing Stripe (Cyan Marker) */}
          <rect
            x="48"
            y="2.5"
            width="4"
            height="9"
            rx="1.5"
            fill="#22D3EE"
            className="drop-shadow-[0_0_4px_rgba(34,211,238,0.8)]"
          />

          {/* ===================================================================== */}
          {/* B. 3D CHROME SPOKES (Connecting Rim to Center Hub) */}
          {/* ===================================================================== */}
          {/* Left 9 O'Clock Spoke */}
          <path
            d="M12 47 L34 46 C35 48 35 52 34 54 L12 53 Z"
            fill="url(#spoke-chrome)"
            filter="url(#hub-shadow)"
          />
          <line x1="12" y1="47" x2="34" y2="46" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />

          {/* Right 3 O'Clock Spoke */}
          <path
            d="M88 47 L66 46 C65 48 65 52 66 54 L88 53 Z"
            fill="url(#spoke-chrome)"
            filter="url(#hub-shadow)"
          />
          <line x1="66" y1="46" x2="88" y2="47" stroke="#FFFFFF" strokeWidth="1" opacity="0.7" />

          {/* Bottom 6 O'Clock Vertical Twin Spoke */}
          <path
            d="M44 65 L44 88 C46 89 54 89 56 88 L56 65 C52 66 48 66 44 65 Z"
            fill="url(#spoke-chrome)"
            filter="url(#hub-shadow)"
          />
          <line x1="44" y1="65" x2="44" y2="88" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
          <line x1="56" y1="65" x2="56" y2="88" stroke="#334155" strokeWidth="1" opacity="0.8" />
          {/* Center Vertical Spoke Hollow Slot */}
          <rect x="48.5" y="70" width="3" height="14" rx="1.5" fill="#090D16" />

          {/* ===================================================================== */}
          {/* C. CENTER 3D COCKPIT HUB & ROAD HORIZON DISPLAY */}
          {/* ===================================================================== */}
          {/* Center Hub Outer Rim */}
          <circle
            cx="50"
            cy="50"
            r="23"
            fill="url(#road-chamber)"
            stroke="url(#spoke-chrome)"
            strokeWidth="2.5"
            filter="url(#hub-shadow)"
          />

          {/* Inner Tarmac Boundary (Cockpit Horizon Window) */}
          <circle
            cx="50"
            cy="50"
            r="20.5"
            fill="#090D16"
            stroke="rgba(0,0,0,0.8)"
            strokeWidth="1"
          />

          {/* ----------------------------------------------------------------- */}
          {/* D. THE HIGHWAY AHEAD (Perspective Road Vanishing to Horizon) */}
          {/* ----------------------------------------------------------------- */}
          {/* Perspective Tarmac Surface */}
          <path
            d="M34 69 L47 34 L53 34 L66 69 Z"
            fill="url(#highway-tarmac)"
          />

          {/* Highway Left Verge Marking */}
          <line
            x1="34"
            y1="69"
            x2="47"
            y2="34"
            stroke="#6366F1"
            strokeWidth="1.2"
            opacity="0.8"
          />

          {/* Highway Right Verge Marking */}
          <line
            x1="66"
            y1="69"
            x2="53"
            y2="34"
            stroke="#6366F1"
            strokeWidth="1.2"
            opacity="0.8"
          />

          {/* Center Dashed Lane Markings (Moving / Accelerating Forward) */}
          <line
            x1="50"
            y1="68"
            x2="50"
            y2="35"
            stroke="url(#road-lane-glow)"
            strokeWidth="1.8"
            strokeDasharray="3 2"
            strokeLinecap="round"
          />

          {/* Horizon Vanishing Point Light / Destination Beacon */}
          <circle
            cx="50"
            cy="33"
            r="4.5"
            fill="#22D3EE"
            className={animated ? "animate-pulse" : ""}
            opacity="0.9"
          />
          <circle cx="50" cy="33" r="1.5" fill="#FFFFFF" />

          {/* ----------------------------------------------------------------- */}
          {/* E. 3D TRAINING VEHICLE SILHOUETTE (Taking the Road) */}
          {/* ----------------------------------------------------------------- */}
          {/* Headlight Beam Illuminating the Road */}
          <polygon
            points="46,55 42,42 58,42 54,55"
            fill="rgba(34, 211, 238, 0.22)"
          />

          {/* Vehicle Aerodynamic Body */}
          <path
            d="M44 63 C44 58 46 54 50 54 C54 54 56 58 56 63 L57 65 C57 66 55 67 50 67 C45 67 43 66 43 65 Z"
            fill="url(#car-metal)"
            stroke="#FFFFFF"
            strokeWidth="0.8"
          />
          {/* Windshield */}
          <polygon
            points="46,59 47,56 53,56 54,59"
            fill="#090D16"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="0.5"
          />
          {/* Dual Headlights */}
          <circle cx="45" cy="62" r="1" fill="#22D3EE" />
          <circle cx="55" cy="62" r="1" fill="#22D3EE" />

          {/* ===================================================================== */}
          {/* F. SPECULAR CURVED GLASS SHEEN (Cockpit Dome Depth) */}
          {/* ===================================================================== */}
          <path
            d="M32 44 C34 35 41 31 50 31 C59 31 66 35 68 44 C58 39 42 39 32 44 Z"
            fill="url(#glass-arc)"
            pointerEvents="none"
          />
        </svg>
      </div>
    </div>
  );
}

export default NextDriveLogo;
