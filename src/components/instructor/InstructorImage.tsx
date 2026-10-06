/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import { Instructor } from "@/types";

interface InstructorImageProps {
  instructor: Pick<Instructor, "name"> & {
    avatar?: string;
    avatarPositionX?: number;
    avatarPositionY?: number;
    avatarZoom?: number;
  };
  alt?: string;
  aspectRatio?: "4/5" | "4/3" | "1/1" | "custom";
  className?: string;
  imgClassName?: string;
  fallbackSize?: "sm" | "md" | "lg" | "xl";
  priority?: boolean;
}

/**
 * Extracts 2-letter initials from instructor name (e.g. "Liam O'Connor" -> "LO")
 */
export function getInstructorInitials(name: string): string {
  if (!name) return "ADI";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Ensures external CDNs (like Unsplash) do not apply aggressive face-only crops
 * that cut off shoulders, neck or hair.
 */
function getOptimalAvatarSrc(url?: string): string {
  if (!url) return "";
  if (url.includes("images.unsplash.com")) {
    return url
      .replace(/([?&])w=\d+/, "$1w=800")
      .replace(/([?&])h=\d+/, "$1h=1000")
      .replace(/([?&])crop=faces(&|$)/g, "$1")
      .replace(/[?&]$/, "");
  }
  return url;
}

export function InstructorImage({
  instructor,
  alt,
  aspectRatio = "4/5",
  className = "",
  imgClassName = "",
  fallbackSize = "md",
}: InstructorImageProps) {
  const [hasError, setHasError] = useState(false);

  const name = instructor.name || "Instructor";
  const imageAlt = alt || `${name} - Approved Driving Instructor (ADI)`;
  const rawUrl = instructor.avatar;
  const optimalUrl = getOptimalAvatarSrc(rawUrl);

  const posX = instructor.avatarPositionX ?? 50;
  const posY = instructor.avatarPositionY ?? 20;

  const aspectClass =
    aspectRatio === "4/5"
      ? "aspect-[4/5]"
      : aspectRatio === "4/3"
      ? "aspect-[4/3]"
      : aspectRatio === "1/1"
      ? "aspect-square"
      : "";

  const initials = getInstructorInitials(name);

  // Gradient generator based on name hash for unique, consistent colors
  const gradientStyles = [
    "from-indigo-600 to-indigo-800",
    "from-teal-600 to-emerald-800",
    "from-blue-600 to-indigo-700",
    "from-slate-700 to-slate-900",
  ];
  const colorIndex = (name.charCodeAt(0) + name.length) % gradientStyles.length;
  const gradient = gradientStyles[colorIndex];

  const fontSizeClass =
    fallbackSize === "sm"
      ? "text-xs"
      : fallbackSize === "lg"
      ? "text-xl sm:text-2xl"
      : fallbackSize === "xl"
      ? "text-3xl sm:text-4xl"
      : "text-sm sm:text-base";

  if (!rawUrl || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${gradient} text-white font-bold select-none ${aspectClass} ${className}`}
        aria-label={`${name} (No photo uploaded)`}
      >
        <span className={fontSizeClass}>{initials}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${aspectClass} ${className}`}>
      <img
        src={optimalUrl}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        style={{
          objectFit: "cover",
          objectPosition: `${posX}% ${posY}%`,
          transform:
            instructor.avatarZoom && instructor.avatarZoom > 1
              ? `scale(${instructor.avatarZoom})`
              : undefined,
        }}
        className={`w-full h-full transition-transform duration-300 ${imgClassName}`}
      />
    </div>
  );
}
