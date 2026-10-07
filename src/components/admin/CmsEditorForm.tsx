"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  Share2,
  Search,
  Type,
  TrendingUp,
  Image as ImageIcon,
} from "lucide-react";
import { BusinessSettings } from "@/types";

interface CmsEditorFormProps {
  initialSettings: BusinessSettings;
}

export function CmsEditorForm({ initialSettings }: CmsEditorFormProps) {
  const [formData, setFormData] = useState<BusinessSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<"hero" | "brand" | "metrics" | "social" | "seo">("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (field: keyof BusinessSettings, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleKeywordsChange = (value: string) => {
    const list = value.split(",").map((k) => k.trim()).filter(Boolean);
    handleChange("metaKeywords", list);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to update CMS content.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: "CMS content published successfully! Live public website updated instantly.",
        });
        if (data.settings) {
          setFormData(data.settings);
        }
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred while publishing CMS content.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      {/* CMS Sub-navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto scrollbar-none px-4 pt-3 dark:border-slate-800 dark:bg-slate-950/40">
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "hero"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Type className="h-4 w-4" />
          Hero Section &amp; CTAs
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("brand")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "brand"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Globe className="h-4 w-4" />
          Brand &amp; Logo Identity
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("metrics")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "metrics"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Trust &amp; Proof Metrics
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "social"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Share2 className="h-4 w-4" />
          Social Channels
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "seo"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Search className="h-4 w-4" />
          SEO &amp; OpenGraph
        </button>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-6">
        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`flex items-center gap-3 rounded-xl p-4 text-xs font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
                : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* 1. HERO TAB */}
        {activeTab === "hero" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Homepage Hero Section &amp; Main Headline
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Controls the main headline, subhead, badges, and primary call-to-actions on the public homepage.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Trust Badge Text (e.g. DVSA Approved Driving Academy)
                </label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => handleChange("heroBadge", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Pass Rate Pill Badge (e.g. 89.4% Practical Pass Rate)
                </label>
                <input
                  type="text"
                  value={formData.heroPassRateBadge}
                  onChange={(e) => handleChange("heroPassRateBadge", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => handleChange("heroHeadline", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Hero Subhead Description
              </label>
              <textarea
                rows={3}
                value={formData.heroSubhead}
                onChange={(e) => handleChange("heroSubhead", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Primary Action Button Text
                </label>
                <input
                  type="text"
                  value={formData.heroPrimaryCtaText}
                  onChange={(e) => handleChange("heroPrimaryCtaText", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Primary Action Link Target
                </label>
                <input
                  type="text"
                  value={formData.heroPrimaryCtaLink}
                  onChange={(e) => handleChange("heroPrimaryCtaLink", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Secondary Action Button Label (Hotline)
                </label>
                <input
                  type="text"
                  value={formData.heroSecondaryCtaText}
                  onChange={(e) => handleChange("heroSecondaryCtaText", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Hotline Phone (Synced with Settings)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. BRAND TAB */}
        {activeTab === "brand" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                School Branding, Logo &amp; Identity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configures the business brand name, logo, badge, and tagline displayed across Navbar, Footer, and Header.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Business Brand Name
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Trading Name (Legal Entity)
                </label>
                <input
                  type="text"
                  value={formData.tradingName}
                  onChange={(e) => handleChange("tradingName", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Logo Badge Pill (e.g. &quot;Academy&quot; or &quot;Pro&quot;)
                </label>
                <input
                  type="text"
                  value={formData.logoBadgeText || ""}
                  onChange={(e) => handleChange("logoBadgeText", e.target.value)}
                  placeholder="Academy"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Brand Tagline (e.g. &quot;DVSA Certified • Manchester&quot;)
                </label>
                <input
                  type="text"
                  value={formData.tagline || ""}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  placeholder="DVSA Certified • Manchester"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Custom Logo Image URL (leave empty to use default geometric logo)
              </label>
              <div className="mt-1.5 flex items-center gap-3">
                <input
                  type="url"
                  value={formData.logoUrl || ""}
                  onChange={(e) => handleChange("logoUrl", e.target.value)}
                  placeholder="https://images.unsplash.com/... or /logo.png"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
                <span className="shrink-0 p-2 rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  <ImageIcon className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. METRICS TAB */}
        {activeTab === "metrics" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Conversion &amp; Trust Telemetry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                These numbers display in the hero trust grid, pass stories, and website footer.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  First-Time Pass Rate (e.g. 89.4%)
                </label>
                <input
                  type="text"
                  value={formData.firstTimePassRate}
                  onChange={(e) => handleChange("firstTimePassRate", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Total Verified Passes (e.g. 500+)
                </label>
                <input
                  type="text"
                  value={formData.totalPassesCount}
                  onChange={(e) => handleChange("totalPassesCount", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Active Fleet Capacity (e.g. 12 Dual-Control Cars)
                </label>
                <input
                  type="text"
                  value={formData.activeFleetCount}
                  onChange={(e) => handleChange("activeFleetCount", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Google &amp; Trustpilot Rating (e.g. 4.9 ★)
                </label>
                <input
                  type="text"
                  value={formData.googleRating}
                  onChange={(e) => handleChange("googleRating", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. SOCIAL TAB */}
        {activeTab === "social" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Social Media Profiles &amp; Community Channels
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Links are automatically published in the website footer and contact channels.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={formData.instagramUrl || ""}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  placeholder="https://instagram.com/nextdrive"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  TikTok Channel URL
                </label>
                <input
                  type="url"
                  value={formData.tiktokUrl || ""}
                  onChange={(e) => handleChange("tiktokUrl", e.target.value)}
                  placeholder="https://tiktok.com/@nextdrive"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl || ""}
                  onChange={(e) => handleChange("youtubeUrl", e.target.value)}
                  placeholder="https://youtube.com/@nextdrive"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Twitter / X Profile URL
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl || ""}
                  onChange={(e) => handleChange("twitterUrl", e.target.value)}
                  placeholder="https://twitter.com/nextdrive"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl || ""}
                onChange={(e) => handleChange("facebookUrl", e.target.value)}
                placeholder="https://facebook.com/nextdrive"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
              />
            </div>
          </div>
        )}

        {/* 5. SEO TAB */}
        {activeTab === "seo" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                SEO Metadata, OpenGraph &amp; Social Previews
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Directly feeds the Next.js `generateMetadata` engine, updating search engine snippets and social sharing cards.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleChange("metaTitle", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                SEO Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleChange("metaDescription", e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-700 focus:border-indigo-600 focus:bg-white focus:outline-none leading-relaxed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={(formData.metaKeywords || []).join(", ")}
                onChange={(e) => handleKeywordsChange(e.target.value)}
                placeholder="driving lessons manchester, learn to drive, pass first time"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                OpenGraph Share Image URL
              </label>
              <input
                type="url"
                value={formData.ogImageUrl || ""}
                onChange={(e) => handleChange("ogImageUrl", e.target.value)}
                placeholder="https://nextdrive.uk/og-card.png"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-900"
              />
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              Preview Live Public Site
            </Link>
            <Link
              href="/contact"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              Preview Contact Page
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing to Live Site...
              </span>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save &amp; Publish Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
