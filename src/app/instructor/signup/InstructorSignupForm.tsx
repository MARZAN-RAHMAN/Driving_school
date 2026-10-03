"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CarFront,
  Mail,
  LockKeyhole,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  Award,
  Car,
  MapPin,
  Clock,
} from "lucide-react";
import { GoogleIcon, AppleIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function InstructorSignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Application details
  const [badgeNumber, setBadgeNumber] = useState("ADI-");
  const [yearsExperience, setYearsExperience] = useState("5");
  const [transmission, setTransmission] = useState<"MANUAL" | "AUTOMATIC" | "BOTH">("BOTH");
  const [vehicle, setVehicle] = useState("2024 Dual-Control Vehicle");
  const [areas, setAreas] = useState("Manchester Central, Salford, Didsbury");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (password && password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    if (password && password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/instructor/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: password || undefined,
          badgeNumber,
          yearsExperience,
          transmission,
          vehicle,
          areas,
          bio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit application.");
      }

      router.push("/instructor/application-status");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while submitting."
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
              <CarFront className="h-5 w-5 sm:h-5.5 sm:w-5.5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground block leading-tight">
                Next<span className="text-primary">Drive</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block -mt-0.5">
                Instructor Fleet Network
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
        <div className="max-w-xl w-full">
          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-slate-900/5 transition-all">
            {/* Header */}
            <div className="text-center space-y-2 mb-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                <CarFront className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Join NextDrive as an Instructor
              </h1>
              <p className="text-xs text-muted-foreground">
                Create your instructor profile and apply to join the NextDrive instructor network.
              </p>
            </div>

            {/* Social Quick-Registration */}
            <div className="space-y-2 mb-6">
              <label className="block text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Quick Apply with Verified Social ID
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Link
                  href="/api/auth/oauth/google?role=INSTRUCTOR&mode=signup"
                  prefetch={false}
                  className="h-10 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                >
                  <GoogleIcon size={16} />
                  <span>Google</span>
                </Link>

                <Link
                  href="/api/auth/oauth/apple?role=INSTRUCTOR&mode=signup"
                  prefetch={false}
                  className="h-10 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                >
                  <AppleIcon size={16} />
                  <span>Apple</span>
                </Link>

                <Link
                  href="/api/auth/oauth/linkedin?role=INSTRUCTOR&mode=signup"
                  prefetch={false}
                  className="h-10 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-secondary/60 hover:bg-surface-secondary text-xs font-semibold text-foreground transition-all shadow-2xs cursor-pointer"
                >
                  <LinkedInIcon size={16} />
                  <span>LinkedIn</span>
                </Link>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <span className="relative bg-card px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                or fill complete instructor application
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

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Section 1: Basic Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. David Miller"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="+44 7700 900123"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    placeholder="instructor@example.com"
                  />
                </div>
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-8 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="min 8 chars"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="repeat password"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: DVSA Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="badgeNumber"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    ADI Number
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="badgeNumber"
                      type="text"
                      required
                      value={badgeNumber}
                      onChange={(e) => setBadgeNumber(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="ADI-44912"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="yearsExperience"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Years Exp.
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="yearsExperience"
                      type="number"
                      min="1"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="transmission"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Tuition Type
                  </label>
                  <select
                    id="transmission"
                    value={transmission}
                    onChange={(e) =>
                      setTransmission(
                        e.target.value as "MANUAL" | "AUTOMATIC" | "BOTH"
                      )
                    }
                    className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 px-3 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  >
                    <option value="BOTH">Manual &amp; Auto</option>
                    <option value="MANUAL">Manual Only</option>
                    <option value="AUTOMATIC">Auto Only</option>
                  </select>
                </div>
              </div>

              {/* Section 3: Vehicle & Coverage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="vehicle"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Training Vehicle
                  </label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="vehicle"
                      type="text"
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. 2024 Ford Fiesta Dual Control"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="areas"
                    className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                  >
                    Service Areas
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <input
                      id="areas"
                      type="text"
                      value={areas}
                      onChange={(e) => setAreas(e.target.value)}
                      className="w-full h-9.5 rounded-xl border border-input-border bg-input py-1.5 pl-8.5 pr-3 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                      placeholder="e.g. Central Manchester, Salford"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1"
                >
                  Instructor Bio &amp; Qualifications
                </label>
                <textarea
                  id="bio"
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full rounded-xl border border-input-border bg-input p-2.5 text-xs text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Share your driving instruction background, DVSA Grade, or specialities..."
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting application...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Submit Instructor Application</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-border text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Already registered as an instructor?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-primary hover:underline"
                >
                  Sign in to Portal
                </Link>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>All applications are verified against the DVSA ADI register</span>
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
