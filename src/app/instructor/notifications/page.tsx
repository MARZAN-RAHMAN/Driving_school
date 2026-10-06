import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Bell, CheckCircle2, Calendar, Users, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications | NextDrive Instructor Portal",
  description: "Operational dispatch alerts and student milestone notifications.",
};

export default async function InstructorNotificationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/notifications");
  }

  const { user } = session;

  if (user.role !== "INSTRUCTOR" && user.role !== "ADMIN") {
    redirect("/student?error=unauthorized_instructor_access");
  }

  let instructor = await db.getInstructorByEmail(user.email);
  if (!instructor) {
    const all = await db.getInstructors();
    instructor = all.find((i) => i.id === "inst_01") || all[0];
  }

  const notifications = [
    {
      id: "notif_01",
      title: "New Student Assigned",
      message: `Daniel Lee has been assigned to your automatic tuition schedule in Highbury & Islington (N1).`,
      time: "2 hours ago",
      icon: Users,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
    },
    {
      id: "notif_02",
      title: "Lesson Confirmed for Today",
      message: `Marcus Thorne confirmed their 2-Hour Practical Test Simulation at 14:00 today.`,
      time: "5 hours ago",
      icon: Calendar,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950",
    },
    {
      id: "notif_03",
      title: "Test Ready Milestone Reached",
      message: `Marcus Thorne has completed 22 hours and is marked TEST READY for Cheetham Hill DTC on Oct 8, 2026.`,
      time: "1 day ago",
      icon: CheckCircle2,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
    },
    {
      id: "notif_04",
      title: "Dual-Control Fleet Inspection Passed",
      message: `Your 2025 VW Golf 1.5 TSI passed the annual commercial dual-control safety audit.`,
      time: "3 days ago",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Bell className="h-6 w-6 text-emerald-600" />
          Dispatch & Fleet Notifications
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Recent automated alerts regarding student assignments, bookings, and test dates.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
              <div className={`p-2.5 rounded-xl ${item.color} shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                  <span className="text-[11px] text-slate-400">{item.time}</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
