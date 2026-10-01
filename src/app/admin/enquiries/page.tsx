import React from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { EnquiriesManager } from "@/components/admin/EnquiriesManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Leads & Enquiries Management | NextDrive Operations",
  description: "View and manage incoming driving lesson inquiries, student postcodes, and lead status dispatch.",
};

export default async function AdminEnquiriesPage() {
  const [inquiries, packages, locations] = await Promise.all([
    db.getInquiries(),
    db.getLessonPackages(),
    db.getLocations(),
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
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Leads &amp; Enquiries</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Leads &amp; Enquiries Management
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-500/20">
              <Sparkles className="h-3 w-3" />
              Live Lead Ingestion
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Real-time student leads from booking modal pop-ups, course cards, and website contact forms
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
            href="/contact"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Public Contact Form
          </Link>
        </div>
      </div>

      <EnquiriesManager
        initialInquiries={inquiries}
        availableCourses={packages.map((p) => p.title)}
        availableAreas={locations.map((l) => l.name)}
      />
    </div>
  );
}
