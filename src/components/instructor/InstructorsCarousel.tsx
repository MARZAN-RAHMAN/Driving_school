/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Car,
  CheckCircle2,
  ShieldCheck,
  Award,
  MapPin,
  Sparkles,
  X,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { Instructor } from "@/types";
import { BookLessonButton } from "@/components/booking/BookLessonButton";

interface InstructorsCarouselProps {
  instructors: Instructor[];
}

/**
 * Ensures instructor profile photos are framed as professional portraits
 * with natural headroom, hair, neck, and shoulders, preventing aggressive
 * CDN face-zooming or forehead/chin cropping.
 */
function getFramedAvatar(url?: string): string {
  if (!url) return "";
  if (url.includes("images.unsplash.com")) {
    return url
      .replace(/([?&])w=\d+/, "$1w=800")
      .replace(/([?&])h=\d+/, "$1h=800")
      .replace(/([?&])crop=faces(&|$)/g, "$1")
      .replace(/[?&]$/, "");
  }
  return url;
}

export function InstructorsCarousel({ instructors }: InstructorsCarouselProps) {
  // Only display active instructors
  const activeInstructors = instructors.filter(
    (inst) => inst.status === "ACTIVE" || !inst.status
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isSwipingRef = useRef(false);

  // Measure exact inner viewport width to guarantee zero clipping & exact container alignment
  const updateDimensions = useCallback(() => {
    if (!viewportRef.current) return;
    const width = viewportRef.current.clientWidth;
    setViewportWidth(width);
  }, []);

  useEffect(() => {
    updateDimensions();

    const ro = new ResizeObserver(() => {
      updateDimensions();
    });

    if (viewportRef.current) {
      ro.observe(viewportRef.current);
    }

    window.addEventListener("resize", updateDimensions);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [updateDimensions]);

  // Breakpoint & dimensions calculation
  // Desktop (>= 1024px): 3 cards | Tablet (768px - 1023px): 2 cards | Mobile (< 768px): 1 card
  const isMobile = viewportWidth > 0 ? viewportWidth < 768 : false;
  const isTablet = viewportWidth > 0 ? viewportWidth >= 768 && viewportWidth < 1024 : false;
  const itemsPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const gap = isMobile ? 16 : 24; // 16px on mobile, 24px (1.5rem) on tablet & desktop

  // On desktop dialogs, lock body scroll; on mobile, keep page scrolling natural with zero scroll locking
  useEffect(() => {
    if (isMobile) return;
    if (selectedInstructor) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedInstructor, isMobile]);

  // Reset modal scroll position to top whenever a new instructor is selected
  const modalScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedInstructor && modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [selectedInstructor]);

  // Dynamically measure actual sticky header height for seamless mobile positioning
  const [headerHeight, setHeaderHeight] = useState(64);
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerEl = document.querySelector("header");
      if (headerEl) {
        const measured = Math.round(headerEl.getBoundingClientRect().height);
        if (measured > 0) {
          setHeaderHeight(measured);
        }
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Global Escape key to dismiss instructor profile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedInstructor) {
        setSelectedInstructor(null);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [selectedInstructor]);

  const total = activeInstructors.length;
  const maxIndex = Math.max(0, total - itemsPerView);
  const currentIndex = Math.min(activeIndex, maxIndex);

  // Exact card width in pixels derived directly from available viewport container
  const cardWidth =
    viewportWidth > 0
      ? (viewportWidth - (itemsPerView - 1) * gap) / itemsPerView
      : 0;

  // Exact translation in pixels: shifts by exactly (cardWidth + gap)
  const translateX = currentIndex * (cardWidth + gap);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => {
      const cur = Math.min(prev, maxIndex);
      return cur > 0 ? cur - 1 : maxIndex;
    });
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => {
      const cur = Math.min(prev, maxIndex);
      return cur < maxIndex ? cur + 1 : 0;
    });
  }, [maxIndex]);

  const handleGoTo = (index: number) => {
    setActiveIndex(Math.min(Math.max(0, index), maxIndex));
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Direction-aware mobile touch swipe handlers:
  // Allows native vertical page scrolling while enabling smooth horizontal card swipes
  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    isSwipingRef.current = false;
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartRef.current.x;
    const diffY = currentY - touchStartRef.current.y;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    // If vertical movement dominates, user is scrolling the page vertically:
    // Do NOT lock or interfere with native page scrolling
    if (absY > absX) {
      return;
    }

    // Only if horizontal movement is distinctly greater than vertical and past jitter threshold:
    if (absX > absY && absX > 10) {
      isSwipingRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    if (isSwipingRef.current && e.changedTouches && e.changedTouches.length > 0) {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = endX - touchStartRef.current.x;
      const diffY = endY - touchStartRef.current.y;
      const absX = Math.abs(diffX);
      const absY = Math.abs(diffY);

      // Must be primarily horizontal and exceed minimum swipe distance
      if (absX > minSwipeDistance && absX > absY * 1.25) {
        if (diffX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }

    touchStartRef.current = null;
    isSwipingRef.current = false;
    setTimeout(() => setIsPaused(false), 3000);
  };

  // Autoplay only on desktop/devices with pointer hover; disabled on mobile
  // so it never interferes with reading credentials or mobile vertical scrolling
  useEffect(() => {
    if (isMobile || isPaused || total <= itemsPerView) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, handleNext, total, itemsPerView, isMobile]);

  if (activeInstructors.length === 0) {
    return null;
  }

  // Active / prominent card index (center card on desktop)
  const centerItemIndex = itemsPerView === 3 ? currentIndex + 1 : currentIndex;

  return (
    <div
      className="relative w-full max-w-full overflow-hidden focus:outline-hidden"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Meet Our Grade A ADI Fleet Carousel"
    >
      {/* 1. Header & Controls: Aligns cleanly to container boundaries */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2.5 border border-primary/20">
            <Award className="w-3.5 h-3.5" />
            <span>CERTIFIED INSTRUCTORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Meet Our Grade A ADI Fleet
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Every instructor is fully qualified, DBS checked and operates modern dual-control vehicles.
          </p>
        </div>

        {/* Previous & Next Buttons: 44px min touch target */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous instructor"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-border bg-card text-foreground hover:bg-muted hover:text-primary transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-semibold">Previous</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next instructor"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 min-h-[44px] rounded-xl border border-border bg-card text-foreground hover:bg-muted hover:text-primary transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
          >
            <span className="text-xs font-semibold">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Carousel Viewport: strictly contained with overflow-hidden and pan-y touch-action */}
      <div
        ref={viewportRef}
        className="w-full max-w-full overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* 3. Carousel Track: translated by exact pixel offset */}
        <div
          className="flex items-stretch transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translateX(-${translateX}px)`,
            gap: `${gap}px`,
            touchAction: "pan-y",
          }}
        >
          {activeInstructors.map((inst, index) => {
            const isCenterProminent =
              itemsPerView === 3 && index === centerItemIndex;

            const transmissionLabel =
              inst.transmission === "BOTH"
                ? "Dual Transmission"
                : `${inst.transmission.charAt(0) + inst.transmission.slice(1).toLowerCase()} Specialist`;

            const imageAlt = `${inst.name}, DVSA driving instructor with dual-control vehicle`;

            return (
              <div
                key={inst.id}
                className="shrink-0 flex flex-col transition-all duration-300 min-w-0 max-w-full"
                style={{
                  width: cardWidth > 0 ? `${cardWidth}px` : "100%",
                  flex: cardWidth > 0 ? `0 0 ${cardWidth}px` : "0 0 100%",
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}: ${inst.name}`}
              >
                <div
                  className={`group relative flex flex-col h-full rounded-2xl border bg-card text-card-foreground overflow-hidden transition-all duration-300 ${
                    isCenterProminent
                      ? "border-primary ring-1 ring-primary/40 shadow-md"
                      : "border-border shadow-xs hover:border-primary/40 hover:shadow-md"
                  }`}
                >
                  {/* Instructor Image Frame: Consistent 4/3 portrait photography aspect ratio */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/60">
                    <img
                      src={getFramedAvatar(inst.avatar)}
                      alt={imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 sm:group-hover:scale-[1.02]"
                      style={{
                        objectPosition: `${inst.avatarPositionX ?? 50}% ${inst.avatarPositionY ?? 20}%`,
                        transform:
                          inst.avatarZoom && inst.avatarZoom > 1
                            ? `scale(${inst.avatarZoom})`
                            : undefined,
                      }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          inst.name
                        )}&background=4F46E5&color=fff&size=512`;
                      }}
                    />

                    {/* Subtle Overlay Gradient at bottom for badges readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent pointer-events-none" />

                    {/* Bottom Badges: Grade A on left, ADI badge number on right (Headroom & face kept 100% clear) */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/15 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>{inst.grade || "Grade A ADI"}</span>
                      </span>

                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 font-mono text-[10px] font-bold border border-white/15 shadow-xs">
                        {inst.badgeNumber}
                      </span>
                    </div>
                  </div>

                  {/* Card Content: naturally expanding height */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Name & Availability Status: responsive flex layout */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-lg sm:text-xl font-bold text-card-foreground group-hover:text-primary transition-colors truncate">
                            {inst.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium mt-1">
                            <Car className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate">{inst.vehicle.replace(/\s*\(Dual Controls\)/i, "")}</span>
                          </div>
                        </div>

                        {/* Availability Status Badge */}
                        <div className="self-start sm:self-auto shrink-0">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            AVAILABLE FOR BOOKING
                          </span>
                        </div>
                      </div>

                      {/* Rating & Verified Passes */}
                      <div className="mt-3.5 flex items-center gap-2 text-xs flex-wrap">
                        <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{inst.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-muted-foreground font-medium">
                          {inst.totalPasses} verified passes
                        </span>
                        <span className="text-muted-foreground/40">•</span>
                        <span className="text-muted-foreground text-[11px]">
                          {inst.activeStudents} active learners
                        </span>
                      </div>

                      {/* Transmission & Dual-Control Status */}
                      <div className="mt-3.5 pt-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {transmissionLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-primary">
                          Dual-Control Fitted
                        </span>
                      </div>
                    </div>

                    {/* Dual Action Buttons: Stacks on mobile for 44px touch targets; side-by-side on sm+ */}
                    <div className="mt-5 pt-4 border-t border-border flex flex-col sm:grid sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedInstructor(inst)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 min-h-[44px] rounded-xl border border-border bg-surface-secondary/70 hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
                        aria-label={`View full profile and credentials for ${inst.name}`}
                      >
                        <UserCheck className="w-4 h-4 text-primary shrink-0" />
                        <span>View Profile</span>
                      </button>

                      <BookLessonButton
                        course={
                          inst.transmission === "AUTOMATIC"
                            ? "Automatic Driving Lessons"
                            : "Beginner Driving Lessons"
                        }
                        source={`instructor-carousel-${inst.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="w-full flex items-center justify-center gap-2 px-3 py-3 sm:py-2.5 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs sm:text-sm font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
                        ariaLabel={`Book driving lessons with ${inst.name}`}
                      >
                        <Sparkles className="w-4 h-4 shrink-0" />
                        <span>Book With {inst.name.split(" ")[0]}</span>
                      </BookLessonButton>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Pagination Dots & Status Information: aligned within container */}
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pagination Dots with comfortable 40px touch zone */}
        <div
          className="flex items-center gap-1 sm:gap-2"
          role="tablist"
          aria-label="Instructor Carousel Pagination"
        >
          {Array.from({ length: maxIndex + 1 }).map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleGoTo(idx)}
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to instructor slide ${idx + 1} of ${maxIndex + 1}`}
                className="relative py-2 px-1 focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-border hover:bg-muted-foreground/40"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Counter and Status */}
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="font-mono font-medium">
            Showing {currentIndex + 1}–{Math.min(currentIndex + itemsPerView, total)} of {total} Grade A ADIs
          </span>
          {!isMobile && (
            <>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-[11px]">
                {isPaused ? "Autoplay paused" : "Auto-advancing"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 5. Instructor Profile & Credentials View / Modal */}
      {selectedInstructor && (
        <div
          ref={modalScrollRef}
          className="fixed inset-0 z-40 sm:z-50 flex flex-col justify-start sm:items-center sm:justify-center overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          style={{
            paddingTop: isMobile
              ? `calc(var(--mobile-header-height, ${headerHeight}px) + 12px)`
              : undefined,
            paddingBottom: isMobile ? "24px" : undefined,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="instructor-modal-title"
          onClick={() => setSelectedInstructor(null)}
        >
          <div
            className="relative w-full max-w-full sm:max-w-xl sm:min-h-0 bg-card text-card-foreground shadow-2xl p-4 sm:p-7 rounded-t-3xl sm:rounded-2xl border border-border max-h-none sm:max-h-[88vh] overflow-visible sm:overflow-y-auto flex flex-col justify-between my-0 sm:my-auto"
            style={{
              minHeight: isMobile
                ? `calc(100dvh - var(--mobile-header-height, ${headerHeight}px) - 24px)`
                : undefined,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Profile Navigation Row (Completely visible below fixed header with 12px breathing room) */}
            <div className="flex items-center justify-between gap-2 sm:hidden w-full pb-3.5 mb-4 border-b border-border/80">
              {/* LEFT: Back to Fleet */}
              <button
                type="button"
                onClick={() => setSelectedInstructor(null)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-secondary text-foreground hover:bg-muted active:scale-95 transition-all text-xs font-semibold min-h-[44px] shrink-0 border border-border/80 cursor-pointer shadow-2xs"
                aria-label="Back to instructors fleet"
              >
                <ChevronLeft className="w-4 h-4 text-primary shrink-0" />
                <span className="whitespace-nowrap">Back to Fleet</span>
              </button>

              {/* CENTER/RIGHT: Grade A Badge */}
              <div className="flex items-center justify-center min-w-0 flex-1 px-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-primary/10 text-primary border border-primary/20 truncate max-w-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{selectedInstructor.grade || "Grade A ADI"}</span>
                </span>
              </div>

              {/* RIGHT: Close Button */}
              <button
                type="button"
                onClick={() => setSelectedInstructor(null)}
                className="inline-flex items-center justify-center rounded-xl bg-surface-secondary text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all min-h-[44px] min-w-[44px] shrink-0 border border-border/80 cursor-pointer shadow-2xs"
                aria-label="Close instructor profile"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Close Button (Visible on sm+ screens) */}
            <button
              type="button"
              onClick={() => setSelectedInstructor(null)}
              className="hidden sm:flex absolute top-5 right-5 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer z-20 min-h-[44px] min-w-[44px] items-center justify-center border border-border/60"
              aria-label="Close instructor profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              {/* Mobile Hero Image: Responsive full width card */}
              <div className="sm:hidden relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted/60 border border-border shadow-xs">
                <img
                  src={getFramedAvatar(selectedInstructor.avatar)}
                  alt={`${selectedInstructor.name}, DVSA Grade A driving instructor`}
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: `${selectedInstructor.avatarPositionX ?? 50}% ${selectedInstructor.avatarPositionY ?? 20}%`,
                    transform:
                      selectedInstructor.avatarZoom && selectedInstructor.avatarZoom > 1
                        ? `scale(${selectedInstructor.avatarZoom})`
                        : undefined,
                  }}
                  loading="eager"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedInstructor.name
                    )}&background=4F46E5&color=fff&size=512`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                    <span>{selectedInstructor.grade || "Grade A ADI"}</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 font-mono text-[10px] font-bold border border-white/10">
                    {selectedInstructor.badgeNumber}
                  </span>
                </div>
              </div>

              {/* Desktop Profile Header (Horizontal) */}
              <div className="hidden sm:flex items-start gap-4 pr-10">
                <img
                  src={getFramedAvatar(selectedInstructor.avatar)}
                  alt={selectedInstructor.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-primary/30 shrink-0 shadow-xs"
                  style={{
                    objectPosition: `${selectedInstructor.avatarPositionX ?? 50}% ${selectedInstructor.avatarPositionY ?? 20}%`,
                    transform:
                      selectedInstructor.avatarZoom && selectedInstructor.avatarZoom > 1
                        ? `scale(${selectedInstructor.avatarZoom})`
                        : undefined,
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      selectedInstructor.name
                    )}&background=4F46E5&color=fff&size=512`;
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      id="instructor-modal-title"
                      className="text-lg sm:text-xl font-bold text-foreground truncate"
                    >
                      {selectedInstructor.name}
                    </h3>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground border border-border shrink-0">
                      {selectedInstructor.badgeNumber}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs flex-wrap">
                    <div className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{selectedInstructor.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-muted-foreground font-medium">
                      ({selectedInstructor.totalPasses} verified passes)
                    </span>
                  </div>

                  <div className="mt-1 text-xs text-primary font-semibold">
                    {selectedInstructor.grade || "DVSA Grade A Approved Driving Instructor"}
                  </div>
                </div>
              </div>

              {/* Mobile Profile Header Info (Below Mobile Hero Image) */}
              <div className="sm:hidden mt-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    AVAILABLE FOR BOOKING
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground border border-border">
                    DVSA Certified
                  </span>
                </div>

                <h3
                  id="instructor-modal-title-mobile"
                  className="text-2xl font-extrabold text-foreground mt-2 break-words leading-tight"
                >
                  {selectedInstructor.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {selectedInstructor.grade || "DVSA Grade A Approved Driving Instructor"}
                </p>

                <div className="mt-2.5 flex items-center gap-2 text-xs flex-wrap">
                  <div className="flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedInstructor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-muted-foreground font-medium">
                    {selectedInstructor.totalPasses} verified passes
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="text-muted-foreground text-[11px]">
                    {selectedInstructor.activeStudents} active learners
                  </span>
                </div>
              </div>

              {/* Vehicle & Specs (Responsive, wrapping, min-w-0) */}
              <div className="mt-5 rounded-2xl bg-surface-secondary/70 p-4 border border-border w-full min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <Car className="w-4 h-4 text-primary shrink-0" />
                  <span>Dual-Control Fleet Vehicle:</span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm font-bold text-foreground break-words leading-snug">
                  {selectedInstructor.vehicle}
                </p>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {selectedInstructor.transmission === "BOTH"
                      ? "Dual Transmission"
                      : `${selectedInstructor.transmission} Specialist`}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success bg-success/10 px-2 py-0.5 rounded-md border border-success/20">
                    <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                    He-Man Dual Controls Fitted
                  </span>
                </div>
              </div>

              {/* Bio */}
              {selectedInstructor.bio && (
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    About Instructor
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm text-foreground/90 leading-relaxed break-words">
                    {selectedInstructor.bio}
                  </p>
                </div>
              )}

              {/* Qualifications */}
              {selectedInstructor.qualifications && selectedInstructor.qualifications.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    Accreditations &amp; Certifications
                  </h4>
                  <ul className="mt-2 space-y-2 text-xs text-foreground">
                    {selectedInstructor.qualifications.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                        <span className="break-words">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas Covered */}
              {selectedInstructor.areas && selectedInstructor.areas.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                    Test Centres &amp; Areas Covered
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedInstructor.areas.map((a, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-foreground text-[11px] font-medium border border-border"
                      >
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span>{a}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons: Stacked on mobile with 44px min touch targets; side-by-side on sm+ */}
            <div className="mt-8 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pb-8 sm:pb-0">
              <button
                type="button"
                onClick={() => setSelectedInstructor(null)}
                className="w-full sm:w-auto px-5 py-3 min-h-[44px] rounded-xl border border-border bg-surface-secondary text-foreground hover:bg-muted text-xs sm:text-sm font-semibold transition-colors cursor-pointer order-2 sm:order-1"
              >
                Close Profile
              </button>

              <BookLessonButton
                course={
                  selectedInstructor.transmission === "AUTOMATIC"
                    ? "Automatic Driving Lessons"
                    : "Beginner Driving Lessons"
                }
                source={`instructor-modal-${selectedInstructor.name.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setSelectedInstructor(null)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer order-1 sm:order-2"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Book Lessons With {selectedInstructor.name.split(" ")[0]}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </BookLessonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorsCarousel;
