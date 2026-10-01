"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Clock,
  MapPin,
  Car,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Booking, Instructor, LessonPackage } from "@/types";
import { StudentLessonRequestModal } from "@/components/student/StudentLessonRequestModal";

interface StudentBookingsClientProps {
  initialBookings: Booking[];
  instructor?: Instructor;
  instructors: Instructor[];
  packages: LessonPackage[];
}

export function StudentBookingsClient({
  initialBookings,
  instructor,
  instructors,
  packages,
}: StudentBookingsClientProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  const refreshBookings = async () => {
    try {
      const res = await fetch("/api/student/bookings");
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      // silently handle
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarCheck className="h-6 w-6 text-indigo-600" />
            My Lesson Bookings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete appointment history and scheduled driving lessons.
          </p>
        </div>

        <StudentLessonRequestModal
          instructors={instructors}
          packages={packages}
          onBookingCreated={refreshBookings}
        />
      </div>

      {/* Filter Tabs */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "PENDING", "CANCELLED"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === status
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500">
            <CalendarCheck className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold">No bookings found</p>
            <p className="text-xs text-slate-400 mt-1">You can request a new driving lesson anytime using the button above.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-indigo-500/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {booking.lessonTitle}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        booking.status === "CONFIRMED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : booking.status === "IN_PROGRESS"
                          ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                          : booking.status === "COMPLETED"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {booking.transmission}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {booking.dateTime}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                      {booking.instructorName}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {booking.pickupLocation}
                    </span>
                  </div>

                  {booking.notes && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                      &quot;{booking.notes}&quot;
                    </p>
                  )}
                </div>

                <div className="sm:text-right shrink-0">
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                    £{booking.price}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {booking.durationHours} Hours Session
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
