"use client";

import React, { useState } from "react";
import {
  Globe,
  Search,
  Share2,
  CheckCircle2,
  AlertCircle,
  Code2,
  Save,
  Loader2,
  ExternalLink,
  Smartphone,
  Monitor,
  Sparkles,
} from "lucide-react";
import { BusinessSettings } from "@/types";

interface SeoManagerProps {
  initialSettings: BusinessSettings;
}

export function SeoManager({ initialSettings }: SeoManagerProps) {
  const [metaTitle, setMetaTitle] = useState(
    initialSettings.metaTitle || "NextDrive Academy | Manchester Driving School & Intensive Lessons"
  );
  const [metaDescription, setMetaDescription] = useState(
    initialSettings.metaDescription ||
      "DVSA-approved Grade A driving instructors across Manchester. High 89% first-time pass rate, modern dual-control automatic and manual fleet. Book online today."
  );
  const [keywords, setKeywords] = useState<string[]>(
    initialSettings.metaKeywords || [
      "driving lessons manchester",
      "learn to drive manchester",
      "automatic driving lessons manchester",
      "intensive driving course manchester",
      "dvsa test routes cheetham hill",
    ]
  );
  const [newKeyword, setNewKeyword] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState(
    initialSettings.ogImageUrl ||
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop"
  );

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewTab, setPreviewTab] = useState<"google" | "social" | "schema">("google");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const titleLength = metaTitle.length;
  const descLength = metaDescription.length;

  const titleStatus =
    titleLength >= 40 && titleLength <= 65
      ? "optimal"
      : titleLength < 40
      ? "short"
      : "long";

  const descStatus =
    descLength >= 120 && descLength <= 165
      ? "optimal"
      : descLength < 120
      ? "short"
      : "long";

  const handleAddKeyword = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    e.preventDefault();
    const clean = newKeyword.trim().toLowerCase();
    if (clean && !keywords.includes(clean)) {
      setKeywords([...keywords, clean]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== kwToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast(null);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metaTitle,
          metaDescription,
          metaKeywords: keywords,
          ogImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update SEO settings.");
      }

      setToast({ type: "success", text: "SEO metadata saved successfully and live on public site." });
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setToast({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update SEO settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const jsonLdExample = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": initialSettings.businessName,
    "url": "https://nextdrive.uk",
    "telephone": initialSettings.phone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": initialSettings.headOfficeAddress,
      "addressLocality": "Manchester",
      "addressCountry": "GB",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 53.4808,
      "longitude": -2.2426,
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": initialSettings.googleRating || "4.9",
      "reviewCount": initialSettings.totalPassesCount || "480",
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Globe className="h-3.5 w-3.5" />
            <span>Search Engine Optimization &amp; Social Previews</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            SEO Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Configure site-wide meta tags, social sharing cards, and search snippet previews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <span>Sitemap.xml</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <span>Robots.txt</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </div>
      </div>

      {toast && (
        <div
          role="alert"
          className={`flex items-center gap-2 rounded-xl p-4 text-xs font-semibold shadow-xs animate-in fade-in duration-150 ${
            toast.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Main Grid: Left Editor, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <form onSubmit={handleSave} className="lg:col-span-6 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Core Search Metadata
            </h2>

            {/* Meta Title */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-foreground">
                  Meta Title *
                </label>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    titleStatus === "optimal"
                      ? "text-emerald-500"
                      : titleStatus === "short"
                      ? "text-amber-500"
                      : "text-rose-500"
                  }`}
                >
                  {titleLength} / 60 chars ({titleStatus})
                </span>
              </div>
              <input
                type="text"
                required
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="e.g. NextDrive | Manchester Driving School & Lessons"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Appears in search engine tabs and title links. Recommended: 50-60 characters.
              </p>
            </div>

            {/* Meta Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-foreground">
                  Meta Description *
                </label>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    descStatus === "optimal"
                      ? "text-emerald-500"
                      : descStatus === "short"
                      ? "text-amber-500"
                      : "text-rose-500"
                  }`}
                >
                  {descLength} / 160 chars ({descStatus})
                </span>
              </div>
              <textarea
                rows={3}
                required
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="e.g. DVSA-approved Grade A driving instructors across Manchester..."
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Appears as snippet description under search results. Recommended: 140-160 characters.
              </p>
            </div>

            {/* Social Share Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Open Graph / Social Card Image URL
              </label>
              <input
                type="url"
                value={ogImageUrl}
                onChange={(e) => setOgImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Recommended dimensions: 1200 x 630 pixels. Used when sharing links on WhatsApp, iMessage, Facebook, and Twitter.
              </p>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground block">
                Target Keywords &amp; Search Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  placeholder="e.g. driving lessons salford"
                  className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-semibold hover:bg-muted transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-foreground"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(kw)}
                      className="text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <button
                type="submit"
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving SEO Configuration...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Live Preview Panel */}
        <div className="lg:col-span-6 space-y-4">
          {/* Tab Selector */}
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPreviewTab("google")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  previewTab === "google"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                <span>Google SERP</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("social")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  previewTab === "social"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Social Card</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("schema")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  previewTab === "schema"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Schema JSON-LD</span>
              </button>
            </div>

            {previewTab === "google" && (
              <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1 rounded-md text-xs transition ${
                    previewDevice === "desktop"
                      ? "bg-card shadow-xs text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1 rounded-md text-xs transition ${
                    previewDevice === "mobile"
                      ? "bg-card shadow-xs text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Preview Content */}
          {previewTab === "google" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Google Search Engine Result Snippet ({previewDevice})
                </span>
                <span className="font-mono text-[10px]">google.co.uk</span>
              </div>

              <div
                className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 space-y-1.5 ${
                  previewDevice === "mobile" ? "max-w-xs mx-auto" : ""
                }`}
              >
                {/* Site Brand Breadcrumb */}
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-800 dark:text-slate-200 shrink-0">
                    ND
                  </div>
                  <div className="leading-tight overflow-hidden">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                      {initialSettings.businessName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">
                      https://nextdrive.uk
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer leading-snug line-clamp-2">
                  {metaTitle || "Untitled Page"}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {metaDescription || "No description provided."}
                </p>
              </div>
            </div>
          )}

          {previewTab === "social" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground block">
                Open Graph Card Preview (Facebook, Twitter, LinkedIn)
              </span>

              <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-md max-w-md mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogImageUrl}
                  alt="Social preview"
                  className="w-full h-48 object-cover bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop";
                  }}
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
                    nextdrive.uk
                  </span>
                  <h4 className="text-sm font-bold text-foreground line-clamp-2">
                    {metaTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {metaDescription}
                  </p>
                </div>
              </div>
            </div>
          )}

          {previewTab === "schema" && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-muted-foreground block">
                JSON-LD LocalBusiness Structured Data
              </span>
              <pre className="rounded-xl border border-border bg-muted/40 p-4 text-[11px] font-mono text-foreground overflow-x-auto">
                {JSON.stringify(jsonLdExample, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default SeoManager;
