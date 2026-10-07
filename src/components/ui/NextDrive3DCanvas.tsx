"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export type BackgroundVariant = "hero" | "full" | "subtle" | "route" | "locations" | "minimal";

interface NextDrive3DCanvasProps {
  variant?: BackgroundVariant;
  className?: string;
  speedMultiplier?: number;
  interactive?: boolean;
}

interface Particle3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  size: number;
  baseAlpha: number;
  color: "primary" | "secondary" | "accent";
}

interface LightTrail {
  laneIndex: number;
  progress: number;
  speed: number;
  length: number;
  color: "primary" | "accent" | "secondary";
  width: number;
}

export function NextDrive3DCanvas({
  variant = "hero",
  className = "",
  speedMultiplier = 1,
  interactive = true,
}: NextDrive3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax Coordinates (lerped from mouse)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isVisibleRef = useRef(true);
  const isDarkRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);

  // Animation progression offsets
  const roadOffsetRef = useRef(0);
  const radarRadiusRef = useRef(0);
  const trailsRef = useRef<LightTrail[]>([]);
  const particlesRef = useRef<Particle3D[]>([]);

  // Initialize particles based on variant
  const initParticles = useCallback((width: number, height: number, isHero: boolean) => {
    const count = isHero ? 24 : variant === "subtle" ? 10 : variant === "locations" ? 14 : 16;
    const colors: Array<"primary" | "secondary" | "accent"> = [
      "primary",
      "accent",
      "secondary",
      "primary",
    ];

    const particles: Particle3D[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 100, // 100 to 900 depth
        vx: (Math.random() - 0.5) * 0.12 * speedMultiplier,
        vy: (Math.random() - 0.5) * 0.12 * speedMultiplier,
        size: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.35 + 0.15,
        color: colors[i % colors.length],
      });
    }
    particlesRef.current = particles;
  }, [variant, speedMultiplier]);

  // Initialize light trails for perspective road
  const initTrails = useCallback(() => {
    const trailColors: Array<"primary" | "accent" | "secondary"> = [
      "primary",
      "accent",
      "primary",
      "secondary",
    ];
    const trails: LightTrail[] = [];
    const count = variant === "hero" ? 5 : variant === "full" ? 4 : variant === "route" ? 3 : 2;

    for (let i = 0; i < count; i++) {
      trails.push({
        laneIndex: i % 4, // 4 visual perspective lanes
        progress: (i / count) * 0.9 + Math.random() * 0.1,
        speed: (0.0016 + Math.random() * 0.0014) * speedMultiplier,
        length: 0.18 + Math.random() * 0.12,
        color: trailColors[i % trailColors.length],
        width: 1.5 + Math.random() * 1.2,
      });
    }
    trailsRef.current = trails;
  }, [variant, speedMultiplier]);

  // Main rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    // Detect dark mode
    const checkDark = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Detect reduced motion
    const motionMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotionRef.current = motionMediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    motionMediaQuery.addEventListener("change", handleMotionChange);

    // Detect pointer capability
    let hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const handlePointerChange = (e: MediaQueryListEvent) => {
      hasFinePointer = e.matches;
    };
    pointerQuery.addEventListener("change", handlePointerChange);

    // Global passive pointermove handler for parallax (works even with pointer-events-none)
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!hasFinePointer || !interactive || !isVisibleRef.current || prefersReducedMotionRef.current) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Only respond if pointer is reasonably near section
      if (
        e.clientY < rect.top - 200 ||
        e.clientY > rect.bottom + 200 ||
        e.clientX < rect.left - 200 ||
        e.clientX > rect.right + 200
      ) {
        mouseRef.current.targetX = 0;
        mouseRef.current.targetY = 0;
        return;
      }

      // Normalized [-1, 1] coordinates from center
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      mouseRef.current.targetX = Math.max(-1, Math.min(1, nx));
      mouseRef.current.targetY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener("pointermove", handleGlobalPointerMove, { passive: true });

    // Visibility observer to pause loop when scrolled out of viewport
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      intersectionObserver.observe(containerRef.current);
    }

    // Page visibility (tab switch)
    const handleVisibilityChange = () => {
      isVisibleRef.current =
        document.visibilityState === "visible" &&
        (containerRef.current
          ? containerRef.current.getBoundingClientRect().bottom > 0 &&
            containerRef.current.getBoundingClientRect().top < window.innerHeight
          : true);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Resize handler with High-DPI support
    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      initParticles(rect.width, rect.height, variant === "hero");
      initTrails();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Color resolver
    const getColor = (
      type: "primary" | "secondary" | "accent",
      alpha: number,
      isDark: boolean
    ) => {
      if (isDark) {
        switch (type) {
          case "primary":
            return `rgba(129, 140, 248, ${alpha})`; // Indigo
          case "secondary":
            return `rgba(167, 139, 250, ${alpha})`; // Violet
          case "accent":
            return `rgba(34, 211, 238, ${alpha})`; // Cyan
        }
      } else {
        switch (type) {
          case "primary":
            return `rgba(67, 56, 202, ${Math.min(1, alpha * 1.3)})`;
          case "secondary":
            return `rgba(109, 40, 217, ${Math.min(1, alpha * 1.3)})`;
          case "accent":
            return `rgba(8, 145, 178, ${Math.min(1, alpha * 1.35)})`;
        }
      }
    };

    // Render step
    let lastTime = performance.now();

    const render = (now: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isVisibleRef.current) return;

      const delta = Math.max(0, Math.min(now - lastTime, 45)); // non-negative frame delta capped at 45ms
      lastTime = now;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const isDark = isDarkRef.current;
      const reducedMotion = prefersReducedMotionRef.current;

      // Smooth mouse lerp
      if (!reducedMotion && interactive) {
        mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
        mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      }

      const parallaxX = mouseRef.current.x;
      const parallaxY = mouseRef.current.y;

      // =========================================================================
      // 1. DRAW 3D PERSPECTIVE ROAD / MOTION GRID (Hero, Full, and Route variants)
      // =========================================================================
      if (variant === "hero" || variant === "full" || variant === "route") {
        const horizonY = height * (variant === "hero" ? 0.32 : 0.42) + parallaxY * 8;
        const horizonX = width * (variant === "hero" ? 0.65 : 0.5) + parallaxX * 12;

        const roadBottomY = height + 40;
        const roadBottomWidth = Math.max(width * 1.1, 700);
        const roadLeftX = horizonX - roadBottomWidth * 0.5;
        const roadRightX = horizonX + roadBottomWidth * 0.5;

        // Animate road travel progression
        if (!reducedMotion) {
          roadOffsetRef.current =
            (roadOffsetRef.current + (delta * 0.00045 * speedMultiplier)) % 1;
        }

        // Perspective Rays / Road Lanes
        const laneCount = variant === "hero" ? 8 : 6;
        const gridAlphaBase = isDark ? 0.07 : 0.065;

        for (let i = 0; i <= laneCount; i++) {
          const t = i / laneCount;
          const bottomX = roadLeftX + t * (roadRightX - roadLeftX);

          // Center lanes have slightly higher prominence
          const isCenterLane = i === Math.floor(laneCount / 2);
          const laneAlpha = isCenterLane ? gridAlphaBase * 1.6 : gridAlphaBase;

          const grad = ctx.createLinearGradient(horizonX, horizonY, bottomX, roadBottomY);
          grad.addColorStop(0, getColor("primary", 0, isDark));
          grad.addColorStop(0.3, getColor("primary", laneAlpha * 0.6, isDark));
          grad.addColorStop(0.8, getColor("accent", laneAlpha * 1.3, isDark));
          grad.addColorStop(1, getColor("accent", 0, isDark));

          ctx.beginPath();
          ctx.strokeStyle = grad;
          ctx.lineWidth = isCenterLane ? 1.5 : 1;
          ctx.moveTo(horizonX, horizonY);
          ctx.lineTo(bottomX, roadBottomY);
          ctx.stroke();
        }

        // Transversal Cross-Lines (Perspective geometric acceleration toward viewer)
        const transversalCount = variant === "hero" ? 7 : 5;
        for (let j = 0; j < transversalCount; j++) {
          // Non-linear power scale to simulate 3D distance
          const rawProgress = (j / transversalCount + roadOffsetRef.current) % 1;
          const perspectiveDist = Math.pow(rawProgress, 2.6); // exponential spacing
          const y = horizonY + perspectiveDist * (roadBottomY - horizonY);

          // Interpolate left and right boundaries at this Y level
          const xLeft = horizonX + perspectiveDist * (roadLeftX - horizonX);
          const xRight = horizonX + perspectiveDist * (roadRightX - horizonX);

          const alpha =
            perspectiveDist < 0.15
              ? (perspectiveDist / 0.15) * gridAlphaBase
              : (1 - Math.pow(perspectiveDist, 3)) * gridAlphaBase * 1.2;

          if (alpha > 0.005) {
            const hGrad = ctx.createLinearGradient(xLeft, y, xRight, y);
            hGrad.addColorStop(0, getColor("primary", 0, isDark));
            hGrad.addColorStop(0.2, getColor("primary", alpha, isDark));
            hGrad.addColorStop(0.5, getColor("accent", alpha * 1.2, isDark));
            hGrad.addColorStop(0.8, getColor("secondary", alpha, isDark));
            hGrad.addColorStop(1, getColor("secondary", 0, isDark));

            ctx.beginPath();
            ctx.strokeStyle = hGrad;
            ctx.lineWidth = 1;
            ctx.moveTo(xLeft, y);
            ctx.lineTo(xRight, y);
            ctx.stroke();
          }
        }

        // =========================================================================
        // 2. LIGHT TRAILS (Fluid automotive streaks along perspective lanes)
        // =========================================================================
        const lanes = [
          { bottomFrac: 0.32, color: "primary" },
          { bottomFrac: 0.46, color: "accent" },
          { bottomFrac: 0.54, color: "primary" },
          { bottomFrac: 0.68, color: "secondary" },
        ];

        trailsRef.current.forEach((trail) => {
          if (!reducedMotion) {
            trail.progress = (trail.progress + trail.speed * (delta / 16)) % 1.2;
          }

          if (trail.progress > 0 && trail.progress < 1.1) {
            const lane = lanes[trail.laneIndex % lanes.length];
            const bottomX = roadLeftX + lane.bottomFrac * (roadRightX - roadLeftX);

            // Head and Tail in perspective coordinates
            const headP = Math.min(1, Math.max(0, trail.progress));
            const tailP = Math.max(0, trail.progress - trail.length);

            const headY = horizonY + Math.pow(headP, 2.4) * (roadBottomY - horizonY);
            const headX = horizonX + Math.pow(headP, 2.4) * (bottomX - horizonX);

            const tailY = horizonY + Math.pow(tailP, 2.4) * (roadBottomY - horizonY);
            const tailX = horizonX + Math.pow(tailP, 2.4) * (bottomX - horizonX);

            const trailGrad = ctx.createLinearGradient(tailX, tailY, headX, headY);
            const trailAlpha = isDark ? 0.38 : 0.30;
            trailGrad.addColorStop(0, getColor(trail.color, 0, isDark));
            trailGrad.addColorStop(0.6, getColor(trail.color, trailAlpha * 0.6, isDark));
            trailGrad.addColorStop(1, getColor(trail.color, trailAlpha, isDark));

            ctx.beginPath();
            ctx.strokeStyle = trailGrad;
            ctx.lineWidth = trail.width * (0.8 + headP * 1.4);
            ctx.lineCap = "round";
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(headX, headY);
            ctx.stroke();

            // Head beacon glow dot
            if (headP > 0.2 && headP < 0.95) {
              const beaconRadius = Math.max(0.1, trail.width * 1.4);
              ctx.beginPath();
              ctx.arc(headX, headY, beaconRadius, 0, Math.PI * 2);
              ctx.fillStyle = getColor(trail.color, isDark ? 0.65 : 0.45, isDark);
              ctx.fill();
            }
          }
        });
      }

      // =========================================================================
      // 2B. LOCATIONS VARIANT (Digital Navigation Radar & Coordinates)
      // =========================================================================
      if (variant === "locations") {
        const centerX = width * 0.5 + parallaxX * 10;
        const centerY = height * 0.5 + parallaxY * 8;
        const maxRadius = Math.max(width, height) * 0.45;

        if (maxRadius > 1) {
          if (!reducedMotion) {
            radarRadiusRef.current =
              ((radarRadiusRef.current + delta * 0.035 * speedMultiplier) % maxRadius + maxRadius) % maxRadius;
          }

          const radarPulseAlpha = isDark ? 0.08 : 0.05;
          const currR = Math.max(0, radarRadiusRef.current);

          // Concentric radar wave rings
          [0, maxRadius * 0.35, maxRadius * 0.7].forEach((offset) => {
            const rawR = ((currR + offset) % maxRadius + maxRadius) % maxRadius;
            const r = Math.max(0, rawR);
            const a = (1 - r / maxRadius) * radarPulseAlpha;
            if (r > 0.5 && a > 0.005) {
              ctx.beginPath();
              ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
              ctx.strokeStyle = getColor("accent", a, isDark);
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });

          // Subtle crosshair lines
          ctx.beginPath();
          ctx.strokeStyle = getColor("primary", isDark ? 0.04 : 0.025, isDark);
          ctx.lineWidth = 1;
          ctx.moveTo(centerX - 120, centerY);
          ctx.lineTo(centerX + 120, centerY);
          ctx.moveTo(centerX, centerY - 120);
          ctx.lineTo(centerX, centerY + 120);
          ctx.stroke();
        }
      }

      // =========================================================================
      // 3. DEPTH PARTICLES (3D coordinates with scale/alpha attenuation)
      // =========================================================================
      particlesRef.current.forEach((p) => {
        if (!reducedMotion) {
          p.x += p.vx * (delta / 16);
          p.y += p.vy * (delta / 16);
          p.z -= 0.12 * speedMultiplier * (delta / 16);

          // Wrap particles around 3D box
          if (p.z <= 50) p.z = 850;
          if (p.x > width * 0.7) p.x = -width * 0.7;
          if (p.x < -width * 0.7) p.x = width * 0.7;
          if (p.y > height * 0.7) p.y = -height * 0.7;
          if (p.y < -height * 0.7) p.y = height * 0.7;
        }

        // Perspective projection
        const fov = 400;
        const scale = fov / (fov + p.z);
        const projX = width * 0.5 + p.x * scale + parallaxX * (scale * 20);
        const projY = height * 0.5 + p.y * scale + parallaxY * (scale * 20);

        if (projX >= -20 && projX <= width + 20 && projY >= -20 && projY <= height + 20) {
          const depthAlpha = p.baseAlpha * scale * (isDark ? 1.1 : 0.7);
          const radius = Math.max(0.7, p.size * scale);

          ctx.beginPath();
          ctx.arc(projX, projY, radius, 0, Math.PI * 2);
          ctx.fillStyle = getColor(p.color, depthAlpha, isDark);
          ctx.fill();
        }
      });
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
      intersectionObserver.disconnect();
      motionMediaQuery.removeEventListener("change", handleMotionChange);
      pointerQuery.removeEventListener("change", handlePointerChange);
    };
  }, [variant, speedMultiplier, interactive, initParticles, initTrails]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full block transition-opacity duration-500"
      />
    </div>
  );
}
