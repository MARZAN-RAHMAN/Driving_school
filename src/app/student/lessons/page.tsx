import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { BookOpen, Clock, MapPin, UserCheck, CheckCircle2, MessageSquare, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Lessons & Progress Feedback | NextDrive Student Portal",
  description: "Review lesson notes and competency feedback provided by your DVSA instructor.",
};

export default async function StudentLessonsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student/lessons");
  }

  const { user } = session;

  const allBookings = await db.getBookings();
  const studentBookings = allBookings.filter(
    (b) => b.studentEmail.toLowerCase() === user.email.toLowerCase()
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          My Lessons & Progress Feedback
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed notes, technical driving feedback, and competency reviews from your instructor.
        </p>
      </div>

      <div className="space-y-4">
        {studentBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500">
            <BookOpen className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold">No lesson history yet</p>
            <p className="text-xs text-slate-400 mt-1">Your instructor will log notes here after each driving session.</p>
          </div>
        ) : (
          studentBookings.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">
                      {lesson.lessonTitle}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        lesson.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : lesson.status === "IN_PROGRESS"
                          ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                          : "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300"
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {lesson.dateTime}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <UserCheck className="h-3.5 w-3.5" />
                      {lesson.instructorName}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="h-3.5 w-3.5" />
                      {lesson.pickupLocation}
                    </span>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lesson.durationHours} Hours Session
                  </span>
                </div>
              </div>

              {/* Instructor Feedback Card */}
              {lesson.progressNotes ? (
                <div className="rounded-xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    <Award className="h-4 w-4 text-emerald-600" />
                    Instructor Feedback & Competency Progress:
                  </div>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed font-sans">
                    {lesson.progressNotes}
                  </p>
                </div>
              ) : lesson.instructorNotes ? (
                <div className="rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/50 dark:bg-indigo-950/30 p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                    <MessageSquare className="h-4 w-4 text-indigo-600" />
                    Instructor Lesson Notes:
                  </div>
                  <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-sans">
                    {lesson.instructorNotes}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  No notes logged yet for this session.
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
