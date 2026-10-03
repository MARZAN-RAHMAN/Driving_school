"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CarFront,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Mail,
  Award,
  Car,
  MapPin,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { User, Instructor } from "@/types";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface ApplicationStatusClientProps {
  user: User;
  instructor?: Instructor;
}

export function ApplicationStatusClient({
  user,
  instructor,
}: ApplicationStatusClientProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch {
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const isPending = user.status === "PENDING" || instructor?.status === "PENDING";
  const isRejected = user.status === "INACTIVE" || instructor?.status === "REJECTED";

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <header className="w-full border-b border-border/60 bg-card/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-sm shadow-primary/25 group-hover:scale-105 transition-transform shrink-0">
              <CarFront className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground block leading-tight">
                Next<span className="text-primary">Drive</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block -mt-0.5">
                Instructor Application Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              disabled={loggingOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card/80 px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shadow-2xs cursor-pointer"
            >
              {loggingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-xl w-full">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-slate-900/5 space-y-6">
            
            {/* Status Header */}
            {isPending && (
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
                  <Clock className="h-7 w-7 animate-pulse" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  <span>Application Under Review</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Your instructor application is being reviewed.
                </h1>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Thank you for applying to the NextDrive instructor fleet. Our operations dispatch team is currently verifying your DVSA ADI registration, DBS certification, and dual-control vehicle details.
                </p>
              </div>
            )}

            {isRejected && (
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
                  <AlertCircle className="h-7 w-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                  <span>Application Declined</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Application Not Approved
                </h1>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Unfortunately, we are unable to approve your instructor application at this time. If you believe this is in error, please contact operations.
                </p>
              </div>
            )}

            {/* Application Summary Card */}
            <div className="rounded-xl border border-border/80 bg-surface-secondary/40 p-4 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Submitted Application Summary
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Instructor Name</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    {user.name}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Account Email</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3 w-3 text-primary" />
                    {user.email}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">DVSA ADI Number</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <Award className="h-3 w-3 text-primary" />
                    {instructor?.badgeNumber || "ADI-PENDING"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Training Vehicle</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <Car className="h-3 w-3 text-primary" />
                    {instructor?.vehicle || "Dual-Control Vehicle"}
                  </span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground block text-[11px]">Service Areas</span>
                  <span className="font-semibold text-foreground flex items-center gap-1.5 mt-0.5">
                    <MapPin className="h-3 w-3 text-primary" />
                    {instructor?.areas?.join(", ") || "Manchester Central"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline Progress */}
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Onboarding Progress
              </h2>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-foreground block">Application Received</span>
                    <span className="text-[11px] text-muted-foreground">Profile created and queued for administration check.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0 animate-spin" />
                  <div className="flex-1">
                    <span className="font-semibold text-foreground block">DVSA Verification &amp; Document Review</span>
                    <span className="text-[11px] text-muted-foreground">Verifying ADI license, DBS status, and insurance.</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-xl border border-border bg-surface-secondary/30 text-xs opacity-60">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <span className="font-semibold text-foreground block">Fleet Activation &amp; Calendar Dispatch</span>
                    <span className="text-[11px] text-muted-foreground">Access your instructor dashboard, student roster, and lessons.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Notice */}
            <div className="pt-2 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-primary" />
                Need help? Contact dispatch@nextdrive.uk
              </span>
              <button
                onClick={handleSignOut}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Sign out of account
              </button>
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
