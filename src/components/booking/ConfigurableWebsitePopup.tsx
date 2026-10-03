"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  PopupCampaign,
  PopupFieldConfig,
  TransmissionType,
  ProvisionalLicenceStatus,
} from "@/types";
import { useBookingModal } from "@/context/BookingModalContext";
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Car,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const EXCLUDED_PREFIXES = [
  "/admin",
  "/instructor",
  "/student",
  "/login",
  "/signup",
  "/auth",
  "/api",
];

function getDeviceType(): "desktop" | "tablet" | "mobile" {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  if (width < 640) return "mobile";
  if (width < 1024) return "tablet";
  return "desktop";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isValidUKPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/[\s\-()]/g, "");
  return /^(?:(?:\+44)|(?:0044)|0)[1-9]\d{8,9}$/.test(cleaned);
}

function isValidUKPostcode(postcode: string): boolean {
  const cleaned = postcode.trim().toUpperCase();
  return /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/.test(cleaned);
}

export function ConfigurableWebsitePopup() {
  const pathname = usePathname();
  const { isOpen: isBookingModalOpen } = useBookingModal();

  const [campaign, setCampaign] = useState<PopupCampaign | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form values state
  const [formData, setFormData] = useState<Record<string, string>>({
    fullName: "",
    email: "",
    phone: "",
    postcode: "",
    course: "Beginner Driving Lessons",
    transmission: "MANUAL",
    area: "",
    provisionalLicence: "Yes - Full Provisional",
    preferredDate: "",
    preferredTime: "Flexible / Anytime",
    howDidYouHear: "Google Search",
    message: "",
  });

  const dialogRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);
  const hasInteractedRef = useRef<boolean>(false);

  // Send non-blocking telemetry event
  const sendTelemetry = useCallback(
    (
      event:
        | "popup_impression"
        | "popup_opened"
        | "popup_dismissed"
        | "popup_form_started"
        | "popup_submitted"
    ) => {
      if (!campaign) return;
      try {
        fetch("/api/popup/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            popupId: campaign.id,
            event,
            pageUrl: pathname || "/",
            deviceType: getDeviceType(),
          }),
        }).catch(() => {});
      } catch {
        // Non-blocking telemetry
      }
    },
    [campaign, pathname]
  );

  // Check if current route is excluded
  const isExcludedRoute = EXCLUDED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // 1. Fetch published popup configuration on mount
  useEffect(() => {
    if (isExcludedRoute) return;

    let isMounted = true;
    async function fetchConfig() {
      try {
        const res = await fetch("/api/popup/config", { cache: "no-store" });
        const data = await res.json();
        if (isMounted && data.success && data.campaign) {
          setCampaign(data.campaign);
        }
      } catch (err) {
        // Silently handle network errors
      }
    }

    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, [isExcludedRoute, pathname]);

  // Open the popup dialog
  const openPopup = useCallback(
    (context?: { area?: string; course?: string }) => {
      if (hasTriggeredRef.current) return;
      if (isBookingModalOpen) return;

      if (context?.area) {
        setFormData((prev) => ({ ...prev, area: context.area || "" }));
      }
      if (context?.course) {
        setFormData((prev) => ({ ...prev, course: context.course || "" }));
      }

      hasTriggeredRef.current = true;
      setIsOpen(true);

      // Record impressions and opened telemetry
      sendTelemetry("popup_impression");
      sendTelemetry("popup_opened");

      // Save session/day seen records
      try {
        sessionStorage.setItem("nextdrive_popup_session_seen", "1");
        localStorage.setItem("nextdrive_popup_last_seen", String(Date.now()));
      } catch {}
    },
    [isBookingModalOpen, sendTelemetry]
  );

  // Dismiss popup
  const dismissPopup = useCallback(() => {
    setIsOpen(false);
    sendTelemetry("popup_dismissed");

    if (!campaign) return;
    try {
      if (campaign.dismissalRule === "session") {
        sessionStorage.setItem("nextdrive_popup_dismissed", "1");
      } else if (campaign.dismissalRule === "cooldown_days") {
        localStorage.setItem(
          "nextdrive_popup_dismissed_time",
          String(Date.now())
        );
      }
    } catch {}
  }, [campaign, sendTelemetry]);

  // 2. Frequency & Cooldown Eligibility Check
  const checkEligibility = useCallback((): boolean => {
    if (!campaign || !campaign.isEnabled) return false;
    if (isExcludedRoute) return false;
    if (isBookingModalOpen) return false;

    // Check device support
    const device = getDeviceType();
    if (device === "desktop" && !campaign.showDesktop) return false;
    if (device === "tablet" && !campaign.showTablet) return false;
    if (device === "mobile" && !campaign.showMobile) return false;

    // Check frequency restrictions
    try {
      if (
        campaign.frequency === "never_after_submission" &&
        localStorage.getItem("nextdrive_popup_submitted")
      ) {
        return false;
      }

      if (
        campaign.frequency === "once_per_session" &&
        sessionStorage.getItem("nextdrive_popup_session_seen")
      ) {
        return false;
      }

      const lastSeen = Number(localStorage.getItem("nextdrive_popup_last_seen") || 0);
      const now = Date.now();
      const msDay = 24 * 60 * 60 * 1000;

      if (campaign.frequency === "once_per_day" && now - lastSeen < msDay) {
        return false;
      }
      if (campaign.frequency === "once_3_days" && now - lastSeen < 3 * msDay) {
        return false;
      }
      if (campaign.frequency === "once_7_days" && now - lastSeen < 7 * msDay) {
        return false;
      }
      if (campaign.frequency === "once_30_days" && now - lastSeen < 30 * msDay) {
        return false;
      }

      // Check dismissal cooldown
      if (
        campaign.dismissalRule === "session" &&
        sessionStorage.getItem("nextdrive_popup_dismissed")
      ) {
        return false;
      }

      if (campaign.dismissalRule === "cooldown_days") {
        const dismissedTime = Number(
          localStorage.getItem("nextdrive_popup_dismissed_time") || 0
        );
        const cooldownMs = (campaign.cooldownDays || 7) * msDay;
        if (now - dismissedTime < cooldownMs) {
          return false;
        }
      }
    } catch {
      // Storage unavailable or disabled
    }

    return true;
  }, [campaign, isExcludedRoute, isBookingModalOpen]);

  // 3. Register Triggers
  useEffect(() => {
    if (!campaign || !campaign.isEnabled) return;
    if (!checkEligibility()) return;

    const device = getDeviceType();
    const delaySec =
      device === "mobile"
        ? campaign.mobileDelaySeconds || 15
        : campaign.delaySeconds || 10;

    // (A) Time Trigger
    if (campaign.triggerType === "time") {
      timerRef.current = setTimeout(() => {
        if (!hasTriggeredRef.current) {
          openPopup();
        }
      }, delaySec * 1000);
    }

    // (B) Exit Intent Trigger (Desktop only)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15 && !hasTriggeredRef.current) {
        openPopup();
      }
    };

    if (campaign.triggerType === "exit_intent" && device === "desktop") {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    // (C) Scroll Trigger
    const handleScroll = () => {
      if (hasTriggeredRef.current) return;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      if (scrolled >= campaign.scrollPercentage) {
        openPopup();
      }
    };

    if (campaign.triggerType === "scroll") {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    // (D) Time and Scroll Combined
    let timeElapsed = false;
    let timeTimeout: NodeJS.Timeout | null = null;
    const handleTimeAndScroll = () => {
      if (hasTriggeredRef.current) return;
      if (!timeElapsed) return;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      if (scrolled >= campaign.scrollPercentage) {
        openPopup();
      }
    };

    if (campaign.triggerType === "time_scroll") {
      timeTimeout = setTimeout(() => {
        timeElapsed = true;
      }, delaySec * 1000);
      window.addEventListener("scroll", handleTimeAndScroll, { passive: true });
    }

    // (E) Custom Event Trigger ('open-website-popup')
    const handleCustomPopupEvent = (e: Event) => {
      const custom = e as CustomEvent<{ area?: string; course?: string }>;
      openPopup(custom.detail);
    };
    window.addEventListener("open-website-popup", handleCustomPopupEvent);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (timeTimeout) clearTimeout(timeTimeout);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleTimeAndScroll);
      window.removeEventListener("open-website-popup", handleCustomPopupEvent);
    };
  }, [campaign, checkEligibility, openPopup]);

  // 4. Keyboard & Focus accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismissPopup();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dismissPopup]);

  // First interaction tracking
  const handleInputFocus = () => {
    if (!hasInteractedRef.current) {
      hasInteractedRef.current = true;
      sendTelemetry("popup_form_started");
    }
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    setSubmitError(null);
    const errors: Record<string, string> = {};

    // Validate active required fields
    for (const field of campaign.fields) {
      if (!field.isEnabled) continue;
      const val = formData[field.fieldKey] || "";

      if (field.isRequired && !val.trim()) {
        errors[field.fieldKey] = `${field.label} is required.`;
        continue;
      }

      if (field.fieldKey === "email" && val && !isValidEmail(val)) {
        errors.email = "Please enter a valid email address.";
      }
      if (field.fieldKey === "phone" && val && !isValidUKPhone(val)) {
        errors.phone = "Please enter a valid UK phone number.";
      }
      if (field.fieldKey === "postcode" && val && !isValidUKPostcode(val)) {
        errors.postcode = "Please enter a valid UK postcode.";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/popup/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          sourcePage: pathname || "/",
          deviceType: getDeviceType(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        sendTelemetry("popup_submitted");

        try {
          localStorage.setItem("nextdrive_popup_submitted", "true");
        } catch {}

        // Handle After-Submission Actions
        if (campaign.afterSubmissionAction === "close") {
          setTimeout(() => {
            setIsOpen(false);
          }, 1800);
        } else if (campaign.afterSubmissionAction === "redirect_booking") {
          setTimeout(() => {
            setIsOpen(false);
            const coursesEl = document.getElementById("courses");
            if (coursesEl) {
              coursesEl.scrollIntoView({ behavior: "smooth" });
            } else {
              window.location.href = "/#courses";
            }
          }, 1200);
        } else if (
          campaign.afterSubmissionAction === "redirect_custom" &&
          campaign.customRedirectUrl
        ) {
          setTimeout(() => {
            window.location.href = campaign.customRedirectUrl || "/";
          }, 1200);
        }
      } else {
        setSubmitError(data.error || "Failed to submit lesson enquiry.");
      }
    } catch {
      setSubmitError("Network connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If component shouldn't render
  if (isExcludedRoute || !campaign || !campaign.isEnabled || !isOpen) {
    return null;
  }

  // Positioning classes
  const positionClasses =
    campaign.position === "bottom_right"
      ? "fixed bottom-6 right-6 z-50"
      : campaign.position === "bottom_left"
      ? "fixed bottom-6 left-6 z-50"
      : campaign.position === "bottom_center"
      ? "fixed bottom-6 inset-x-0 mx-auto z-50 max-w-xl"
      : "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6";

  // Width classes
  const widthClasses =
    campaign.size === "small"
      ? "max-w-md"
      : campaign.size === "large"
      ? "max-w-2xl"
      : "max-w-lg";

  // Theme override classes
  const themeClass =
    campaign.theme === "dark"
      ? "dark bg-slate-900 text-white border-slate-800"
      : campaign.theme === "light"
      ? "bg-white text-slate-900 border-slate-200"
      : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800";

  // Animation classes
  const animationClass =
    campaign.animation === "fade_scale"
      ? "animate-in fade-in zoom-in-95"
      : campaign.animation === "fade"
      ? "animate-in fade-in"
      : campaign.animation === "slide_up"
      ? "animate-in slide-in-from-bottom-8 fade-in"
      : campaign.animation === "slide_down"
      ? "animate-in slide-in-from-top-8 fade-in"
      : "";

  return (
    <>
      {/* Optional Backdrop */}
      {campaign.backdropEnabled && campaign.position === "center" && (
        <div
          onClick={dismissPopup}
          className="fixed inset-0 z-40 bg-slate-950 backdrop-blur-xs transition-opacity duration-300"
          style={{ opacity: (campaign.backdropOpacity || 40) / 100 }}
          aria-hidden="true"
        />
      )}

      {/* Popup Container */}
      <div className={positionClasses}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-title"
          aria-describedby="popup-description"
          style={{ animationDuration: `${campaign.animationDurationMs || 300}ms` }}
          className={`relative w-full ${widthClasses} rounded-2xl border shadow-2xl p-6 sm:p-7 overflow-hidden z-50 transition-all ${themeClass} ${animationClass}`}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={dismissPopup}
            aria-label="Close popup"
            className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Success Screen */}
          {isSubmitted ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h3
                id="popup-title"
                className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {campaign.successTitle}
              </h3>
              <p
                id="popup-description"
                className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto"
              >
                {campaign.successMessage}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={dismissPopup}
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-500 transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <div className="space-y-4">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-3 w-3" />
                    Special Promotion
                  </span>
                </div>
                <h3
                  id="popup-title"
                  className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                >
                  {campaign.title}
                </h3>
                {campaign.subtitle && (
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {campaign.subtitle}
                  </p>
                )}
                {campaign.description && (
                  <p
                    id="popup-description"
                    className="mt-1 text-xs text-slate-500 dark:text-slate-400"
                  >
                    {campaign.description}
                  </p>
                )}
              </div>

              {/* Server error */}
              {submitError && (
                <div className="rounded-lg bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Dynamic Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                  {campaign.fields
                    .filter((f) => f.isEnabled)
                    .map((field) => {
                      const isFullWidth =
                        field.fieldKey === "fullName" ||
                        field.fieldKey === "message" ||
                        field.fieldType === "textarea";

                      return (
                        <div
                          key={field.fieldKey}
                          className={isFullWidth ? "col-span-1 sm:col-span-2 space-y-1" : "space-y-1"}
                        >
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>
                              {field.label}{" "}
                              {field.isRequired && (
                                <span className="text-rose-500">*</span>
                              )}
                            </span>
                            {fieldErrors[field.fieldKey] && (
                              <span className="text-[10px] text-rose-500 font-normal">
                                {fieldErrors[field.fieldKey]}
                              </span>
                            )}
                          </label>

                          {field.fieldType === "select" ? (
                            <select
                              value={formData[field.fieldKey] || ""}
                              onFocus={handleInputFocus}
                              onChange={(e) =>
                                setFormData({ ...formData, [field.fieldKey]: e.target.value })
                              }
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : field.fieldType === "textarea" ? (
                            <textarea
                              rows={2}
                              value={formData[field.fieldKey] || ""}
                              onFocus={handleInputFocus}
                              onChange={(e) =>
                                setFormData({ ...formData, [field.fieldKey]: e.target.value })
                              }
                              placeholder={field.placeholder || ""}
                              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          ) : (
                            <input
                              type={
                                field.fieldType === "email"
                                  ? "email"
                                  : field.fieldType === "tel"
                                  ? "tel"
                                  : "text"
                              }
                              value={formData[field.fieldKey] || ""}
                              onFocus={handleInputFocus}
                              onChange={(e) =>
                                setFormData({ ...formData, [field.fieldKey]: e.target.value })
                              }
                              placeholder={field.placeholder || ""}
                              className={`w-full rounded-xl border bg-slate-50/60 dark:bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 ${
                                fieldErrors[field.fieldKey]
                                  ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                                  : "border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500"
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition active:scale-[0.99] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <span>{campaign.buttonText}</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badge */}
                {campaign.trustBadgeText && (
                  <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                    {campaign.trustBadgeText}
                  </p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
