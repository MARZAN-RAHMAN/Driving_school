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
  const [itemsPerView, setItemsPerView] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive items-per-view calculation
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setItemsPerView(1); // Mobile: 1 card
      } else if (width < 1024) {
        setItemsPerView(2); // Tablet: 2 cards
      } else {
        setItemsPerView(3); // Desktop: 3 cards
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = activeInstructors.length;
  const maxIndex = Math.max(0, total - itemsPerView);
  const currentIndex = Math.min(activeIndex, maxIndex);

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

  // Touch handlers for mobile swipe
  const minSwipeDistance = 45;
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    setTimeout(() => setIsPaused(false), 2000);
  };

  // Autoplay with slow 5.5s interval (pauses on interaction, hover, focus)
  useEffect(() => {
    if (isPaused || total <= itemsPerView) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, handleNext, total, itemsPerView]);

  if (activeInstructors.length === 0) {
    return null;
  }

  // Calculate center item on desktop
  const centerItemIndex = itemsPerView === 3 ? currentIndex + 1 : currentIndex;

  return (
    <div
      className="relative focus:outline-hidden"
      ref={carouselRef}
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
      {/* Top Header & Navigation Controls */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2 border border-primary/20">
            <Award className="w-3.5 h-3.5" />
            <span>CERTIFIED INSTRUCTORS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Meet Our Grade A ADI Fleet
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Every instructor is fully qualified, DBS checked and operates modern dual-control vehicles.
          </p>
        </div>

        {/* Desktop & Tablet Previous/Next Arrows */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous instructor"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted/80 hover:text-primary transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-semibold">Previous</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next instructor"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted/80 hover:text-primary transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
          >
            <span className="text-xs font-semibold">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div
        className="overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out will-change-transform"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
          }}
        >
          {activeInstructors.map((inst, index) => {
            const isCenterProminent =
              itemsPerView === 3 && index === centerItemIndex;
            const isCurrentActive = index === currentIndex;

            // Clean transmission badge label
            const transmissionLabel =
              inst.transmission === "BOTH"
                ? "Dual Transmission"
                : `${inst.transmission.charAt(0) + inst.transmission.slice(1).toLowerCase()} Specialist`;

            const imageAlt = `${inst.name}, DVSA driving instructor with dual-control vehicle`;

            return (
              <div
                key={inst.id}
                className="shrink-0 px-3 transition-all duration-300"
                style={{
                  width: `${100 / itemsPerView}%`,
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}: ${inst.name}`}
              >
                <div
                  className={`group relative flex flex-col h-full rounded-2xl border bg-card text-card-foreground overflow-hidden transition-all duration-300 ${
                    isCenterProminent
                      ? "border-primary/60 shadow-lg ring-1 ring-primary/30 md:scale-[1.01]"
                      : "border-border shadow-xs hover:border-primary/40 hover:shadow-md"
                  }`}
                >
                  {/* Instructor Large Featured Image */}
                  <div className="relative aspect-[16/11] sm:aspect-[4/3] w-full overflow-hidden bg-muted/60">
                    <img
                      src={inst.avatar}
                      alt={imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        // High-grade SVG fallback avatar
                        const target = e.currentTarget;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          inst.name
                        )}&background=4F46E5&color=fff&size=512`;
                      }}
                    />

                    {/* Gradient Overlay for visual polish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80" />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10 shadow-xs">
                        <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                        {inst.grade || "Grade A ADI"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white/90 font-mono text-[10px] font-bold border border-white/10">
                        {inst.badgeNumber}
                      </span>
                    </div>

                    {/* Overlay Vehicle Badge at bottom of image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card/90 dark:bg-card/90 backdrop-blur-md text-foreground text-xs font-semibold shadow-xs">
                        <Car className="w-3.5 h-3.5 text-primary" />
                        <span className="truncate max-w-[200px]">{inst.vehicle.replace(/\s*\(Dual Controls\)/i, "")}</span>
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
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

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Name & Availability Pill */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                            {inst.name}
                          </h3>
                          <p className="text-xs text-muted-foreground font-medium mt-0.5">
                            DVSA Certified Driving Instructor
                          </p>
                        </div>

                        {/* Availability Pill */}
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                          AVAILABLE
                        </span>
                      </div>

                      {/* Ratings & Passes Metric */}
                      <div className="mt-3.5 flex items-center gap-2 text-xs">
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

                      {/* Transmission & Speciality Description */}
                      <div className="mt-3.5 pt-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">
                          {transmissionLabel}
                        </span>
                        <span className="text-[11px] font-semibold text-primary">
                          Dual-Control Fitted
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-5 pt-4 border-t border-border grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedInstructor(inst)}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-border bg-surface-secondary/70 hover:bg-muted text-foreground text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
                        aria-label={`View full profile and credentials for ${inst.name}`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-primary" />
                        <span>View Profile</span>
                      </button>

                      <BookLessonButton
                        course={
                          inst.transmission === "AUTOMATIC"
                            ? "Automatic Driving Lessons"
                            : "Beginner Driving Lessons"
                        }
                        source={`instructor-carousel-${inst.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer"
                        ariaLabel={`Book driving lessons with ${inst.name}`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
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

      {/* Pagination Dots & Navigation Indicators */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pagination Dots */}
        <div
          className="flex items-center gap-2"
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
                className={`h-2.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden cursor-pointer ${
                  isActive
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-border hover:bg-muted-foreground/40"
                }`}
              />
            );
          })}
        </div>

        {/* Counter & Mobile Helper */}
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="font-mono font-medium">
            Showing {currentIndex + 1}–{Math.min(currentIndex + itemsPerView, total)} of {total} Grade A ADIs
          </span>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <span className="hidden sm:inline text-[11px]">
            {isPaused ? "Autoplay paused" : "Auto-advancing"}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INSTRUCTOR PROFILE & CREDENTIALS MODAL */}
      {/* ========================================================================= */}
      {selectedInstructor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="instructor-modal-title"
          onClick={() => setSelectedInstructor(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground shadow-2xl p-6 sm:p-7 overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedInstructor(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              aria-label="Close instructor profile"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              <img
                src={selectedInstructor.avatar}
                alt={selectedInstructor.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-primary/30"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    id="instructor-modal-title"
                    className="text-xl font-bold text-foreground"
                  >
                    {selectedInstructor.name}
                  </h3>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground border border-border">
                    {selectedInstructor.badgeNumber}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2 text-xs">
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
              <div className="mt-2.5 flex items-center gap-2">
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
            <div className="mt-7 pt-5 border-t border-border flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedInstructor(null)}
                className="px-4 py-2.5 rounded-xl border border-border bg-card text-foreground hover:bg-muted text-xs font-semibold transition-colors cursor-pointer"
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
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground text-xs font-semibold shadow-xs transition-colors cursor-pointer"
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
