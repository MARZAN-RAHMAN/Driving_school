/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { Car, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { Instructor } from "@/types";
import { InstructorImage } from "@/components/instructor/InstructorImage";

interface FleetStatusWidgetProps {
  instructors: Instructor[];
}

export function FleetStatusWidget({ instructors }: FleetStatusWidgetProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            Certified Instructor Fleet
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            DVSA Approved Driving Instructors (ADI) on active duty
          </p>
        </div>
        <Link
          href="/admin/instructors"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Manage Fleet
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {instructors.map((inst) => (
          <div
            key={inst.id}
            className="flex items-center justify-between py-3 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <InstructorImage
                  instructor={inst}
                  aspectRatio="1/1"
                  fallbackSize="sm"
                  className="h-10 w-10 rounded-full ring-2 ring-indigo-50 dark:ring-indigo-950/60 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {inst.name}
                  </span>
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-slate-600 dark:text-slate-300">
                    {inst.badgeNumber}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                      inst.transmission === "MANUAL"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        : inst.transmission === "AUTOMATIC"
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    }`}
                  >
                    {inst.transmission === "BOTH" ? "Dual (M/A)" : inst.transmission}
                  </span>
                </div>

                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <Car className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                  <span className="truncate max-w-[180px] sm:max-w-xs">
                    {inst.vehicle}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-900 dark:text-white font-mono">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{inst.rating.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  {inst.totalPasses}
                </span>{" "}
                Passes &bull; {inst.activeStudents} Students
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
          100% Enhanced DBS Cleared &amp; DVSA Inspected
        </span>
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          5 / 5 Instructors Available
        </span>
      </div>
    </div>
  );
}
