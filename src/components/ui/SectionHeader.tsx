"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface SectionHeaderProps {
  eyebrow?: string;
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  titleHighlight?: string;
  subtitle?: string;
  indicator?: boolean;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  icon: Icon,
  title,
  titleHighlight,
  subtitle,
  indicator = true,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`max-w-3xl ${
        centered ? "text-center mx-auto" : "text-left"
      } ${className}`}
    >
      {/* 1. Eyebrow Badge */}
      {eyebrow && (
        <ScrollReveal animation="fade-up" duration={500}>
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3.5 border border-primary/20 backdrop-blur-xs ${
              centered ? "" : "self-start"
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{eyebrow}</span>
          </div>
        </ScrollReveal>
      )}

      {/* 2. Main Title */}
      <ScrollReveal animation="fade-up" delay={80} duration={550}>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.14]">
          {title}
          {titleHighlight && (
            <>
              {" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground to-primary">
                {titleHighlight}
              </span>
            </>
          )}
        </h2>

        {/* 3. Sleek Indicator Line */}
        {indicator && (
          <div
            className={`flex items-center gap-1.5 mt-3.5 ${
              centered ? "justify-center" : "justify-start"
            }`}
            aria-hidden="true"
          >
            <span className="h-1 w-2 rounded-full bg-primary/30" />
            <span className="h-1 w-10 rounded-full bg-primary" />
            <span className="h-1 w-2 rounded-full bg-primary/30" />
          </div>
        )}
      </ScrollReveal>

      {/* 4. Readable Subtitle */}
      {subtitle && (
        <ScrollReveal animation="fade-up" delay={140} duration={600}>
          <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}

export default SectionHeader;
