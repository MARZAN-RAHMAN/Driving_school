import React from "react";
import Link from "next/link";
import { ArrowLeft, Megaphone } from "lucide-react";
import { db } from "@/lib/db";
import { PopupManager } from "@/components/admin/PopupManager";

export const dynamic = "force-dynamic";

export default async function AdminPopupPage() {
  const campaign = await db.getPopupCampaign(false);
  const published = await db.getPopupCampaign(true);
  const analytics = await db.getPopupAnalytics();

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
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
            <span className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition">
              Marketing
            </span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Popup Manager</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Website Popup &amp; Lead Capture
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure visitor trigger delays, form fields, styling, frequency, and live conversion analytics
              </p>
            </div>
          </div>
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

      {/* Main Popup Manager Interface */}
      <PopupManager
        initialCampaign={campaign}
        initialPublished={published}
        initialAnalytics={analytics}
      />
    </div>
  );
}
