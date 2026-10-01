import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { CustomersManager } from "@/components/admin/CustomersManager";

export default async function AdminCustomersPage() {
  const [students, instructors, bookings] = await Promise.all([
    db.getStudents(),
    db.getInstructors(),
    db.getBookings(),
  ]);

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
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Students</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Learner Drivers &amp; Students Directory
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Progress tracker, theory test readiness, lesson hours completed and practical test bookings
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
        </div>
      </div>

      {/* Customers (Students) Manager Client Component */}
      <CustomersManager
        initialStudents={students}
        instructors={instructors}
        allBookings={bookings}
      />
    </div>
  );
}
