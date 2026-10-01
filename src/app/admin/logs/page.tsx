import React from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { db } from "@/lib/db";

export default async function AdminLogsPage() {
  const logs = await db.getAuditLogs(20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Security & System Audit Stream
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Immutable event telemetry capturing user authentication, role elevation, and administrative operations.
        </p>
      </div>

      {/* Log Inspector */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs dark:divide-slate-800">
          <thead className="bg-slate-50 font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Severity
              </th>
              <th scope="col" className="px-6 py-3.5">
                Event Action
              </th>
              <th scope="col" className="px-6 py-3.5">
                Actor Identity
              </th>
              <th scope="col" className="px-6 py-3.5">
                Target Subsystem
              </th>
              <th scope="col" className="px-6 py-3.5">
                IP Address
              </th>
              <th scope="col" className="px-6 py-3.5">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white font-mono text-[11px] dark:divide-slate-800/60 dark:bg-slate-900">
            {logs.map((log) => {
              const isSuccess = log.severity === "SUCCESS";
              const isWarning = log.severity === "WARNING";
              const isFailed = log.severity === "FAILED";

              return (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="whitespace-nowrap px-6 py-3.5 font-sans">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        isSuccess
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : isWarning
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                          : isFailed
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                      ) : isWarning ? (
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-rose-500" />
                      )}
                      {log.severity}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                    {log.action}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-600 font-sans dark:text-slate-300">
                    {log.actorEmail}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-500 dark:text-slate-400">
                    {log.target}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-400 dark:text-slate-500">
                    {log.ip}
                  </td>
                  <td className="whitespace-nowrap px-6 py-3.5 text-slate-500 dark:text-slate-400">
                    {log.timestamp}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
