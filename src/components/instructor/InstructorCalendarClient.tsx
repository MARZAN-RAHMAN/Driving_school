"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Car,
  User,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { Booking, Instructor } from "@/types";

interface InstructorCalendarClientProps {
  lessons: Booking[];
  instructor: Instructor;
}

export function InstructorCalendarClient({
  lessons,
  instructor,
}: InstructorCalendarClientProps) {
  const days = [
    { name: "Monday", date: "Oct 5", dayNum: 5 },
    { name: "Tuesday", date: "Oct 6", dayNum: 6 },
    { name: "Wednesday", date: "Oct 7", dayNum: 7 },
    { name: "Thursday", date: "Oct 8", dayNum: 8, isToday: true },
    { name: "Friday", date: "Oct 9", dayNum: 9 },
    { name: "Saturday", date: "Oct 10", dayNum: 10 },
    { name: "Sunday", date: "Oct 11", dayNum: 11 },
  ];

  const [activeDay, setActiveDay] = useState("Thursday");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="h-6 w-6 text-emerald-600" />
            Tuition Calendar & Timetable
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weekly driving schedule for {instructor.name} &bull; Dual-control car dispatch
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            href="/instructor/availability"
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            Adjust Working Hours
          </Link>
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="grid grid-cols-7 gap-2">
          {days.map((d) => (
            <button
              key={d.name}
              onClick={() => setActiveDay(d.name)}
              className={`flex flex-col items-center justify-center rounded-xl p-3 text-center transition ${
                activeDay === d.name
                  ? "bg-emerald-600 text-white shadow-xs"
                  : d.isToday
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider">
                {d.name.slice(0, 3)}
              </span>
              <span className="mt-1 text-lg font-bold">{d.dayNum}</span>
              {d.isToday && (
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Time Slots for Selected Day */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-600" />
            Schedule for {activeDay}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Working Window: 08:00 - 18:00
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                  {idx === 0 ? "09:00" : idx === 1 ? "11:30" : idx === 2 ? "14:00" : "16:30"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {lesson.studentName}
                    </span>
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {lesson.transmission}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        lesson.status === "CONFIRMED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : lesson.status === "COMPLETED"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          : "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    {lesson.lessonTitle}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.dateTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {lesson.pickupLocation}
                    </span>
                  </div>
                </div>
              </div>

              <div className="self-start sm:self-center">
                <Link
                  href={`/instructor/lessons?bookingId=${lesson.id}`}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition shadow-xs"
                >
                  View / Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
