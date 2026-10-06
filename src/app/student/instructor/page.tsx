import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserCheck, ShieldCheck, Star, Award, Car, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { InstructorImage } from "@/components/instructor/InstructorImage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Assigned Instructor | NextDrive Student Portal",
  description: "View credentials, dual-control vehicle details, and contact information for your instructor.",
};

export default async function StudentInstructorPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?callbackUrl=/student/instructor");
  }

  const { user } = session;

  const allStudents = await db.getStudents();
  const student = allStudents.find(
    (s) => s.email.toLowerCase() === user.email.toLowerCase()
  );

  const instructors = await db.getInstructors();
  const assignedInstructor = instructors.find(
    (i) => i.id === student?.assignedInstructorId || i.name === student?.assignedInstructorName
  ) || instructors[0];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <UserCheck className="h-6 w-6 text-indigo-600" />
          My Assigned Driving Instructor
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your dedicated DVSA Approved Driving Instructor (ADI) for practical tuition.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border-2 border-indigo-600/30 bg-slate-100 dark:bg-slate-800 shadow-md">
              <InstructorImage
                instructor={assignedInstructor}
                aspectRatio="1/1"
                fallbackSize="lg"
                className="h-full w-full"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {assignedInstructor.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-600/20">
                <ShieldCheck className="h-3 w-3" />
                {assignedInstructor.badgeNumber}
              </span>
            </div>
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {assignedInstructor.grade || "DVSA Grade A Instructor"} &bull; {assignedInstructor.totalPasses} Passes
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{assignedInstructor.rating} / 5.0</span>
              <span className="text-slate-400 font-normal ml-1">Verified Student Rating</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {assignedInstructor.bio && (
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-850 p-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {assignedInstructor.bio}
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Car className="h-4 w-4 text-slate-500" />
              Dual-Control Tuition Car
            </span>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {assignedInstructor.vehicle}
            </p>
            <p className="text-[11px] text-slate-500">Heeman commercial dual controls fitted</p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-slate-500" />
              Covered Test Centers
            </span>
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {(assignedInstructor.areas || ["Cheetham Hill DTC", "West Didsbury DTC"]).join(", ")}
            </p>
            <p className="text-[11px] text-slate-500">Includes door-to-door pickup & dropoff</p>
          </div>
        </div>

        {/* Contact CTAs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href={`tel:${assignedInstructor.phone}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <Phone className="h-4 w-4" />
            Call {assignedInstructor.name} ({assignedInstructor.phone})
          </a>
          <a
            href={`mailto:${assignedInstructor.email}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
          >
            <Mail className="h-4 w-4" />
            Send Email Message
          </a>
        </div>
      </div>
    </div>
  );
}
