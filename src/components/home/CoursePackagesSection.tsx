"use client";

import React, { useState } from "react";
import {
  Zap,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  Car,
  Sparkles,
  Award,
  GraduationCap,
  Layers,
} from "lucide-react";
import { LessonPackage } from "@/types";
import { BookLessonButton } from "@/components/booking/BookLessonButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AmbientHalo } from "@/components/ui/AmbientHalo";

interface CoursePackagesSectionProps {
  packages: LessonPackage[];
}

export function CoursePackagesSection({ packages }: CoursePackagesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  // Filter tabs calculation
  const beginnerCount = packages.filter(
    (p) => p.level.toLowerCase() === "beginner"
  ).length;
  const intensiveCount = packages.filter(
    (p) => p.level.toLowerCase() === "intensive"
  ).length;
  const passPlusCount = packages.filter(
    (p) => p.level.toLowerCase() === "pass plus"
  ).length;

  const filterTabs = [
    { id: "ALL", label: "All Courses", count: packages.length },
    { id: "Beginner", label: "Beginner", count: beginnerCount },
    { id: "Intensive", label: "Intensive", count: intensiveCount },
    { id: "Pass Plus", label: "Pass Plus", count: passPlusCount },
  ];

  const displayedPackages =
    activeFilter === "ALL"
      ? packages
      : packages.filter(
          (p) => p.level.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <section
      id="courses"
      className="relative py-20 lg:py-28 bg-surface-secondary/40 border-b border-border overflow-hidden transition-colors duration-200"
    >
      {/* Ambient Halo Illumination System */}
      <AmbientHalo position="center" variant="dual" size="xl" />
      <AmbientHalo position="top-right" variant="secondary" size="lg" />
      <AmbientHalo position="bottom-center" variant="accent" size="lg" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 2. Section Header: Strong Premium Hierarchy */}
        <div className="text-center max-w-3xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3.5 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>TRANSPARENT TUITION</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={80}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              Structured Course Packages
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-primary">
                &amp; Transparent Pricing
              </span>
            </h2>

            {/* Subtle animated indicator line */}
            <div
              className="h-0.5 w-16 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4 rounded-full"
              aria-hidden="true"
            />
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={140}>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choose the training path that fits your driving goals and schedule.
              Zero hidden surcharges. All courses include door-to-door Manchester pickup,
              full insurance, dual-control vehicles, and official DVSA test route preparation.
            </p>
          </ScrollReveal>

          {/* 3. Interactive Course Filter Navigation */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div
              className="mt-8 inline-flex items-center gap-1.5 p-1 rounded-2xl bg-card border border-border shadow-2xs flex-wrap justify-center"
              role="tablist"
              aria-label="Filter course packages by level"
            >
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </ScrollReveal>
        </div>

        {/* 4. Guided Course-Selection Experience Grid */}
        <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-6 lg:gap-8 group/pricing">
          {displayedPackages.map((pkg, idx) => {
            const isFeatured = !!pkg.popular;
            const ratePerHour = (pkg.price / pkg.durationHours).toFixed(2);

            // Level badge appearance
            let levelBadgeStyle = "bg-muted text-foreground border-border";
            let LevelIcon = Layers;

            if (pkg.level.toLowerCase() === "beginner") {
              levelBadgeStyle =
                "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
              LevelIcon = GraduationCap;
            } else if (pkg.level.toLowerCase() === "intensive") {
              levelBadgeStyle =
                "bg-primary/10 text-primary border-primary/25";
              LevelIcon = Zap;
            } else if (pkg.level.toLowerCase() === "pass plus") {
              levelBadgeStyle =
                "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
              LevelIcon = Award;
            }

            return (
              <div
                key={pkg.id}
                className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.35rem)] max-w-[390px] flex flex-col transition-all duration-300 group-hover/pricing:opacity-95 hover:!opacity-100 hover:z-10"
              >
                <ScrollReveal
                  animation="fade-up"
                  delay={idx * 80}
                  className="h-full flex flex-col"
                >
                  <div
                    className={`relative flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl p-6 sm:p-7 transition-all duration-300 hover:-translate-y-2 text-card-foreground ${
                      isFeatured
                        ? "bg-card border-2 border-primary/80 ring-2 ring-primary/20 dark:ring-primary/30 shadow-lg hover:shadow-2xl animate-featured-glow"
                        : "bg-card border border-border shadow-xs hover:border-primary/40 hover:shadow-xl"
                    }`}
                  >
                    {/* Top Prominent Badge for Featured Package */}
                    {isFeatured && (
                      <div className="absolute -top-3.5 right-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary-foreground shadow-md ring-2 ring-background">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        <span>MOST POPULAR</span>
                      </div>
                    )}

                    {/* Card Content Top Section */}
                    <div>
                      {/* Course Category Badge & Duration Indicator */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${levelBadgeStyle}`}
                        >
                          <LevelIcon className="w-3.5 h-3.5" />
                          <span>{pkg.level}</span>
                        </span>

                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold text-muted-foreground">
                          <Clock className="w-3 h-3 text-primary" />
                          <span>{pkg.durationHours} Hours</span>
                        </span>
                      </div>

                      {/* Package Title */}
                      <h3 className="mt-4 text-xl font-bold text-foreground leading-snug tracking-tight">
                        {pkg.title}
                      </h3>

                      {/* Automotive Micro-Detail */}
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Car className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>Dual-Control Manual &amp; Automatic</span>
                      </div>

                      {/* Large Authoritative Price Display */}
                      <div className="mt-5 pb-5 border-b border-border">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-black tracking-tight text-foreground font-mono">
                            £{pkg.price}
                          </span>
                          <span className="text-xs sm:text-sm font-semibold text-muted-foreground font-sans">
                            (£{ratePerHour}/hr)
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium">
                          Fixed course price • No hidden test-day surcharges
                        </p>
                      </div>

                      {/* Structured Feature List */}
                      <div className="mt-6">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                          What&apos;s Included:
                        </span>
                        <ul className="space-y-3">
                          {pkg.features.map((feat, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-xs sm:text-sm text-foreground/85 leading-snug"
                            >
                              <div className="rounded-full p-0.5 bg-success/10 text-success shrink-0 mt-0.5 border border-success/20">
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              </div>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Bottom CTA (Aligned Across Rows) */}
                    <div className="mt-8 pt-5 border-t border-border">
                      <BookLessonButton
                        course={pkg.title}
                        source="pricing-package"
                        ariaLabel={`Book course package: ${pkg.title}`}
                        className={`group/btn flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-4 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                          isFeatured
                            ? "bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg"
                            : "bg-surface-secondary text-foreground hover:bg-primary hover:text-primary-foreground border border-border shadow-2xs hover:shadow-md"
                        }`}
                      >
                        <span>Book Course Package</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </BookLessonButton>

                      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>DVSA Test Route Preparation Included</span>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default CoursePackagesSection;
