import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Award, CheckCircle2, Clock, Calendar, Sparkles, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Syllabus Progress & Test Readiness | NextDrive Student Portal",
  description: "Track your completed DVSA driving competencies and practical test readiness roadmap.",
};

export default async function StudentProgressPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student/progress");
  }

  const { user } = session;

  const allStudents = await db.getStudents();
  const student = allStudents.find(
    (s) => s.email.toLowerCase() === user.email.toLowerCase()
  ) || {
    id: "std_03",
    name: user.name,
    email: user.email,
    hoursCompleted: 22,
    theoryStatus: "PASSED",
    status: "TEST_READY",
    testDate: "Booked: Oct 8, 2026",
  };

  const hoursTarget = 40;
  const progressPercent = Math.min(100, Math.round((student.hoursCompleted / hoursTarget) * 100));

  const competencies = [
    { name: "Cockpit Drill & Vehicle Controls", status: "COMPLETED", date: "Lesson 1" },
    { name: "Moving Off, Stopping & Clutch Control", status: "COMPLETED", date: "Lesson 2" },
    { name: "Approaching Junctions & Mirror Routine", status: "COMPLETED", date: "Lesson 3-4" },
    { name: "Mini & Multi-Lane Roundabouts", status: "COMPLETED", date: "Lesson 5-6" },
    { name: "Parallel Reverse Parking", status: "COMPLETED", date: "Lesson 7" },
    { name: "Forward & Reverse Bay Parking", status: "COMPLETED", date: "Lesson 8" },
    { name: "Pulling Up on Right & Reversing 2 Car Lengths", status: "COMPLETED", date: "Lesson 9" },
    { name: "Controlled Emergency Stop (1 in 3)", status: "COMPLETED", date: "Lesson 10" },
    { name: "Dual Carriageway & 50/70mph Overtaking", status: "COMPLETED", date: "Lesson 11" },
    { name: "Independent Driving with Sat Nav", status: "IN_PROGRESS", date: "Current Focus" },
    { name: "Official DVSA Test Route Mock Rehearsal", status: "SCHEDULED", date: "Oct 8 Simulation" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <Award className="h-6 w-6 text-indigo-600" />
          DVSA Learning Progress & Test Readiness
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your personalized national driving curriculum roadmap towards passing your practical driving test.
        </p>
      </div>

      {/* Progress Metric Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Status: {student.status.replace("_", " ")}
            </span>
            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
              {student.hoursCompleted} Hours Completed
            </h2>
            <p className="text-xs text-slate-500">
              National DVSA recommended baseline: 40 professional hours
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {progressPercent}%
            </span>
            <p className="text-xs text-slate-400">Syllabus Mastered</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>0 hrs (Beginner)</span>
            <span>20 hrs (Intermediate)</span>
            <span>40 hrs (Test Standard)</span>
          </div>
        </div>

        {/* Test Date Callout */}
        {student.testDate && (
          <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-bold shadow-xs">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  Practical Driving Test Booked
                </p>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                  {student.testDate}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-amber-200 dark:bg-amber-900/80 px-3 py-1 text-xs font-bold text-amber-900 dark:text-amber-100">
              Sidcup DTC
            </span>
          </div>
        )}
      </div>

      {/* Competencies Checklist */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
          Official 27-Point DVSA Driving Competency Log
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {competencies.map((comp, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {comp.status === "COMPLETED" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : comp.status === "IN_PROGRESS" ? (
                  <Clock className="h-5 w-5 text-indigo-500 shrink-0 animate-pulse" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-300 dark:border-slate-700 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {comp.name}
                  </p>
                  <p className="text-[11px] text-slate-400">{comp.date}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  comp.status === "COMPLETED"
                    ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                    : comp.status === "IN_PROGRESS"
                    ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                }`}
              >
                {comp.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
