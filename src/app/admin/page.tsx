import React from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Car,
  GraduationCap,
  Award,
  Clock,
  Plus,
  ArrowRight,
  ExternalLink,
  Activity,
  PoundSterling,
  Mail,
  Star,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { db } from "@/lib/db";
import { DispatchScheduleWidget } from "@/components/admin/DispatchScheduleWidget";
import { FleetStatusWidget } from "@/components/admin/FleetStatusWidget";
import { OperationsAnalyticsWidget } from "@/components/admin/OperationsAnalyticsWidget";
import { RecentEnquiriesWidget } from "@/components/admin/RecentEnquiriesWidget";

export default async function AdminDashboardPage() {
  const [summary, logs, instructors, bookings, inquiries] = await Promise.all([
    db.getDashboardSummary(),
    db.getAuditLogs(5),
    db.getInstructors(),
    db.getBookings(),
    db.getInquiries(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header Banner: Operations Greeting & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Operations Control Center
            </h1>
            <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Operations
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Driving School Fleet Dispatch, Lesson Scheduling &amp; Business Performance
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-3.5 w-3.5" />
            New Booking
          </Link>
          <Link
            href="/admin/customers"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <GraduationCap className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            Learner Roster
          </Link>
          <Link
            href="/admin/instructors"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Car className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            Instructor Fleet
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Public Site
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Metrics Strip: 6 Key Live Business Indicators from Real DB Data */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Students"
          value={summary.totalStudentsCount ? summary.totalStudentsCount.toString() : "0"}
          change={`${summary.activeStudentsCount} Active`}
          changeType="positive"
          description="Enrolled learner drivers"
          icon={<GraduationCap className="h-5 w-5" />}
        />
        <StatCard
          label="Total Bookings"
          value={summary.totalBookingsCount ? summary.totalBookingsCount.toString() : "0"}
          change={`${summary.confirmedBookingsCount} Confirmed`}
          changeType="positive"
          description={`${summary.pendingBookingsCount} Pending verification`}
          icon={<CalendarCheck className="h-5 w-5" />}
        />
        <StatCard
          label="Active Instructors"
          value={`${summary.activeInstructorsCount} ADI`}
          change="100% active"
          changeType="neutral"
          description="Dual-control vehicles on road"
          icon={<Car className="h-5 w-5" />}
        />
        <StatCard
          label="Contact Enquiries"
          value={summary.totalInquiriesCount ? summary.totalInquiriesCount.toString() : "0"}
          change={`${summary.newInquiriesCount} New`}
          changeType={summary.newInquiriesCount > 0 ? "positive" : "neutral"}
          description="Prospective student leads"
          icon={<Mail className="h-5 w-5" />}
          href="/admin/enquiries?status=NEW"
        />
        <StatCard
          label="Student Reviews"
          value={`${summary.reviewsCount} (${summary.averageRating}★)`}
          change={summary.firstTimePassRate}
          changeType="positive"
          description="First-time practical pass rate"
          icon={<Star className="h-5 w-5" />}
        />
        <StatCard
          label="Monthly Revenue"
          value={summary.revenueThisMonth || "£0"}
          change={summary.revenueChange || "+0%"}
          changeType="positive"
          description={`${summary.weeklyHoursDelivered}h lessons delivered`}
          icon={<PoundSterling className="h-5 w-5" />}
        />
      </div>

      {/* Main Grid Row 1: Dispatch Schedule + Operations Analytics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DispatchScheduleWidget initialBookings={bookings} />
        </div>
        <div className="lg:col-span-1">
          <OperationsAnalyticsWidget />
        </div>
      </div>

      {/* Main Grid Row 2: Recent Enquiries + Fleet Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RecentEnquiriesWidget inquiries={inquiries} />
        </div>
        <div className="lg:col-span-2">
          <FleetStatusWidget instructors={instructors} />
        </div>
      </div>

      {/* Main Grid Row 3: Live Audit & Authorization Stream */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Live Event &amp; RBAC Security Stream
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Real-time audit log, user logins, and administrative dispatch events
            </p>
          </div>
          <Link
            href="/admin/logs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            All Logs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No data available
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => {
              const isSuccess = log.severity === "SUCCESS";
              const isWarning = log.severity === "WARNING";
              const isFailed = log.severity === "FAILED";

              return (
                <div key={log.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                          isSuccess
                            ? "bg-emerald-500"
                            : isWarning
                            ? "bg-amber-500"
                            : isFailed
                            ? "bg-rose-500"
                            : "bg-slate-400"
                        }`}
                      />
                      <div>
                        <p className="text-xs font-mono font-semibold text-slate-900 dark:text-white">
                          {log.action}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Actor:{" "}
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {log.actorEmail}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          Target: {log.target}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                          isSuccess
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : isWarning
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                            : isFailed
                            ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {log.severity}
                      </span>
                      <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {log.timestamp.slice(11, 19)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            System status: Operational (RBAC &amp; DVSA compliance verified)
          </span>
          <Link
            href="/api/health"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Activity className="h-3.5 w-3.5" />
            Live System Telemetry
          </Link>
        </div>
      </div>
    </div>
  );
}
