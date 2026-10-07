/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

export function getUserInitials(name?: string): string {
  if (!name || !name.trim()) return "ND";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showStatusDot?: boolean;
  statusColor?: string;
}

const sizeClasses = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
  "2xl": "h-24 w-24 text-2xl font-bold",
};

const dotSizes = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
  xl: "h-3.5 w-3.5",
  "2xl": "h-4 w-4",
};

export function UserAvatar({
  src,
  name = "User",
  size = "md",
  className = "",
  showStatusDot = false,
  statusColor = "bg-emerald-500",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImageError(false);
  }

  const initials = getUserInitials(name);
  const hasValidImage = Boolean(src && !imageError);

  return (
    <div className={`relative inline-flex shrink-0 rounded-full ${sizeClasses[size]} ${className}`}>
      {hasValidImage ? (
        <img
          src={src as string}
          alt={`${name} profile photo`}
          onError={() => setImageError(true)}
          className="h-full w-full rounded-full object-cover object-center"
        />
      ) : (
        <div
          role="img"
          aria-label={`${name} avatar initials`}
          className="flex h-full w-full items-center justify-center rounded-full bg-primary font-bold text-primary-foreground select-none"
        >
          {initials}
        </div>
      )}

      {showStatusDot && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-card ${statusColor} ${dotSizes[size]}`}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
