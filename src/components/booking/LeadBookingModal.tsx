"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  User,
  MapPin,
  Compass,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Check,
} from "lucide-react";
import { ProvisionalLicenceStatus } from "@/types";

interface LeadBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: string;
  initialArea?: string;
  source?: string;
}

interface CourseOption {
  id: string;
  title: string;
  price?: number;
  durationHours?: number;
}

interface AreaOption {
  id: string;
  name: string;
  boroughs?: string;
}

const DEFAULT_COURSES: CourseOption[] = [
  { id: "pkg_01", title: "Beginner Driving Lessons" },
  { id: "pkg_02", title: "Manual Driving Lessons" },
  { id: "pkg_03", title: "Automatic Driving Lessons" },
  { id: "pkg_04", title: "Intensive Driving Course" },
  { id: "pkg_05", title: "Refresher Driving Lessons" },
  { id: "pkg_06", title: "Pass Plus & Motorway" },
];

const DEFAULT_AREAS: AreaOption[] = [
  { id: "loc_01", name: "Central & North Manchester" },
  { id: "loc_02", name: "South Manchester & Didsbury" },
  { id: "loc_03", name: "Trafford & Sale" },
  { id: "loc_04", name: "Salford & Bury" },
  { id: "loc_05", name: "Stockport & Greater Manchester" },
];

const HOW_FOUND_OPTIONS = [
  "Google",
  "Google Maps",
  "Facebook",
  "Instagram",
  "TikTok",
  "Recommendation",
  "Friend/Family",
  "Other",
];

const PROVISIONAL_OPTIONS: { label: string; value: ProvisionalLicenceStatus }[] = [
  { label: "Yes, I have one", value: "Yes" },
  { label: "No, not yet", value: "No" },
  { label: "Applying soon", value: "Applying soon" },
];

export default function LeadBookingModal({
  isOpen,
  onClose,
  initialCourse,
  initialArea,
  source,
}: LeadBookingModalProps) {
  // Wizard Step
  const [step, setStep] = useState<1 | 2>(1);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState(initialCourse || "Beginner Driving Lessons");
  const [area, setArea] = useState(initialArea || "Central & North Manchester");
  const [postcode, setPostcode] = useState("");
  const [provisionalLicence, setProvisionalLicence] = useState<ProvisionalLicenceStatus>("Yes");
  const [howFound, setHowFound] = useState("Google");
  const [message, setMessage] = useState("");

  // Options fetched from DB/CMS
  const [courses, setCourses] = useState<CourseOption[]>(DEFAULT_COURSES);
  const [areas, setAreas] = useState<AreaOption[]>(DEFAULT_AREAS);

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Synchronize initial selections when props change
  const [prevInitialCourse, setPrevInitialCourse] = useState(initialCourse);
  const [prevInitialArea, setPrevInitialArea] = useState(initialArea);
  if (initialCourse !== prevInitialCourse) {
    setPrevInitialCourse(initialCourse);
    if (initialCourse) setCourse(initialCourse);
  }
  if (initialArea !== prevInitialArea) {
    setPrevInitialArea(initialArea);
    if (initialArea) setArea(initialArea);
  }

  // Reset wizard state when modal closes without cascading effect
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (prevIsOpen && !isOpen) {
    setPrevIsOpen(false);
    setStep(1);
    setIsSubmitted(false);
    setErrors({});
    setSubmitError("");
  } else if (!prevIsOpen && isOpen) {
    setPrevIsOpen(true);
  }

  // Load dynamic options and prefill logged-in user if available
  useEffect(() => {
    async function loadOptionsAndUser() {
      try {
        const res = await fetch("/api/booking-options");
        if (res.ok) {
          const data = await res.json();
          if (data.courses && data.courses.length > 0) {
            setCourses(data.courses);
            if (!initialCourse) setCourse(data.courses[0].title);
          }
          if (data.areas && data.areas.length > 0) {
            setAreas(data.areas);
            if (!initialArea) setArea(data.areas[0].name);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch booking options, using defaults", e);
      }

      // Check if student is logged in to prefill name/email
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.authenticated && meData.user) {
            setName((prev) => prev || meData.user.name || "");
            setEmail((prev) => prev || meData.user.email || "");
          }
        }
      } catch {
        // Ignore unauthenticated visitor
      }
    }

    if (isOpen) {
      loadOptionsAndUser();
    }
  }, [isOpen, initialCourse, initialArea]);

  // Handle escape key and focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  // Validation rules
  const validateStep1 = () => {
    const stepErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      stepErrors.name = "Please enter your full name.";
    }

    // UK telephone validation
    const cleanedPhone = phone.trim().replace(/[\s\-()]/g, "");
    const isValidPhone = /^(?:(?:\+44)|(?:0044)|0)[1-9]\d{8,9}$/.test(cleanedPhone);
    if (!phone.trim()) {
      stepErrors.phone = "Telephone number is required.";
    } else if (!isValidPhone) {
      stepErrors.phone = "Enter a valid UK telephone number (e.g. 07123 456789).";
    }

    // Email validation
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!email.trim()) {
      stepErrors.email = "Email address is required.";
    } else if (!isValidEmail) {
      stepErrors.email = "Please enter a valid email address.";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = () => {
    const stepErrors: Record<string, string> = {};

    // UK postcode validation
    const cleanedPostcode = postcode.trim().toUpperCase();
    const isValidPostcode = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/.test(cleanedPostcode);
    if (!postcode.trim()) {
      stepErrors.postcode = "Postcode is required to assign your local instructor.";
    } else if (!isValidPostcode) {
      stepErrors.postcode = "Enter a valid UK postcode (e.g., SW1A 1AA, N1 2XY).";
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Re-verify both steps
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    // Extract UTM parameters from current URL if available
    let utmSource = "";
    let utmMedium = "";
    let utmCampaign = "";
    let sourcePage = "/";

    if (typeof window !== "undefined") {
      sourcePage = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      utmSource = params.get("utm_source") || "";
      utmMedium = params.get("utm_medium") || "";
      utmCampaign = params.get("utm_campaign") || "";
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          course,
          targetPackage: course,
          area,
          provisionalLicence,
          postcode: postcode.trim().toUpperCase(),
          message: message.trim(),
          howFound,
          sourcePage,
          utmSource: utmSource || source || undefined,
          utmMedium: utmMedium || undefined,
          utmCampaign: utmCampaign || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errors) {
          setErrors(data.errors);
          if (data.errors.name || data.errors.phone || data.errors.email) {
            setStep(1);
          }
        }
        throw new Error(data.error || "Failed to submit enquiry. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-card text-card-foreground border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all transform scale-100"
      >
        {/* Header with Title and Close X */}
        <div className="flex items-start justify-between p-5 sm:p-6 pb-4 border-b border-border bg-muted/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                DVSA Certified Academy
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Step {step} of 2
              </span>
            </div>
            <h2
              id="booking-modal-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
            >
              Book Your Driving Lesson
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Tell us a little about yourself and we&apos;ll arrange your first lesson.
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        {!isSubmitted && (
          <div className="w-full bg-muted/40 h-1.5">
            <div
              className="bg-primary h-1.5 transition-all duration-300 ease-out"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        )}

        {/* Modal Content / Form */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {submitError && (
            <div className="mb-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2.5">
              <X className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{submitError}</div>
            </div>
          )}

          {isSubmitted ? (
            /* Success State */
            <div className="py-6 sm:py-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Your lesson enquiry has been received. One of our team members will contact you shortly to confirm your booking.
              </p>

              <div className="w-full mt-6 p-4 rounded-xl bg-muted/30 border border-border text-left space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Student Name:</span>
                  <span className="font-semibold text-foreground">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Selected:</span>
                  <span className="font-semibold text-foreground">{course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Area:</span>
                  <span className="font-semibold text-foreground">{area}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Telephone:</span>
                  <span className="font-semibold text-foreground">{phone}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-6 w-full py-3 px-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={step === 1 ? handleNextStep : handleSubmit} noValidate>
              {/* STEP 1: Contact Details & Driving Course */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="booking-name"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      Full Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="booking-name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        placeholder="Your Name"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-input text-foreground transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary ${
                          errors.name
                            ? "border-destructive focus:ring-destructive"
                            : "border-input-border"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-destructive text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Telephone Number */}
                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      Telephone Number <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        id="booking-phone"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                        }}
                        placeholder="Your Telephone Number (e.g. 07123 456789)"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-input text-foreground transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary ${
                          errors.phone
                            ? "border-destructive focus:ring-destructive"
                            : "border-input-border"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-destructive text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="booking-email"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      Email Address <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        id="booking-email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="Your Email (e.g. student@example.co.uk)"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm bg-input text-foreground transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary ${
                          errors.email
                            ? "border-destructive focus:ring-destructive"
                            : "border-input-border"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-destructive text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Driving Course Dropdown */}
                  <div>
                    <label
                      htmlFor="booking-course"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      Select Driving Course <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <select
                        id="booking-course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-input-border text-sm bg-input text-foreground transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary"
                      >
                        {courses.map((pkg) => (
                          <option key={pkg.id} value={pkg.title}>
                            {pkg.title} {pkg.price ? `(from £${pkg.price})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Next Step Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      <span>Continue to Area & Preferences</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Location, Provisional Licence & Preferences */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Area Dropdown */}
                  <div>
                    <label
                      htmlFor="booking-area"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      Select Area <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <select
                        id="booking-area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-input-border text-sm bg-input text-foreground transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary"
                      >
                        {areas.map((loc) => (
                          <option key={loc.id} value={loc.name}>
                            {loc.name} {loc.boroughs ? `(${loc.boroughs})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Postcode */}
                  <div>
                    <label
                      htmlFor="booking-postcode"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      Postcode <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="booking-postcode"
                      value={postcode}
                      onChange={(e) => {
                        setPostcode(e.target.value.toUpperCase());
                        if (errors.postcode) setErrors((prev) => ({ ...prev, postcode: "" }));
                      }}
                      placeholder="Your Postcode (e.g. SW1A 1AA, N1 2XY)"
                      className={`w-full px-3 py-2.5 rounded-xl border text-sm bg-input text-foreground transition-colors uppercase focus:outline-hidden focus:ring-2 focus:ring-primary ${
                        errors.postcode
                          ? "border-destructive focus:ring-destructive"
                          : "border-input-border"
                      }`}
                    />
                    {errors.postcode && (
                      <p className="text-destructive text-xs mt-1">{errors.postcode}</p>
                    )}
                  </div>

                  {/* Provisional Licence Question */}
                  <div>
                    <span className="block text-xs sm:text-sm font-medium text-foreground mb-1.5">
                      Do you have a provisional driving licence?
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {PROVISIONAL_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setProvisionalLicence(opt.value)}
                          className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                            provisionalLicence === opt.value
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-muted/30 border-border text-foreground hover:bg-muted/70"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* How did you find us? */}
                  <div>
                    <label
                      htmlFor="booking-howfound"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      How did you find us? <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Compass className="w-4 h-4" />
                      </div>
                      <select
                        id="booking-howfound"
                        value={howFound}
                        onChange={(e) => setHowFound(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-input-border text-sm bg-input text-foreground transition-colors focus:outline-hidden focus:ring-2 focus:ring-primary"
                      >
                        {HOW_FOUND_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message (Optional) */}
                  <div>
                    <label
                      htmlFor="booking-message"
                      className="block text-xs sm:text-sm font-medium text-foreground mb-1"
                    >
                      Message <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="booking-message"
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us anything else you'd like us to know (e.g. manual/automatic preference, available days)"
                      className="w-full px-3 py-2 rounded-xl border border-input-border text-sm bg-input text-foreground transition-colors resize-none focus:outline-hidden focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  {/* Actions: Back & Submit */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      className="py-3 px-4 rounded-xl font-medium border border-border text-foreground hover:bg-muted/60 transition-colors flex items-center justify-center gap-1.5 focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 px-4 rounded-xl font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-sm focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Lesson Enquiry</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy / Security Notice */}
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-center gap-1.5 text-xs text-muted-foreground text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-success shrink-0" />
                <span>We respect your privacy. Your information is only used to arrange your driving lessons.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
