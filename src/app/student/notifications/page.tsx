import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Bell, Calendar, CheckCircle2, Award, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications | NextDrive Student Portal",
  description: "Lesson schedule alerts and learning milestone notifications.",
};

export default async function StudentNotificationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student/notifications");
  }

  const notifications = [
    {
      id: "snotif_01",
      title: "Lesson Confirmed for Today",
      message:
        "Your 2-Hour Practical Test Simulation with Dave Miller is confirmed for today at 14:00 PM.",
      time: "4 hours ago",
      icon: Calendar,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950",
    },
    {
      id: "snotif_02",
      title: "New Instructor Notes Added",
      message:
        "Dave Miller added feedback for 'Roundabouts & Spiral Lanes': 'Excellent lane discipline on 3-lane roundabouts.'",
      time: "Yesterday",
      icon: Award,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
    },
    {
      id: "snotif_03",
      title: "20-Hour Milestone Achieved",
      message:
        "Congratulations! You have completed 22 hours of professional tuition and are now marked TEST READY.",
      time: "3 days ago",
      icon: CheckCircle2,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950",
    },
    {
      id: "snotif_04",
      title: "Theory Test Passed Verified",
      message:
        "Your Theory Test certificate has been verified by NextDrive administration.",
      time: "2 weeks ago",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Bell className="h-6 w-6 text-indigo-600" />
          My Notifications & Alerts
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Recent lesson updates, instructor notes, and test preparation reminders.
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
