"use client";

import React, { useState } from "react";
import {
  Sliders,
  GitFork,
  Navigation,
  Route,
  Award,
  CheckCircle2,
  ArrowRight,
  Compass,
} from "lucide-react";
import { BookLessonButton } from "@/components/booking/BookLessonButton";

export interface SyllabusStep {
  step: string;
  title: string;
  desc: string;
}

interface NextDriveMethodProps {
  businessName?: string;
  steps: SyllabusStep[];
}

interface StepMeta {
  stage: string;
  icon: React.ElementType;
  milestoneLabel: string;
}

const STEP_META: Record<string, StepMeta> = {
  "01": {
    stage: "FOUNDATION",
    icon: Sliders,
    milestoneLabel: "Foundation",
  },
  "02": {
    stage: "JUNCTIONS",
    icon: GitFork,
    milestoneLabel: "Junctions",
  },
  "03": {
    stage: "MANOEUVRES",
    icon: Navigation,
    milestoneLabel: "Manoeuvres",
  },
  "04": {
    stage: "ROAD SKILLS",
    icon: Route,
    milestoneLabel: "Road Skills",
  },
  "05": {
    stage: "TEST READY",
    icon: Award,
    milestoneLabel: "Test Ready",
  },
};

export function NextDriveMethod({
  businessName = "NextDrive",
  steps,
}: NextDriveMethodProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      {/* ========================================================================= */}
      {/* 1. SECTION HEADER */}
      {/* ========================================================================= */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20 mb-3.5">
          <Compass className="w-3.5 h-3.5" aria-hidden="true" />
          <span>THE {businessName.toUpperCase()} METHOD</span>
        </div>

        {/* Authoritative Main Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.14]">
          Five Steps from Provisional
          <br className="hidden sm:inline" /> to Full Licence
        </h2>

        {/* Subtitle */}
        <p className="mt-3.5 sm:mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Our structured DVSA curriculum systematically builds road confidence and defensive driving skills from your first lesson to test day.
        </p>

        {/* Subtle purple progress indicator detail */}
        <div className="flex items-center justify-center gap-1.5 mt-4" aria-hidden="true">
          <span className="h-1 w-2 rounded-full bg-primary/30" />
          <span className="h-1 w-10 rounded-full bg-primary" />
          <span className="h-1 w-2 rounded-full bg-primary/30" />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PROGRESSION JOURNEY STRIP (Desktop & Tablet) */}
      {/* ========================================================================= */}
      <div className="hidden md:flex items-center justify-between max-w-4xl mx-auto mb-12 px-5 py-3 rounded-xl border border-border/80 bg-surface-secondary/50 backdrop-blur-xs text-xs shadow-xs">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
            Roadmap
          </span>
          <span className="text-foreground text-xs">Provisional Licence</span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          {steps.map((stepItem, idx) => {
            const meta = STEP_META[stepItem.step] || { milestoneLabel: `Step ${stepItem.step}` };
            const isHighlighted = hoveredIndex !== null && idx <= hoveredIndex;
            return (
              <React.Fragment key={stepItem.step}>
                <span
                  className={`transition-colors duration-200 ${
                    isHighlighted ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {stepItem.step} {meta.milestoneLabel}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight
                    className={`w-3 h-3 transition-colors duration-200 ${
                      isHighlighted ? "text-primary" : "text-muted-foreground/30"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
          <Award className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Full Licence</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DESKTOP & LAPTOP LAYOUT (>= 1024px: 5 Columns with Connected Timeline) */}
      {/* ========================================================================= */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4 xl:gap-5 items-stretch relative">
        {steps.map((s, idx) => {
          const meta = STEP_META[s.step] || {
            stage: `STAGE ${s.step}`,
            icon: Sliders,
            milestoneLabel: s.title,
          };
          const IconComponent = meta.icon;
          const isHovered = hoveredIndex === idx;
          const isPreceding = hoveredIndex !== null && idx < hoveredIndex;

          return (
            <div
              key={s.step}
              className="flex flex-col group relative"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(idx)}
              onBlur={() => setHoveredIndex(null)}
            >
              {/* Horizontal Connecting Timeline Line behind the Node */}
              <div
                className="relative h-12 flex items-center justify-center mb-3"
                aria-hidden="true"
              >
                {/* Background Track Line */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-[2px] bg-border transition-colors duration-300 ${
                    idx === 0
                      ? "left-1/2 right-0"
                      : idx === steps.length - 1
                      ? "left-0 right-1/2"
                      : "left-0 right-0"
                  }`}
                />

                {/* Active Purple Progress Line */}
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-[2px] bg-primary transition-all duration-300 ${
                    isHovered || isPreceding
                      ? "opacity-100"
                      : "opacity-0"
                  } ${
                    idx === 0
                      ? "left-1/2 right-0"
                      : idx === steps.length - 1
                      ? "left-0 right-1/2"
                      : "left-0 right-0"
                  }`}
                />

                {/* Milestone Node Circle */}
                <div
                  className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${
                    isHovered
                      ? "bg-primary text-primary-foreground border-2 border-primary scale-110 shadow-md shadow-primary/30"
                      : isPreceding
                      ? "bg-primary/20 text-primary border-2 border-primary shadow-xs"
                      : "bg-card text-foreground border-2 border-border shadow-xs group-hover:border-primary/50 group-hover:text-primary"
                  }`}
                >
                  {s.step}
                </div>
              </div>

              {/* Step Card */}
              <div
                className={`flex-1 flex flex-col justify-between rounded-2xl border bg-card p-5 xl:p-6 transition-all duration-300 ${
                  isHovered
                    ? "border-primary/60 shadow-lg shadow-primary/5 -translate-y-1.5 bg-card"
                    : "border-border shadow-xs hover:border-primary/40 hover:shadow-md"
                }`}
              >
                <div>
                  {/* Card Header: Stage Pill & Icon */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider font-mono uppercase bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {meta.stage}
                    </span>

                    <div
                      className={`p-2 rounded-xl transition-colors duration-300 ${
                        isHovered
                          ? "bg-primary text-primary-foreground"
                          : "bg-surface-secondary text-muted-foreground border border-border/60 group-hover:text-primary group-hover:border-primary/30"
                      }`}
                    >
                      <IconComponent className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-base font-bold text-card-foreground leading-snug tracking-tight group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>

                  {/* Card Description */}
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                {/* DVSA Approved Skill Verification Footer */}
                <div className="mt-6 pt-3.5 border-t border-border flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" aria-hidden="true" />
                    <span>DVSA Approved Skill</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. TABLET LAYOUT (768px - 1023px: 2/3 Grid with Connected Step Numbers) */}
      {/* ========================================================================= */}
      <div className="hidden md:grid lg:hidden md:grid-cols-2 gap-5">
        {steps.map((s, idx) => {
          const meta = STEP_META[s.step] || {
            stage: `STAGE ${s.step}`,
            icon: Sliders,
            milestoneLabel: s.title,
          };
          const IconComponent = meta.icon;
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={s.step}
              className={`rounded-2xl border bg-card p-6 flex flex-col justify-between transition-all duration-200 group ${
                idx === steps.length - 1 ? "md:col-span-2 md:max-w-md md:mx-auto md:w-full" : ""
              } ${
                isHovered
                  ? "border-primary/60 shadow-md -translate-y-1"
                  : "border-border shadow-xs hover:border-primary/40 hover:shadow-md"
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-mono font-bold text-xs">
                      {s.step}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider font-mono uppercase bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md">
                      {meta.stage}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-surface-secondary text-muted-foreground border border-border/60 group-hover:text-primary transition-colors">
                    <IconComponent className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-card-foreground leading-snug group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border flex items-center">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" aria-hidden="true" />
                  <span>DVSA Approved Skill</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 5. MOBILE VERTICAL TIMELINE LAYOUT (< 768px: Full-width vertical journey) */}
      {/* ========================================================================= */}
      <div className="block md:hidden relative">
        {/* Continuous Vertical Timeline Line */}
        <div
          className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-border"
          aria-hidden="true"
        />

        <div className="space-y-6">
          {steps.map((s, idx) => {
            const meta = STEP_META[s.step] || {
              stage: `STAGE ${s.step}`,
              icon: Sliders,
              milestoneLabel: s.title,
            };
            const IconComponent = meta.icon;

            return (
              <div key={s.step} className="relative flex items-start gap-4">
                {/* Milestone Node on the Vertical Line */}
                <div className="relative z-10 w-10 h-10 rounded-full border-2 border-primary bg-card text-primary flex items-center justify-center font-mono font-bold text-xs shadow-xs shrink-0 mt-1">
                  {s.step}
                </div>

                {/* Card Container */}
                <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                      {meta.stage}
                    </span>
                    <div className="p-1.5 rounded-lg bg-surface-secondary text-muted-foreground border border-border/60">
                      <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-card-foreground leading-snug">
                    {s.title}
                  </h3>

                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {s.desc}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border flex items-center">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-success/10 text-success border border-success/20">
                      <CheckCircle2 className="w-3 h-3 text-success shrink-0" aria-hidden="true" />
                      <span>DVSA Approved Skill</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. SUBTLE FOOTER PROMPT & CTA */}
      {/* ========================================================================= */}
      <div className="mt-12 sm:mt-16 text-center">
        <div className="inline-flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6 px-6 py-4 rounded-2xl border border-border/80 bg-surface-secondary/40 backdrop-blur-xs shadow-xs max-w-xl mx-auto">
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold text-foreground">
              Ready to start your driving journey?
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Begin with an introductory 2-hour assessment on official test routes.
            </p>
          </div>

          <BookLessonButton
            course="Introductory 2-Hour Assessment"
            source="method-journey"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary-hover transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            <span>Book Assessment</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </BookLessonButton>
        </div>
      </div>
    </div>
  );
}

export default NextDriveMethod;
