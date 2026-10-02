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

  // Lock body scroll when instructor profile modal is open; cleanly restore on close
  useEffect(() => {
    if (selectedInstructor) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedInstructor]);

  // Breakpoint & dimensions calculation
  // Desktop (>= 1024px): 3 cards | Tablet (768px - 1023px): 2 cards | Mobile (< 768px): 1 card
  const isMobile = viewportWidth > 0 ? viewportWidth < 768 : false;
  const isTablet = viewportWidth > 0 ? viewportWidth >= 768 && viewportWidth < 1024 : false;
  const itemsPerView = isMobile ? 1 : isTablet ? 2 : 3;
  const gap = isMobile ? 16 : 24; // 16px on mobile, 24px (1.5rem) on tablet & desktop

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
                  {/* Instructor Image */}
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-muted/60">
                    <img
                      src={inst.avatar}
                      alt={imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          inst.name
                        )}&background=4F46E5&color=fff&size=512`;
                      }}
                    />

                    {/* Subtle Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-semibold border border-white/10 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        {inst.grade || "Grade A ADI"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 font-mono text-[10px] font-bold border border-white/10">
                        {inst.badgeNumber}
                      </span>
                    </div>

                    {/* Vehicle pill on image: constrained to prevent overflow on 375px */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-card/90 dark:bg-card/90 backdrop-blur-md text-foreground text-[11px] sm:text-xs font-semibold shadow-xs min-w-0 max-w-[72%]">
                        <Car className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="truncate">{inst.vehicle.replace(/\s*\(Dual Controls\)/i, "")}</span>
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shrink-0 ${
                          inst.transmission === "MANUAL"
                            ? "bg-primary text-primary-foreground"
                            : inst.transmission === "AUTOMATIC"
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-accent text-accent-foreground"
                        }`}
                      >
                        {inst.transmission}
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
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            DVSA Certified Driving Instructor
                          </p>
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

      {/* 5. Instructor Profile & Credentials Modal */}
      {selectedInstructor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="instructor-modal-title"
          onClick={() => setSelectedInstructor(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-5 sm:p-7 overflow-hidden max-h-[90vh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button: 44px touch area */}
            <button
              type="button"
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close instructor profile"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4 pr-8">
              <img
                src={selectedInstructor.avatar}
                alt={selectedInstructor.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-primary/30 shrink-0"
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

            {/* Vehicle & Specs */}
            <div className="mt-5 rounded-xl bg-surface-secondary/70 p-4 border border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Car className="w-4 h-4 text-primary" />
                <span>Dual-Control Fleet Vehicle:</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground font-medium">
                {selectedInstructor.vehicle}
              </p>
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {selectedInstructor.transmission === "BOTH"
                    ? "Dual Transmission"
                    : `${selectedInstructor.transmission} Specialist`}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Available for booking
                </span>
              </div>
            </div>

            {/* Bio */}
            {selectedInstructor.bio && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  About Instructor
                </h4>
                <p className="mt-1.5 text-xs sm:text-sm text-foreground leading-relaxed">
                  {selectedInstructor.bio}
                </p>
              </div>
            )}

            {/* Qualifications */}
            {selectedInstructor.qualifications && selectedInstructor.qualifications.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Accreditations &amp; Certifications
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-foreground">
                  {selectedInstructor.qualifications.map((q, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas Covered */}
            {selectedInstructor.areas && selectedInstructor.areas.length > 0 && (
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Test Centers &amp; Areas Covered
                </h4>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedInstructor.areas.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted text-foreground text-[11px] font-medium border border-border"
                    >
                      <MapPin className="w-3 h-3 text-primary" />
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Bottom CTA */}
            <div className="mt-7 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedInstructor(null)}
                className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>

              <BookLessonButton
                course={
                  selectedInstructor.transmission === "AUTOMATIC"
                    ? "Automatic Driving Lessons"
                    : "Beginner Driving Lessons"
                }
                source={`instructor-modal-${selectedInstructor.name.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setSelectedInstructor(null)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Book Lessons With {selectedInstructor.name.split(" ")[0]}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </BookLessonButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstructorsCarousel;
