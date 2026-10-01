"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function InstructorLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login?callbackUrl=/instructor");
      router.refresh();
    } catch {
      router.push("/login?callbackUrl=/instructor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      title="Sign Out of Instructor Portal"
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition shadow-xs disabled:opacity-50"
    >
      <LogOut className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{loading ? "Signing out..." : "Sign Out"}</span>
    </button>
  );
}
