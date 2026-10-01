import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { InstructorsManager } from "@/components/admin/InstructorsManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Instructors Fleet | NextDrive Operations",
  description: "DVSA Approved Driving Instructors (ADI), dual-control vehicle fleet and student capacity.",
};

export default async function AdminInstructorsPage() {
  const instructors = await db.getInstructors();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            >
              Control Center
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Instructors</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Certified Instructor Fleet
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            DVSA Approved Driving Instructors (ADI), dual-control vehicle fleet and student loads
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <Link
            href="/#instructors"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <span>Public Fleet</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <InstructorsManager initialInstructors={instructors} />
    </div>
  );
}
