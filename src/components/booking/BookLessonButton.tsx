"use client";

import React from "react";
import { useBookingModal } from "@/context/BookingModalContext";

interface BookLessonButtonProps {
  course?: string;
  area?: string;
  source?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function BookLessonButton({
  course,
  area,
  source = "general-cta",
  children,
  className,
  onClick,
  ariaLabel = "Book your driving lesson",
}: BookLessonButtonProps) {
  const { openBookingModal } = useBookingModal();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    openBookingModal({
      course,
      area,
      source,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}

export default BookLessonButton;
