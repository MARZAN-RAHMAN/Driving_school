"use client";

import { useEffect, useRef } from "react";
import { useBookingModal } from "@/context/BookingModalContext";

interface VisitorBookingPopupTriggerProps {
  /**
   * Delay in milliseconds before triggering the visitor modal.
   * Defaults to 10000 (10 seconds).
   */
  delayMs?: number;
}

export function VisitorBookingPopupTrigger({
  delayMs = 10000,
}: VisitorBookingPopupTriggerProps) {
  const { isOpen, openBookingModal } = useBookingModal();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;

    // Check if user has already seen or dismissed the popup in this session
    const hasSeenPopup = sessionStorage.getItem("nextdrive_visitor_popup_seen");
    if (hasSeenPopup) return;

    timerRef.current = setTimeout(() => {
      // Don't interrupt if modal is already opened by the user
      if (!isOpen) {
        sessionStorage.setItem("nextdrive_visitor_popup_seen", "true");
        openBookingModal({
          source: "timed-visitor-popup",
        });
      }
    }, delayMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [delayMs, isOpen, openBookingModal]);

  return null;
}
