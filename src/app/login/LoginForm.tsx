"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Car,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface LoginFormProps {
  initialError?: string;
  initialCallbackUrl?: string;
}

export function LoginForm({ initialError, initialCallbackUrl }: LoginFormProps) {
  const router = useRouter();
  const callbackUrl = initialCallbackUrl || "";

  // Determine initial role tab based on callbackUrl
  const isStudentCallback = callbackUrl.includes("/student");
  const isInstructorCallback = callbackUrl.includes("/instructor");

  const [activeRole, setActiveRole] = useState<"ADMIN" | "INSTRUCTOR" | "STUDENT">(
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
    if (isInstructorCallback) return "instructor@nextdrive.uk";
    if (isStudentCallback) return "student@nextdrive.uk";
    return "admin@nextdrive.uk";
  };

  const getInitialPassword = () => {
    if (isInstructorCallback) return "instructor123";
    if (isStudentCallback) return "student123";
    return "admin123";
  };

  const [email, setEmail] = useState(getInitialEmail());
  const [password, setPassword] = useState(getInitialPassword());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(getErrorMessage(initialError));

  const selectRole = (role: "ADMIN" | "INSTRUCTOR" | "STUDENT") => {
    setActiveRole(role);
    setError(null);
    if (role === "ADMIN") {
      setEmail("admin@nextdrive.uk");
      setPassword("admin123");
    } else if (role === "INSTRUCTOR") {
      setEmail("instructor@nextdrive.uk");
      setPassword("instructor123");
    } else {
      setEmail("student@nextdrive.uk");
      setPassword("student123");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setError(err.message);
      } else {
        setError("An unexpected error occurred during sign in.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute right-4 top-4 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <Link href="/" className="flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Next<span className="text-primary">Drive</span>
          </span>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold tracking-tight text-foreground">
          {activeRole === "ADMIN"
            ? "Admin Control Center Login"
            : activeRole === "INSTRUCTOR"
            ? "Instructor Portal Login"
            : "Student Learner Portal Login"}
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Role-Based Access Guard &bull; NextDrive Driving Academy
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="rounded-2xl border border-border bg-card text-card-foreground px-6 py-8 shadow-sm sm:px-10">
          {/* Role Selection Tabs */}
          <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-xl bg-surface-secondary p-1">
            <button
              type="button"
              onClick={() => selectRole("ADMIN")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
                activeRole === "ADMIN"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="truncate">Admin</span>
            </button>
            <button
              type="button"
              onClick={() => selectRole("INSTRUCTOR")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
                activeRole === "INSTRUCTOR"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Car className="h-4 w-4 shrink-0" />
              <span className="truncate">Instructor</span>
            </button>
            <button
              type="button"
              onClick={() => selectRole("STUDENT")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition cursor-pointer ${
                activeRole === "STUDENT"
                  ? "bg-card text-primary shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4 shrink-0" />
              <span className="truncate">Student</span>
            </button>
          </div>

          {/* Quick Demo Switcher */}
          <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-3.5">
            <div className="flex items-center justify-between text-xs font-semibold text-primary">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                Quick-Fill Demo Credentials
              </span>
              <span className="text-[10px] text-primary font-mono font-normal">
                {activeRole === "ADMIN"
                  ? "admin123"
                  : activeRole === "INSTRUCTOR"
                  ? "instructor123"
                  : "student123"}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {activeRole === "ADMIN"
                ? "Sign in as Operations Administrator to manage dispatch, fleet, leads, and CMS."
                : activeRole === "INSTRUCTOR"
                ? "Sign in as ADI Instructor Dave Miller to view assigned students, lessons & availability."
                : "Sign in as Student Marcus Thorne to access bookings, lesson history & test progress."}
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => selectRole("ADMIN")}
                className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer ${
                  activeRole === "ADMIN"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface-secondary text-foreground hover:bg-muted"
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Fill Admin
              </button>
              <button
                type="button"
                onClick={() => selectRole("INSTRUCTOR")}
                className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer ${
                  activeRole === "INSTRUCTOR"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface-secondary text-foreground hover:bg-muted"
                }`}
              >
                <Car className="h-3.5 w-3.5" />
                Fill Inst.
              </button>
              <button
                type="button"
                onClick={() => selectRole("STUDENT")}
                className={`flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold shadow-xs transition cursor-pointer ${
                  activeRole === "STUDENT"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface-secondary text-foreground hover:bg-muted"
                }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Fill Student
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-error/20 bg-error/10 p-3 text-xs text-error">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-error" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                {activeRole === "ADMIN"
                  ? "Admin Email Address"
                  : activeRole === "INSTRUCTOR"
                  ? "Instructor Email Address"
                  : "Student Email Address"}
              </label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input-border bg-input py-2 pl-9 pr-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder={
                    activeRole === "ADMIN"
                      ? "admin@nextdrive.uk"
                      : activeRole === "INSTRUCTOR"
                      ? "instructor@nextdrive.uk"
                      : "student@nextdrive.uk"
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-foreground"
              >
                Password
              </label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-input-border bg-input py-2 pl-9 pr-3 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 cursor-pointer"
            >
              {loading
                ? "Authenticating..."
                : activeRole === "ADMIN"
                ? "Sign In to Admin Dashboard"
                : activeRole === "INSTRUCTOR"
                ? "Sign In to Instructor Portal"
                : "Sign In to Student Portal"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-muted-foreground hover:text-foreground transition"
            >
              &larr; Return to Public Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
