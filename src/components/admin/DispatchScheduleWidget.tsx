"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  CheckCircle2,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import { Booking, TransmissionType } from "@/types";

interface DispatchScheduleWidgetProps {
  initialBookings: Booking[];
}

export function DispatchScheduleWidget({
  initialBookings,
}: DispatchScheduleWidgetProps) {
  const [filter, setFilter] = useState<"ALL" | TransmissionType | "IN_PROGRESS">(
    "ALL"
  );

  const filteredBookings = initialBookings.filter((b) => {
    if (filter === "ALL") return true;
    if (filter === "IN_PROGRESS") return b.status === "IN_PROGRESS";
    return b.transmission === filter;
  });

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
      {/* Header & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Live Lesson Dispatch &amp; Schedule
            </h2>
            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Feed
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Real-time driving lessons, instructor vehicle dispatch &amp; test routes
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilter("ALL")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              filter === "ALL"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All ({initialBookings.length})
          </button>
          <button
            onClick={() => setFilter("IN_PROGRESS")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              filter === "IN_PROGRESS"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("MANUAL")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              filter === "MANUAL"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Manual
          </button>
          <button
            onClick={() => setFilter("AUTOMATIC")}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              filter === "AUTOMATIC"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            Automatic
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {filteredBookings.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No driving lessons matching current filter criteria.
          </div>
        ) : (
          filteredBookings.map((b) => {
            const isInProgress = b.status === "IN_PROGRESS";
            const isConfirmed = b.status === "CONFIRMED";
            const isCompleted = b.status === "COMPLETED";

            return (
              <div
                key={b.id}
                className="group flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50/70 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded-xl"
              >
                {/* Left: Time & Lesson info */}
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 rounded-lg p-2 shrink-0 ${
                      isInProgress
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        : isCompleted
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                    }`}
                  >
                    {isInProgress ? (
                      <PlayCircle className="h-4 w-4 animate-pulse" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {b.studentName}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          b.transmission === "MANUAL"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                            : "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        }`}
                      >
                        {b.transmission}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.2 text-[10px] font-semibold ${
                          isInProgress
                            ? "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-600/20"
                            : isCompleted
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-600/20"
                            : isConfirmed
                            ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 ring-1 ring-indigo-600/20"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {b.status.replace("_", " ")}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                      {b.lessonTitle} &bull;{" "}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.instructorName}
                      </span>
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {b.dateTime} ({b.durationHours}h)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {b.pickupLocation}
                      </span>
                      {b.testCenter && (
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          🎯 {b.testCenter}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Price & Quick Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      £{b.price}
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500">
                      Paid via Stripe
                    </span>
                  </div>

                  <Link
                    href={`/admin/bookings`}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-50 dark:hover:bg-slate-750 hover:text-indigo-600 dark:hover:text-indigo-400"
                  >
                    Dispatch Details
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer link */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Showing {filteredBookings.length} of {initialBookings.length} active scheduled lessons
        </span>
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          View Full Dispatch Calendar
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
