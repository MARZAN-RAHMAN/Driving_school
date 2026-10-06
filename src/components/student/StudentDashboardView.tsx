"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  GraduationCap,
  CalendarCheck,
  Clock,
  Car,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Shield,
  FileCheck,
  Award,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { User, Student, Booking, Instructor, LessonPackage } from "@/types";
import { StudentLessonRequestModal } from "@/components/student/StudentLessonRequestModal";
import { InstructorImage } from "@/components/instructor/InstructorImage";

interface StudentDashboardViewProps {
  user: User;
  student: Student;
  initialBookings: Booking[];
  instructor?: Instructor;
  instructors: Instructor[];
  packages: LessonPackage[];
}

export function StudentDashboardView({
  user,
  student,
  initialBookings,
  instructor,
  instructors,
  packages,
}: StudentDashboardViewProps) {
  const searchParams = useSearchParams();
  const unauthorizedAdmin = searchParams.get("error") === "unauthorized_admin_access";

  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const refreshBookings = async () => {
    try {
      const res = await fetch("/api/student/bookings");
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch {
      // silently fallback to current state
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "IN_PROGRESS" || b.status === "PENDING"
  );
  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "CANCELLED"
  );

  const hoursTarget = 40;
  const progressPercent = Math.min(100, Math.round((student.hoursCompleted / hoursTarget) * 100));

  return (
    <div className="space-y-8">
      {/* Unauthorized Admin Access Warning Banner */}
      {unauthorizedAdmin && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 p-4 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                Restricted Route &bull; Access Denied
              </h3>
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                The <strong>/admin</strong> Operations Center is strictly reserved for NextDrive system administrators and fleet dispatchers. Your student learner account has zero administrative permissions and has been safely returned to your Student Portal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Student
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">&bull;</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Learner ID: {student.id}
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Track your driving syllabus, practical test readiness, lesson hours, and instructor pairings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <StudentLessonRequestModal
              instructors={instructors}
              packages={packages}
              defaultPickup={student.postcode ? `${student.postcode}, London` : "London, UK"}
              onBookingCreated={refreshBookings}
            />
          </div>
        </div>

        {/* Learning Progress Meter */}
        <div className="mt-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                DVSA Practical Test Syllabus Progress
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                UK average tuition to reach test standard is 45 hours. You have completed {student.hoursCompleted} hours.
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                {student.hoursCompleted} / {hoursTarget} hrs
              </span>
              <span className="ml-2 text-xs font-semibold text-slate-500">({progressPercent}%)</span>
            </div>
          </div>

          <div className="mt-3 h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Theory Status */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Theory Test
            </span>
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {student.theoryStatus}
            </span>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {student.theoryStatus === "PASSED"
                ? "DVSA Theory Certificate verified"
                : "Study with free Theory Test Pro"}
            </p>
          </div>
        </div>

        {/* Driving Lessons Completed */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hours Delivered
            </span>
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white font-mono">
              {student.hoursCompleted} Hours
            </span>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              Across dual-control lessons &amp; mock tests
            </p>
          </div>
        </div>

        {/* Practical Test Readiness */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Practical Test
            </span>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950/60 p-2 text-purple-600 dark:text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {student.status === "TEST_READY" ? "Test Ready" : student.status}
            </span>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {student.testDate || "Mock test simulation recommended"}
            </p>
          </div>
        </div>

        {/* Assigned Instructor */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assigned Instructor
            </span>
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/60 p-2 text-blue-600 dark:text-blue-400">
              <Car className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {student.assignedInstructorName || instructor?.name || "Dave Miller"}
            </span>
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              DVSA Grade A Certified ADI
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Lessons + Assigned Instructor Card */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Upcoming Lessons List (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  My Scheduled Lessons ({upcomingBookings.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500">Live Schedule</span>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <CalendarCheck className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">No upcoming lessons scheduled</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Click the button below to request your next practical lesson slot with your assigned instructor.
                </p>
                <div className="pt-2">
                  <StudentLessonRequestModal
                    instructors={instructors}
                    packages={packages}
                    defaultPickup={student.postcode ? `${student.postcode}, London` : "London, UK"}
                    onBookingCreated={refreshBookings}
                  />
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                              b.status === "CONFIRMED"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : b.status === "IN_PROGRESS"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                            }`}
                          >
                            {b.status}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-white">
                            {b.lessonTitle}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{b.dateTime} ({b.durationHours} hrs)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span className="truncate">{b.pickupLocation}</span>
                          </div>
                        </div>

                        {b.notes && (
                          <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 italic">
                            &quot;{b.notes}&quot;
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                          £{b.price}
                        </span>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          Instructor: {b.instructorName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Completed Lessons History */}
          {completedBookings.length > 0 && (
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
              <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Lesson History &amp; Test Records ({completedBookings.length})
                </h2>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {completedBookings.map((b) => (
                  <div key={b.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{b.lessonTitle}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {b.dateTime} &bull; Instructor: {b.instructorName}
                      </p>
                    </div>
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Instructor Card + Profile Information */}
        <div className="space-y-6">
          {/* Assigned Instructor Profile Card */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Your Primary Instructor
            </h3>

            <div className="mt-4 flex items-center gap-3">
              <div className="relative shrink-0">
                <InstructorImage
                  instructor={
                    instructor || {
                      name: "Dave Miller",
                      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces",
                      avatarPositionX: 50,
                      avatarPositionY: 20,
                      avatarZoom: 1,
                    }
                  }
                  aspectRatio="1/1"
                  fallbackSize="md"
                  className="h-14 w-14 rounded-full ring-2 ring-indigo-100 dark:ring-indigo-950 shadow-xs"
                />
                <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {instructor?.name || "Dave Miller"}
                </h4>
                <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 font-mono">
                  {instructor?.badgeNumber || "ADI-44912"}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Rating: {instructor?.rating || 4.9} ★</span>
                  <span>&bull;</span>
                  <span>{instructor?.totalPasses || 168} Passes</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-slate-400" />
                <span>{instructor?.vehicle || "2025 VW Golf 1.5 TSI (Dual Controls)"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />
                <a
                  href={`tel:${instructor?.phone || "+447700900123"}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {instructor?.phone || "+44 7700 900123"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <a
                  href={`mailto:${instructor?.email || "dave.miller@nextdrive.uk"}`}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                >
                  {instructor?.email || "dave.miller@nextdrive.uk"}
                </a>
              </div>
            </div>
          </div>

          {/* Student Profile & Provisional License Details */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
              Personal Information &amp; License
            </h3>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                  Registered Name
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                  Email Address
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{student.email}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                  Mobile Number
                </span>
                <p className="font-semibold text-slate-900 dark:text-white">{student.phone}</p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                  Pickup Postcode
                </span>
                <p className="font-semibold text-slate-900 dark:text-white uppercase">
                  {student.postcode || "BR1, London"}
                </p>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                  Provisional License Number
                </span>
                <p className="font-mono font-semibold text-slate-900 dark:text-white">
                  {student.provisionalLicenseNumber || "THORN709214MT88"}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 text-center">
              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                To update your home pickup address or phone, message your instructor or contact NextDrive dispatch.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
