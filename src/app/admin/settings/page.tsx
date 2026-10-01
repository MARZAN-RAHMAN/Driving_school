import React from "react";
import Link from "next/link";
import { Shield, Database, ExternalLink, CheckCircle2, ArrowLeft } from "lucide-react";
import { db } from "@/lib/db";
import { BusinessSettingsForm } from "@/components/admin/BusinessSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await db.getBusinessSettings();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="text-xs font-medium text-slate-400 hover:text-slate-600 transition dark:text-slate-500 dark:hover:text-slate-300"
            >
              Control Center
            </Link>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Settings</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Platform Architecture & Settings
          </h1>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Driving School Business Configuration • Operating Window, Tuition Rates, DVSA Compliance & Platform Specs
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Dashboard
          </Link>
          <Link
            href="/api/admin/database"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Inspect DB Diagnostics
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Phase 05: Driving School Business Configuration Form */}
      <div>
        <BusinessSettingsForm initialSettings={settings} />
      </div>

      {/* System Infrastructure Telemetry & Specifications (Preserved from Phase 02 & 03) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Security Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-white">
              RBAC & Session Security
            </h2>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Edge Route Interception</p>
                <p className="text-slate-500 dark:text-slate-400">Redirect unauthorized visitors before rendering server components</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">HTTP-Only Cookie Storage</p>
                <p className="text-slate-500 dark:text-slate-400">Prevents XSS extraction of authentication session tokens</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Enabled
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Session Inactivity Timeout</p>
                <p className="text-slate-500 dark:text-slate-400">Max idle duration before re-authentication</p>
              </div>
              <span className="font-mono text-slate-700 font-medium dark:text-slate-300">7 Days</span>
            </div>
          </div>
        </div>

        {/* Database Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Database className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider dark:text-white">
              PostgreSQL & Prisma Layer
            </h2>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Prisma ORM Engine</p>
                <p className="text-slate-500 dark:text-slate-400">Schema validated with darwin-arm64 engines</p>
              </div>
              <span className="font-mono text-slate-700 font-medium dark:text-slate-300">Prisma v6.4.1</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Active Migration Version</p>
                <p className="text-slate-500 dark:text-slate-400">prisma/migrations/20260930000000_init</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                <CheckCircle2 className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                20260930000000_init
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">PostgreSQL Schema Entities</p>
                <p className="text-slate-500 dark:text-slate-400">User, ContentItem, AuditLog, SystemMetric</p>
              </div>
              <span className="font-mono text-slate-700 font-medium dark:text-slate-300">4 Models • 3 Enums</span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Connection Mode</p>
                <p className="text-slate-500 dark:text-slate-400">Direct / Connection Pooled (PgBouncer ready)</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                Ready
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
