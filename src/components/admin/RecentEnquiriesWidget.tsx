"use client";

import React from "react";
import Link from "next/link";
import { Mail, Phone, Calendar, ArrowRight, MessageSquare, Inbox } from "lucide-react";
import { ContactInquiry } from "@/types";

interface RecentEnquiriesWidgetProps {
  inquiries: ContactInquiry[];
}

export function RecentEnquiriesWidget({ inquiries }: RecentEnquiriesWidgetProps) {
  const displayInquiries = inquiries.slice(0, 5);

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Recent Contact Enquiries
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Prospective learner enquiries from public site
            </p>
          </div>

          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            All Enquiries
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {displayInquiries.length === 0 ? (
          <div className="py-10 text-center">
            <Inbox className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-700" />
            <p className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              No data available
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              New website enquiries will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {displayInquiries.map((inq) => {
              const isNew = inq.status === "NEW";
              const isContacted = inq.status === "CONTACTED";
              const isBooked = inq.status === "BOOKED";

              return (
                <div key={inq.id} className="py-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {inq.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({inq.postcode})
                        </span>
                        {(inq.course || inq.targetPackage) && (
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                            • {inq.course || inq.targetPackage}
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-0.5">
                          <Mail className="h-2.5 w-2.5 text-slate-400" />
                          {inq.email}
                        </span>
                        <span className="flex items-center gap-0.5 font-mono">
                          <Phone className="h-2.5 w-2.5 text-slate-400" />
                          {inq.phone}
                        </span>
                      </div>

                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                        &quot;{inq.notes || inq.message || "Enquiry for driving lessons"}&quot;
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold ${
                          isNew
                            ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20"
                            : isContacted
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20"
                            : isBooked
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {inq.status}
                      </span>
                      <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                        {inq.createdAt.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <Link
          href="/admin/enquiries"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
        >
          <MessageSquare className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          Manage Inquiries ({inquiries.length})
        </Link>
      </div>
    </div>
  );
}
