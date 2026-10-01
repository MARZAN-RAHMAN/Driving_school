import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { MessageSquare, Phone, Send, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Messages | NextDrive Instructor Portal",
  description: "Communication hub for driving instructor learner messages and dispatch notifications.",
};

export default async function InstructorMessagesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/instructor/messages");
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

  const students = await db.getStudentsByInstructor(instructor.id);

  const templates = [
    {
      title: "Lesson Reminder (Tomorrow)",
      content: `Hi [Name], this is ${instructor.name} from NextDrive. Just confirming our driving lesson tomorrow at [Time]. Please have your provisional licence ready!`,
    },
    {
      title: "Running Late (5-10 mins)",
      content: `Hi [Name], I'm currently held up in traffic on my way to your pickup address. Expected arrival in 5-10 minutes. Thanks for your patience!`,
    },
    {
      title: "Test Ready Milestone",
      content: `Hi [Name], great session today! You are now in the Test Ready stage on the DVSA syllabus. We will focus our next 2 sessions on official mock test routes.`,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <MessageSquare className="h-6 w-6 text-emerald-600" />
          Learner Messaging Hub
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Quick-contact your assigned students via SMS, telephone, or WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Quick Contact List */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Assigned Students ({students.length})
          </h2>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((student) => (
              <div key={student.id} className="py-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {student.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{student.phone}</p>
                </div>
                <a
                  href={`tel:${student.phone}`}
                  className="rounded-lg bg-emerald-50 dark:bg-emerald-950/60 p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                  title="Call student"
                >
                  <Phone className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Message Templates */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Send className="h-4 w-4 text-emerald-600" />
              Standard SMS & WhatsApp Templates
            </h2>
            <p className="text-xs text-slate-500">
              One-click template messages to send to your learners:
            </p>

            <div className="space-y-3 pt-2">
              {templates.map((tpl, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {tpl.title}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">SMS Ready</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-mono bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800">
                    {tpl.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
