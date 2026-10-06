"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Calendar,
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Car,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  Star,
  Award,
  Sparkles,
  ChevronRight,
  Edit3,
} from "lucide-react";
import { User, Instructor, Booking, Student, InstructorDashboardSummary } from "@/types";

interface InstructorDashboardViewProps {
  user: User;
  instructor: Instructor;
  summary: InstructorDashboardSummary;
}

export function InstructorDashboardView({
  user,
  instructor,
  summary,
}: InstructorDashboardViewProps) {
  const [todayLessons, setTodayLessons] = useState<Booking[]>(summary.todayLessons);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: "COMPLETED" | "NO_SHOW" | "IN_PROGRESS"
  ) => {
    setActionLoading(bookingId);
    try {
      const res = await fetch("/api/instructor/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (res.ok) {
        setTodayLessons((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
        setActionSuccess(`Lesson marked as ${newStatus.replace("_", " ")}`);
        setTimeout(() => setActionSuccess(null), 3000);
      }
    } catch {
      // silently handle
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-100 dark:border-emerald-950/60 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-semibold text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{instructor.badgeNumber} &bull; {instructor.grade || "DVSA Grade A"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {instructor.name}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-50">
              You have <span className="font-bold underline">{todayLessons.length} lessons</span> scheduled for today and <span className="font-bold underline">{summary.assignedStudents.length} active learners</span> assigned to your tuition schedule.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:self-start md:self-auto">
            <Link
              href="/instructor/lessons"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-50 transition"
            >
              <CalendarCheck className="h-4 w-4" />
              Manage Lessons
            </Link>
            <Link
              href="/instructor/availability"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800/60 backdrop-blur px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-800/80 transition ring-1 ring-white/20"
            >
              <Clock className="h-4 w-4" />
              Set Availability
            </Link>
          </div>
        </div>

        {/* Ambient gradient decoration */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Assigned Students</span>
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.assignedStudents.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Active learners</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Today&apos;s Lessons</span>
            <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {todayLessons.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Scheduled today</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Upcoming</span>
            <Calendar className="h-4 w-4 text-sky-600 dark:text-sky-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.upcomingLessons.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">Confirmed sessions</p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.completedLessons.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">All-time delivered</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-emerald-500/40">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Hours Delivered</span>
            <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {summary.hoursTaughtThisMonth} hrs
          </p>
          <p className="mt-1 text-[11px] text-slate-500">This month</p>
        </div>
      </div>

      {/* Main 2-Column Grid: Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left 2 Cols: Today's Schedule */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-emerald-600" />
                  Today&apos;s Lesson Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time appointments scheduled for today
                </p>
              </div>
              <Link
                href="/instructor/lessons"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              >
                All Lessons
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {todayLessons.length === 0 ? (
                <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <CalendarCheck className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700" />
                  <p className="mt-3 text-sm font-semibold">No lessons scheduled for today</p>
                  <p className="text-xs text-slate-400 mt-1">Enjoy your rest day or check upcoming bookings in your calendar.</p>
                </div>
              ) : (
                todayLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/80"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {lesson.studentName}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            lesson.status === "CONFIRMED"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                              : lesson.status === "IN_PROGRESS"
                              ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 animate-pulse"
                              : lesson.status === "COMPLETED"
                              ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                              : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                          }`}
                        >
                          {lesson.status.replace("_", " ")}
                        </span>
                        <span className="rounded-full bg-slate-200/80 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                          {lesson.transmission}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        {lesson.lessonTitle}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {lesson.dateTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {lesson.pickupLocation}
                        </span>
                      </div>

                      {lesson.studentPhone && (
                        <div className="pt-1">
                          <a
                            href={`tel:${lesson.studentPhone}`}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            {lesson.studentPhone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                      {lesson.status !== "COMPLETED" && (
                        <button
                          onClick={() => handleUpdateStatus(lesson.id, "COMPLETED")}
                          disabled={actionLoading === lesson.id}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
                        >
                          {actionLoading === lesson.id ? "Saving..." : "Mark Done"}
                        </button>
                      )}
                      <Link
                        href={`/instructor/lessons?bookingId=${lesson.id}`}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
                        title="Add lesson notes"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Students Preview Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  My Assigned Learners
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Students currently assigned exclusively to your tuition
                </p>
              </div>
              <Link
                href="/instructor/students"
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
              >
                View All ({summary.assignedStudents.length})
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
              {summary.assignedStudents.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No students currently assigned.</p>
              ) : (
                summary.assignedStudents.slice(0, 4).map((student) => (
                  <div key={student.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {student.postcode} &bull; {student.hoursCompleted} hours completed &bull; Theory: {student.theoryStatus}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        student.status === "TEST_READY"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                          : student.status === "PASSED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                      }`}
                    >
                      {student.status.replace("_", " ")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Availability & Quick Action Widgets */}
        <div className="space-y-6">
          {/* Availability Card */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              Tuition Availability
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your standard operating hours and weekly teaching days.
            </p>

            <div className="mt-4 space-y-3 rounded-xl bg-slate-50 dark:bg-slate-850 p-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Working Days:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {instructor.availability?.workingDays?.length || 6} days/wk
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Daily Hours:</span>
                <span className="font-semibold text-slate-900 dark:text-white font-mono">
                  {instructor.availability?.startTime || "08:00"} - {instructor.availability?.endTime || "18:00"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Vehicle:</span>
                <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                  {instructor.vehicle.split("(")[0]}
                </span>
              </div>
            </div>

            <Link
              href="/instructor/availability"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-600/30 bg-emerald-50 dark:bg-emerald-950/40 py-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition shadow-xs"
            >
              Update Availability Schedule
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Instructor Quick Contacts / Dispatch Info */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-600" />
              Credentials & Covered Areas
            </h3>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Test Centers & Coverage
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {(instructor.areas || ["Manchester City Centre", "Cheetham Hill DTC", "West Didsbury DTC"]).map(
                    (area) => (
                      <span
                        key={area}
                        className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                      >
                        {area}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  ADI Standards Check
                </p>
                <p className="mt-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {instructor.grade || "DVSA Grade A (51/51)"} &bull; Pass Rate: 91.2%
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/instructor/profile"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  Edit Profile & Bio
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
