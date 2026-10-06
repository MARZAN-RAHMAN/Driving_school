import React from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { SeoManager } from "@/components/admin/SeoManager";

export const dynamic = "force-dynamic";

export default async function AdminSeoPage() {
  const settings = await db.getBusinessSettings();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/admin"
            className="text-muted-foreground hover:text-foreground transition"
          >
            Control Center
          </Link>
          <span className="text-muted-foreground/40">/</span>
          <span className="font-semibold text-foreground">SEO Manager</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
          >
            <span>Live Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* SEO Manager Client Component */}
      <SeoManager initialSettings={settings} />
    </div>
  );
}
