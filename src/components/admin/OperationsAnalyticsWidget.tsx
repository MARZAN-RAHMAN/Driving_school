"use client";

import React from "react";
import { TrendingUp, Award } from "lucide-react";

export function OperationsAnalyticsWidget() {
  const days = [
    { day: "Mon", hours: 28, height: "70%" },
    { day: "Tue", hours: 32, height: "80%" },
    { day: "Wed", hours: 34, height: "85%" },
    { day: "Thu", hours: 29, height: "72%" },
    { day: "Fri", hours: 36, height: "92%" },
    { day: "Sat", hours: 24, height: "60%" },
    { day: "Sun", hours: 13.5, height: "35%" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Operations &amp; Pass Analytics
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Weekly lesson delivery &amp; first-time pass benchmark
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            +18.5 hrs
          </div>
        </div>

        {/* Weekly Hours Bar Chart */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Weekly Delivery</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">196.5 Total Hours</span>
          </div>

          <div className="flex items-end justify-between gap-2 h-28 pt-4 px-1">
            {days.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 group-hover:text-indigo-600">
                  {d.hours}h
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md relative flex items-end h-full">
                  <div
                    style={{ height: d.height }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 transition rounded-t-md"
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transmission & Pass Rate Breakdown */}
        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-300">Transmission Split</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                Manual (58%) &bull; Automatic (42%)
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="bg-blue-600 transition" style={{ width: "58%" }} />
              <div className="bg-purple-600 transition" style={{ width: "42%" }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-600 dark:text-slate-300">First-Time Pass Rate</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                89.4% (vs 48.2% UK Avg)
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="bg-emerald-500 transition" style={{ width: "89.4%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* DVSA Benchmark Footnote */}
      <div className="mt-6 rounded-xl border border-emerald-100 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 p-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
          <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          DVSA Gold Quality Standard
        </div>
        <p className="mt-0.5 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
          41.2% higher pass rate than local test center averages with zero serious faults recorded this quarter.
        </p>
      </div>
    </div>
  );
}
