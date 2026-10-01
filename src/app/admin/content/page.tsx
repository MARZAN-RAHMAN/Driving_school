import React from "react";
import { Plus, Eye, Tag } from "lucide-react";
import { db } from "@/lib/db";

interface ContentPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminContentPage({ searchParams }: ContentPageProps) {
  const { status } = await searchParams;
  const items = await db.getContent(status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Content & System Resources
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Author, categorize, and deploy architecture articles and platform resources.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <Plus className="h-4 w-4" />
          Create New Resource
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <a
          href="/admin/content"
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            !status || status === "ALL"
              ? "bg-slate-900 text-white dark:bg-slate-800"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          All Items ({items.length})
        </a>
        <a
          href="/admin/content?status=PUBLISHED"
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            status === "PUBLISHED"
              ? "bg-indigo-600 text-white dark:bg-indigo-500"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          Published Only
        </a>
        <a
          href="/admin/content?status=DRAFT"
          className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
            status === "DRAFT"
              ? "bg-amber-600 text-white dark:bg-amber-500"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }`}
        >
          Drafts Only
        </a>
      </div>

      {/* Content Grid / Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs dark:divide-slate-800">
          <thead className="bg-slate-50 font-semibold uppercase tracking-wider text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Article / Resource
              </th>
              <th scope="col" className="px-6 py-3.5">
                Category
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5">
                Views
              </th>
              <th scope="col" className="px-6 py-3.5">
                Author
              </th>
              <th scope="col" className="px-6 py-3.5">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800/60 dark:bg-slate-900">
            {items.map((item) => {
              const isPublished = item.status === "PUBLISHED";

              return (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="font-mono text-[11px] text-slate-400 dark:text-slate-500">/{item.slug}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      <Tag className="h-3 w-3 text-slate-400 dark:text-slate-500" />
                      {item.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        isPublished
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-500/30"
                          : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/60 dark:text-amber-400 dark:ring-amber-500/30"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600 font-mono text-[11px] dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                      {item.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-700 font-medium dark:text-slate-300">
                    {item.authorName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500 font-mono text-[11px] dark:text-slate-400">
                    {item.updatedAt}
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
