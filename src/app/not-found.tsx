import Link from "next/link";
import { Compass, Home, Phone, Calendar, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-radial from-primary/5 via-background to-background text-foreground">
      <div className="w-full max-w-xl text-center space-y-8 py-12">
        {/* Road Sign / Icon Indicator */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute -inset-4 rounded-full bg-primary/10 blur-xl animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-primary/30 bg-card shadow-2xl">
            <Compass className="h-12 w-12 text-primary animate-[spin_12s_linear_infinite]" />
          </div>
          <span className="absolute -top-2 -right-2 rounded-full bg-primary px-2.5 py-0.5 text-xs font-black tracking-wider text-primary-foreground shadow-md">
            404
          </span>
        </div>

        {/* Text Details */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Off Route: Page Not Found
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Looks like this turn was a dead end. The page you requested doesn&apos;t exist, has moved, or the road is temporarily closed.
          </p>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all"
          >
            <Phone className="h-4 w-4 text-primary" />
            <span>Contact Support</span>
          </Link>
        </div>

        {/* Quick Route Links */}
        <div className="pt-8 border-t border-border/80">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
            Popular NextDrive Destinations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <Link
              href="/#courses"
              className="px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              Driving Packages
            </Link>
            <Link
              href="/#instructors"
              className="px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              Our Instructors
            </Link>
            <Link
              href="/#areas"
              className="px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              Manchester Test Centers
            </Link>
            <Link
              href="/student/login"
              className="px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              Student Portal
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
