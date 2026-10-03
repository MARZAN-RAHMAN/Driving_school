"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    window.dispatchEvent(new Event("theme-change"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      suppressHydrationWarning
      className={`group relative inline-flex items-center justify-center min-h-[44px] min-w-[44px] rounded-xl border border-slate-200/80 bg-white/80 p-2 text-slate-700 shadow-xs backdrop-blur-xs transition hover:border-slate-300 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shrink-0 ${className}`}
      aria-label="Toggle dark/light theme"
      title="Toggle dark/light theme"
    >
      <Moon className="h-4 w-4 text-slate-700 transition duration-200 group-hover:scale-110 group-hover:text-indigo-600 block dark:hidden" />
      <Sun className="h-4 w-4 text-amber-400 transition duration-200 group-hover:scale-110 group-hover:text-amber-300 hidden dark:block" />
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          <span className="inline dark:hidden">Dark Mode</span>
          <span className="hidden dark:inline">Light Mode</span>
        </span>
      )}
    </button>
  );
}
