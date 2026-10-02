"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-down" | "fade" | "scale-up" | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
}

export function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  triggerOnce = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    if (mediaQuery.matches) {
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    const currentRef = ref.current;
    if (!currentRef) {
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(currentRef);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [threshold, triggerOnce]);

  // If reduced motion is preferred, render without transforms
  if (prefersReducedMotion || animation === "none") {
    return <div className={className}>{children}</div>;
  }

  // Animation initial and active styles
  let initialClass = "opacity-0";
  let activeClass = "opacity-100";

  switch (animation) {
    case "fade-up":
      initialClass = "opacity-0 translate-y-6";
      activeClass = "opacity-100 translate-y-0";
      break;
    case "fade-down":
      initialClass = "opacity-0 -translate-y-6";
      activeClass = "opacity-100 translate-y-0";
      break;
    case "scale-up":
      initialClass = "opacity-0 scale-95 translate-y-4";
      activeClass = "opacity-100 scale-100 translate-y-0";
      break;
    case "fade":
    default:
      initialClass = "opacity-0";
      activeClass = "opacity-100";
      break;
  }

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out will-change-[transform,opacity] ${
        isVisible ? activeClass : initialClass
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default ScrollReveal;
