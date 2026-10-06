"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, LifeBuoy } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client-side error telemetry for diagnostic monitoring
    console.error("Unhandled Application Exception:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-lg text-center space-y-6 rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/5">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Unexpected Roadblock
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Something unexpected occurred while loading this page. Our technical team has been notified.
          </p>
          {error.digest && (
            <p className="text-[11px] font-mono text-muted-foreground/80 pt-1">
              Error Reference: <span className="select-all font-semibold">{error.digest}</span>
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-muted transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Go to Homepage</span>
          </Link>
          <a
            href="mailto:support@nextdrive.uk"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-transparent px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <LifeBuoy className="h-4 w-4" />
            <span>Support</span>
          </a>
        </div>
      </div>
    </main>
  );
}
