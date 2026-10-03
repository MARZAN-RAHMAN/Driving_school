import React from "react";

export type HaloPosition =
  | "center"
  | "top"
  | "top-right"
  | "top-left"
  | "bottom"
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "left"
  | "right";

export type HaloVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "dual"
  | "tricolor";

export type HaloSize = "sm" | "md" | "lg" | "xl" | "full";

interface AmbientHaloProps {
  position?: HaloPosition;
  variant?: HaloVariant;
  size?: HaloSize;
  animate?: boolean;
  className?: string;
}

export function AmbientHalo({
  position = "center",
  variant = "primary",
  size = "lg",
  animate = true,
  className = "",
}: AmbientHaloProps) {
  // Positional positioning classes
  let positionClasses = "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  switch (position) {
    case "top":
      positionClasses = "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2";
      break;
    case "top-right":
      positionClasses = "right-0 top-0 translate-x-1/4 -translate-y-1/4";
      break;
    case "top-left":
      positionClasses = "left-0 top-0 -translate-x-1/4 -translate-y-1/4";
      break;
    case "bottom":
    case "bottom-center":
      positionClasses = "left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2";
      break;
    case "bottom-left":
      positionClasses = "left-0 bottom-0 -translate-x-1/4 translate-y-1/4";
      break;
    case "bottom-right":
      positionClasses = "right-0 bottom-0 translate-x-1/4 translate-y-1/4";
      break;
    case "left":
      positionClasses = "left-0 top-1/2 -translate-x-1/3 -translate-y-1/2";
      break;
    case "right":
      positionClasses = "right-0 top-1/2 translate-x-1/3 -translate-y-1/2";
      break;
    case "center":
    default:
      positionClasses = "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
      break;
  }

  // Size dimensions
  let sizeClasses = "w-[600px] h-[400px]";
  switch (size) {
    case "sm":
      sizeClasses = "w-[300px] h-[200px]";
      break;
    case "md":
      sizeClasses = "w-[450px] h-[300px]";
      break;
    case "lg":
      sizeClasses = "w-[700px] h-[450px]";
      break;
    case "xl":
      sizeClasses = "w-[900px] h-[550px]";
      break;
    case "full":
      sizeClasses = "w-[1100px] h-[650px]";
      break;
  }

  // Animation class
  const animationClass = animate ? "animate-halo-pulse" : "";

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        className={`absolute rounded-full filter blur-[110px] sm:blur-[140px] opacity-70 dark:opacity-40 transition-opacity will-change-transform ${positionClasses} ${sizeClasses} ${animationClass} ${className}`}
        style={{
          background:
            variant === "primary"
              ? "radial-gradient(circle, var(--halo-primary) 0%, transparent 70%)"
              : variant === "secondary"
              ? "radial-gradient(circle, var(--halo-secondary) 0%, transparent 70%)"
              : variant === "accent"
              ? "radial-gradient(circle, var(--halo-accent) 0%, transparent 70%)"
              : variant === "dual"
              ? "radial-gradient(ellipse at 35% 45%, var(--halo-primary) 0%, var(--halo-secondary) 45%, transparent 75%)"
              : "radial-gradient(ellipse at 40% 40%, var(--halo-primary) 0%, var(--halo-secondary) 40%, var(--halo-accent) 65%, transparent 80%)",
        }}
      />
    </div>
  );
}

export default AmbientHalo;
