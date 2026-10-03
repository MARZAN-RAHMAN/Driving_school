"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CarFront,
  GraduationCap,
  CalendarCheck,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface LoginFormProps {
  initialError?: string;
  initialCallbackUrl?: string;
}

type RoleType = "ADMIN" | "INSTRUCTOR" | "STUDENT";

interface RoleConfig {
  id: RoleType;
  title: string;
  shortDesc: string;
  portalName: string;
  portalDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultEmail: string;
  defaultPass: string;
}

const ROLES: Record<RoleType, RoleConfig> = {
  ADMIN: {
    id: "ADMIN",
    title: "Admin",
    shortDesc: "Manage academy",
    portalName: "Admin Control Center",
    portalDesc: "Manage academy dispatch, fleet scheduling, student records & CMS.",
    icon: ShieldCheck,
    defaultEmail: "admin@nextdrive.uk",
    defaultPass: "admin123",
  },
  INSTRUCTOR: {
    id: "INSTRUCTOR",
    title: "Instructor",
    shortDesc: "Manage lessons",
    portalName: "Instructor Portal",
    portalDesc: "Manage assigned students, daily lesson schedules & calendar availability.",
    icon: CarFront,
    defaultEmail: "instructor@nextdrive.uk",
    defaultPass: "instructor123",
  },
  STUDENT: {
    id: "STUDENT",
    title: "Student",
    shortDesc: "View your lessons",
    portalName: "Student Portal",
    portalDesc: "Access upcoming lessons, track DVSA syllabus progress & test readiness.",
    icon: GraduationCap,
    defaultEmail: "student@nextdrive.uk",
    defaultPass: "student123",
  },
};

function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false),
    () => false
  );
}

function AutomotiveRoadVisual() {
  const reducedMotion = usePrefersReducedMotion();

  // Road path coordinates across a 500x260 viewBox
  const roadPathD = "M 40,210 C 140,210 160,130 260,130 C 360,130 380,50 460,50";

  return (
    <div className="relative w-full rounded-2xl border border-border/80 bg-gradient-to-b from-card/90 via-card to-surface-secondary/50 p-5 shadow-sm overflow-hidden backdrop-blur-xs">
      {/* Background ambient automotive grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#4F46E5_1px,transparent_1px)] [background-size:16px_16px] opacity-15 dark:opacity-25 pointer-events-none" />

      {/* Top Header Badge inside visual card */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-border/50 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-foreground tracking-wide uppercase text-[10px]">
            Live Academy Network
          </span>
        </div>
        <span className="font-mono text-muted-foreground text-[10px]">
          Manchester Dual-Control Grid
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full aspect-[500/250] my-2">
        <svg
          viewBox="0 0 500 250"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="roadGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            <linearGradient id="glowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.35" />
            </linearGradient>

            <radialGradient id="carAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="headlightBeam" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
            </linearGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Underlay glow path */}
          <path
            d={roadPathD}
            stroke="url(#glowGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            filter="url(#softGlow)"
          />

          {/* Main solid road base */}
          <path
            d={roadPathD}
            stroke="url(#roadGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Road center dashed line */}
          <path
            d={roadPathD}
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Waypoint 1: Central Hub */}
          <g transform="translate(40, 210)">
            <circle r="12" fill="#4F46E5" fillOpacity="0.2">
              {!reducedMotion && (
                <animate attributeName="r" values="8;16;8" dur="3s" repeatCount="indefinite" />
              )}
            </circle>
            <circle r="5" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="22" textAnchor="middle" className="fill-muted-foreground text-[10px] font-medium select-none">
              Central Hub
            </text>
          </g>

          {/* Waypoint 2: Salford Fleet */}
          <g transform="translate(260, 130)">
            <circle r="12" fill="#06B6D4" fillOpacity="0.2">
              {!reducedMotion && (
                <animate attributeName="r" values="8;16;8" dur="3s" begin="1s" repeatCount="indefinite" />
              )}
            </circle>
            <circle r="5" fill="#06B6D4" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="22" textAnchor="middle" className="fill-muted-foreground text-[10px] font-medium select-none">
              Fleet Depot
            </text>
          </g>

          {/* Waypoint 3: DVSA Test Centre */}
          <g transform="translate(460, 50)">
            <circle r="12" fill="#7C3AED" fillOpacity="0.2">
              {!reducedMotion && (
                <animate attributeName="r" values="8;16;8" dur="3s" begin="2s" repeatCount="indefinite" />
              )}
            </circle>
            <circle r="5" fill="#7C3AED" stroke="#FFFFFF" strokeWidth="2" />
            <text x="0" y="22" textAnchor="middle" className="fill-muted-foreground text-[10px] font-medium select-none">
              DVSA Centre
            </text>
          </g>

          {/* Animated Car Node */}
          <g>
            {!reducedMotion ? (
              <animateMotion
                path={roadPathD}
                dur="10s"
                repeatCount="indefinite"
                rotate="auto"
              />
            ) : null}

            {/* If reduced motion is active, position statically at the midpoint */}
            <g
              transform={
                reducedMotion
                  ? "translate(260, 130) rotate(-38)"
                  : undefined
              }
            >
              {/* Headlight beam */}
              <polygon
                points="10,-4 36,-14 36,14 10,4"
                fill="url(#headlightBeam)"
              />

              {/* Glowing Aura */}
              <circle cx="0" cy="0" r="16" fill="url(#carAura)" />

              {/* Vehicle Body */}
              <rect
                x="-14"
                y="-8"
                width="28"
                height="16"
                rx="4"
                fill="#0F172A"
                stroke="#06B6D4"
                strokeWidth="1.5"
              />

              {/* Windshield */}
              <rect
                x="-4"
                y="-5"
                width="8"
                height="10"
                rx="1.5"
                fill="#38BDF8"
                opacity="0.9"
              />

              {/* Headlights (yellow) */}
              <circle cx="13" cy="-5" r="1.5" fill="#FEF08A" />
              <circle cx="13" cy="5" r="1.5" fill="#FEF08A" />

              {/* Taillights (red) */}
              <circle cx="-13" cy="-5" r="1.5" fill="#EF4444" />
              <circle cx="-13" cy="5" r="1.5" fill="#EF4444" />
            </g>
          </g>
        </svg>
      </div>

      {/* Bottom Footer Details */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-border/50 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <CarFront className="h-3.5 w-3.5 text-primary" /> Dual-Control Telematics
        </span>
        <span className="font-mono text-[10px] text-emerald-500 font-semibold">
          GPS SYNC ACTIVE
        </span>
      </div>
    </div>
  );
}

export function LoginForm({ initialError, initialCallbackUrl }: LoginFormProps) {
  const router = useRouter();
  const callbackUrl = initialCallbackUrl || "";

  // Determine initial role tab based on callbackUrl
  const isStudentCallback = callbackUrl.includes("/student");
  const isInstructorCallback = callbackUrl.includes("/instructor");

  const [activeRole, setActiveRole] = useState<RoleType>(
    isInstructorCallback
      ? "INSTRUCTOR"
      : isStudentCallback
      ? "STUDENT"
      : "ADMIN"
  );

  const getErrorMessage = (code?: string): string | null => {
    if (!code) return null;
    if (code === "unauthorized_admin_access") {
      return "Access Denied: Only administrators have permission to access the Admin Control Center.";
    }
    if (code === "unauthorized_instructor_access") {
      return "Access Denied: Student accounts cannot access the Instructor Portal. Please sign in as an instructor.";
    }
    if (code === "unauthorized_student_access") {
      return "Access Denied: Instructor accounts cannot access the Student Learner Portal.";
    }
    if (code === "insufficient_permissions") {
      return "Insufficient Privileges: Your account does not have authorization for this area.";
    }
    if (code === "session_expired") {
      return "Session Expired: Your security session has timed out. Please sign in again.";
    }
    if (code === "invalid_session") {
      return "Security Alert: Tampered or invalid session signature detected. Please sign in.";
    }
    if (code === "malformed_session") {
      return "Corrupted session token received. Please authenticate again.";
    }
    return code;
  };

  const getInitialEmail = () => {
    if (isInstructorCallback) return ROLES.INSTRUCTOR.defaultEmail;
    if (isStudentCallback) return ROLES.STUDENT.defaultEmail;
    return ROLES.ADMIN.defaultEmail;
  };

  const getInitialPassword = () => {
    if (isInstructorCallback) return ROLES.INSTRUCTOR.defaultPass;
    if (isStudentCallback) return ROLES.STUDENT.defaultPass;
    return ROLES.ADMIN.defaultPass;
  };

  const [email, setEmail] = useState(getInitialEmail());
  const [password, setPassword] = useState(getInitialPassword());
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccess, setShowDemoAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(getErrorMessage(initialError));

  const selectRole = (role: RoleType) => {
    setActiveRole(role);
    setError(null);
    setEmail(ROLES[role].defaultEmail);
    setPassword(ROLES[role].defaultPass);
  };

  const formatErrorMessage = (msg?: string): string => {
    if (!msg) return "Email or password is incorrect.";
    const lower = msg.toLowerCase();
    if (lower.includes("failed to fetch") || lower.includes("network")) {
      return "Unable to connect right now. Please check your internet connection and try again.";
    }
    if (msg.includes("locked") || msg.includes("Too many")) {
      return msg;
    }
    if (msg.includes("Invalid email or password") || msg.includes("Authentication failed")) {
      return "Email or password is incorrect.";
    }
    return msg;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      const role = data.user.role;
      if (role === "ADMIN" || role === "EDITOR") {
        const dest = callbackUrl && callbackUrl.startsWith("/admin") ? callbackUrl : "/admin";
        router.push(dest);
      } else if (role === "INSTRUCTOR") {
        const dest = callbackUrl && callbackUrl.startsWith("/instructor") ? callbackUrl : "/instructor";
        router.push(dest);
      } else {
        const dest = callbackUrl && callbackUrl.startsWith("/student") ? callbackUrl : "/student";
        router.push(dest);
      }
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(formatErrorMessage(err.message));
      } else {
        setError("Unable to connect right now. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentRoleConfig = ROLES[activeRole];
  const CurrentRoleIcon = currentRoleConfig.icon;

  const features = [
    {
      icon: ShieldCheck,
      title: "Secure role-based access",
      description: "Dedicated control portals for learners, instructors, and academy managers.",
    },
    {
      icon: CalendarCheck,
      title: "Manage lessons and bookings",
      description: "Live schedule dispatch, booking validation, and automated lesson notifications.",
    },
    {
      icon: CarFront,
      title: "Connected driving-school platform",
      description: "Dual-control vehicle fleet telemetry and digital DVSA syllabus records.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm shadow-primary/25 group-hover:scale-105 transition-transform shrink-0">
              <CarFront className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground block leading-tight">
                Next<span className="text-primary">Drive</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block -mt-0.5">
                Academy Control Center
              </span>
            </div>
          </Link>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Back to Website</span>
              <span className="sm:hidden">Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Two-Panel Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT PANEL: Brand, Automotive Visual & Features (Visible on Desktop / Compact on Mobile) */}
          <section className="lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8">
            <div>
              {/* Brand Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>NextDrive Control Center</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                Drive smarter. <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Manage everything in one place.
                </span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Secure role-based portal for NextDrive learners, DVSA-certified instructors, and academy operations managers.
              </p>
            </div>

            {/* Automotive Road Visual */}
            <div className="hidden sm:block">
              <AutomotiveRoadVisual />
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/50 p-3 transition-colors hover:bg-card hover:border-border"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-xs font-semibold text-foreground">
                        {feat.title}
                      </h2>
                      <p className="text-[11px] leading-relaxed text-muted-foreground">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RIGHT PANEL: Interactive Authentication Portal */}
          <section className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-900/5 transition-all">
              
              {/* Role Header Banner */}
              <div className="flex items-start gap-3.5 pb-6 border-b border-border/60">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <CurrentRoleIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {currentRoleConfig.portalName}
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                    {currentRoleConfig.portalDesc}
                  </p>
                </div>
              </div>

              {/* Role Selection Cards */}
              <div className="my-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Select Your Account Role
                </label>
                <div
                  role="tablist"
                  aria-label="Account Role Selector"
                  className="grid grid-cols-3 gap-2 sm:gap-3"
                >
                  {(Object.keys(ROLES) as RoleType[]).map((roleKey) => {
                    const r = ROLES[roleKey];
                    const RoleIcon = r.icon;
                    const isSelected = activeRole === roleKey;

                    return (
                      <button
                        key={roleKey}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => selectRole(roleKey)}
                        className={`relative flex flex-col items-center sm:items-start text-center sm:text-left p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer min-h-[82px] sm:min-h-[88px] justify-between ${
                          isSelected
                            ? "border-primary bg-primary/10 ring-2 ring-primary/25 shadow-xs"
                            : "border-border bg-surface-secondary/50 hover:bg-surface-secondary hover:border-muted-foreground/30 text-muted-foreground"
                        }`}
                      >
                        <div className="w-full flex items-center justify-between">
                          <RoleIcon
                            className={`h-5 w-5 ${
                              isSelected ? "text-primary" : "text-muted-foreground"
                            }`}
                          />
                          {isSelected && (
                            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xs">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <div className="w-full mt-1.5">
                          <span
                            className={`text-xs sm:text-sm font-bold block ${
                              isSelected ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {r.title}
                          </span>
                          <span className="text-[10px] sm:text-[11px] text-muted-foreground line-clamp-1 block">
                            {r.shortDesc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Demo Credentials Accordion */}
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => setShowDemoAccess(!showDemoAccess)}
                  aria-expanded={showDemoAccess}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface-secondary/70 hover:bg-surface-secondary border border-border/80 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span>Demo Access</span>
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <span className="text-muted-foreground">Quick Fill</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        showDemoAccess ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </button>

                {showDemoAccess && (
                  <div className="mt-2.5 p-3.5 rounded-xl border border-primary/20 bg-primary/5 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-primary">Pre-fill Demo Credentials</span>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {currentRoleConfig.defaultPass}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Click any role below to pre-fill verified demo credentials for testing and evaluation:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => selectRole("ADMIN")}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold shadow-2xs transition cursor-pointer ${
                          activeRole === "ADMIN"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => selectRole("INSTRUCTOR")}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold shadow-2xs transition cursor-pointer ${
                          activeRole === "INSTRUCTOR"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        <CarFront className="h-3.5 w-3.5" />
                        Instructor
                      </button>
                      <button
                        type="button"
                        onClick={() => selectRole("STUDENT")}
                        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-2 text-xs font-semibold shadow-2xs transition cursor-pointer ${
                          activeRole === "STUDENT"
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        <GraduationCap className="h-3.5 w-3.5" />
                        Student
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{error}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 rounded-xl border border-input-border bg-input py-2 pl-10 pr-3.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
                      placeholder={currentRoleConfig.defaultEmail}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 rounded-xl border border-input-border bg-input py-2 pl-10 pr-11 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 flex w-full h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-md cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Signing you in...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4.5 w-4.5" />
                      <span>Sign in securely</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Security Trust Indicator */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Secure role-based access &bull; End-to-end encrypted</span>
              </div>

              {/* Return Link */}
              <div className="mt-6 border-t border-border/80 pt-4 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to NextDrive website</span>
                </Link>
              </div>

            </div>
          </section>

        </div>
      </main>

      {/* Subtle Footer Note */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40">
        <p>&copy; {new Date().getFullYear()} NextDrive Driving Academy. Secure Digital Operations &amp; DVSA Training.</p>
      </footer>
    </div>
  );
}
