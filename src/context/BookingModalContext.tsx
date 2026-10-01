"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import LeadBookingModal from "@/components/booking/LeadBookingModal";

export interface BookingModalOptions {
  course?: string;
  area?: string;
  source?: string;
}

interface BookingModalContextType {
  isOpen: boolean;
  options: BookingModalOptions;
  openBookingModal: (options?: BookingModalOptions) => void;
  closeBookingModal: () => void;
}

const BookingModalContext = createContext<BookingModalContextType | undefined>(undefined);

export function BookingModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<BookingModalOptions>({});

  const openBookingModal = useCallback((opts?: BookingModalOptions) => {
    if (opts) {
      setOptions(opts);
    } else {
      setOptions({});
    }
    setIsOpen(true);
  }, []);

  const closeBookingModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Listen to window-level custom events to allow triggering from any CTA or legacy links
  useEffect(() => {
    const handleEvent = (event: Event) => {
      const customEvent = event as CustomEvent<BookingModalOptions>;
      openBookingModal(customEvent.detail);
    };

    window.addEventListener("open-booking-modal", handleEvent);
    return () => {
      window.removeEventListener("open-booking-modal", handleEvent);
    };
  }, [openBookingModal]);

  return (
    <BookingModalContext.Provider
      value={{
        isOpen,
        options,
        openBookingModal,
        closeBookingModal,
      }}
    >
      {children}
      <LeadBookingModal
        isOpen={isOpen}
        onClose={closeBookingModal}
        initialCourse={options.course}
        initialArea={options.area}
        source={options.source}
      />
    </BookingModalContext.Provider>
  );
}

export function useBookingModal() {
  const context = useContext(BookingModalContext);
  if (!context) {
    throw new Error("useBookingModal must be used within a BookingModalProvider");
  }
  return context;
}

/**
 * Utility helper to open the booking modal from anywhere (e.g. vanilla links, header buttons)
 */
export function openBookingModalGlobal(options?: BookingModalOptions) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-booking-modal", {
        detail: options,
      })
    );
  }
}
