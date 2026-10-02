"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQItem } from "@/types";

interface FaqAccordionProps {
  faqs: FAQItem[];
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  // Allow multiple or single open; first item open by default
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [faqs[0]?.id || ""]: true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-3.5">
      {faqs.map((faq) => {
        const isOpen = !!openIds[faq.id];
        const contentId = `faq-content-${faq.id}`;
        const headerId = `faq-header-${faq.id}`;

        return (
          <div
            key={faq.id}
            className={`rounded-2xl border transition-all duration-200 bg-card overflow-hidden shadow-2xs ${
              isOpen
                ? "border-primary/50 shadow-sm"
                : "border-border hover:border-primary/30"
            }`}
          >
            <button
              id={headerId}
              type="button"
              onClick={() => toggle(faq.id)}
              aria-expanded={isOpen}
              aria-controls={contentId}
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
            >
              <span className="text-sm sm:text-base font-bold text-card-foreground leading-snug">
                {faq.question}
              </span>
              <span
                className={`p-1.5 rounded-xl bg-surface-secondary text-muted-foreground transition-transform duration-300 shrink-0 ${
                  isOpen ? "rotate-180 text-primary bg-primary/10" : ""
                }`}
              >
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              </span>
            </button>

            {/* Smooth CSS Grid Transition */}
            <div
              id={contentId}
              role="region"
              aria-labelledby={headerId}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                  {faq.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
