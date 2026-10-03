"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { GoogleIcon, AppleIcon } from "@/components/ui/SocialIcons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function StudentLoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("student@nextdrive.uk");
  const [password, setPassword] = useState("student123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(data.error || "Invalid email or password.");
      }

      router.push("/student");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to connect right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm shadow-primary/25 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground block leading-tight">
                Next<span className="text-primary">Drive</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block -mt-0.5">
                Student Portal
              </span>
            </div>
          </Link>

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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-md w-full">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-slate-900/5 transition-all">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Student Portal Login
              </h1>
              <p className="text-xs text-muted-foreground">
                Sign in to manage your driving lessons, test bookings, and syllabus progress.
              </p>
            </div>

            {/* Social Login Options */}
            <div className="space-y-2.5">
              <Link
                href="/api/auth/oauth/google?role=STUDENT&mode=login"
                prefetch={false}
                className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary hover:border-muted-foreground/30 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
              >
                <GoogleIcon size={18} />
                <span>Continue with Google</span>
              </Link>

              <Link
                href="/api/auth/oauth/apple?role=STUDENT&mode=login"
                prefetch={false}
                className="w-full h-11 flex items-center justify-center gap-3 rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary hover:border-muted-foreground/30 text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
              >
                <AppleIcon size={18} />
                <span>Continue with Apple</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                or continue with email
              </span>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3.5 text-xs text-destructive"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
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
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input-border bg-input py-2 pl-10 pr-3.5 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
                    placeholder="student@nextdrive.uk"
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
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input-border bg-input py-2 pl-10 pr-10 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-2xs"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Quick-fill */}
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("student@nextdrive.uk");
                    setPassword("student123");
                  }}
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Fill Demo Student (Marcus Thorne)</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4" />
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-4 border-t border-border text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Don&apos;t have a student account?{" "}
                <Link
                  href="/student/signup"
                  className="font-semibold text-primary hover:underline"
                >
                  Create Student Account
                </Link>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Secure role-based access &bull; End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer Note */}
      <footer className="w-full py-4 text-center text-xs text-muted-foreground border-t border-border/40">
        <p>&copy; {new Date().getFullYear()} NextDrive Driving Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}
