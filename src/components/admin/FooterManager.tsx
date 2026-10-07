"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FooterSettings,
  FooterColumnItem,
  FooterLinkItem,
  FooterSocialItem,
  FooterLegalLinkItem,
  FooterSocialPlatform,
  LocationArea,
  BusinessSettings,
} from "@/types";
import {
  PanelBottom,
  Layers,
  Link2,
  Phone,
  Share2,
  Megaphone,
  ShieldCheck,
  Code,
  Palette,
  Eye,
  Save,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Globe,
  Building2,
  Clock,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Car,
  Award,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";

interface FooterManagerProps {
  initialDraft: FooterSettings;
  published: FooterSettings;
  availableLocations: LocationArea[];
  businessSettings?: BusinessSettings;
}

type TabType =
  | "general"
  | "brand"
  | "columns"
  | "locations"
  | "contact"
  | "social"
  | "cta"
  | "legal"
  | "credit"
  | "design";

export function FooterManager({
  initialDraft,
  published: initialPublished,
  availableLocations,
  businessSettings,
}: FooterManagerProps) {
  // Main state
  const [draft, setDraft] = useState<FooterSettings>(initialDraft);
  const [published, setPublished] = useState<FooterSettings>(initialPublished);
  const [activeTab, setActiveTab] = useState<TabType>("columns");

  // Operation states
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Live preview controls
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [previewAccordionOpen, setPreviewAccordionOpen] = useState<Record<string, boolean>>({});

  // Check if draft has unsaved changes compared to published
  const hasUnsavedChanges = JSON.stringify(draft) !== JSON.stringify(published);

  // Show temporary toast notification
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Update draft partial
  const updateDraft = (updates: Partial<FooterSettings>) => {
    setDraft((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  // Master Enable / Disable Toggle
  const handleToggleEnable = async () => {
    setIsToggling(true);
    const newStatus = !draft.isEnabled;
    try {
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", isEnabled: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setDraft((prev) => ({ ...prev, isEnabled: newStatus }));
        setPublished((prev) => ({ ...prev, isEnabled: newStatus }));
        showToast(`Footer ${newStatus ? "enabled" : "disabled"} on live website.`);
      } else {
        showToast(data.error || "Failed to toggle status", "error");
      }
    } catch {
      showToast("Network error toggling footer status", "error");
    } finally {
      setIsToggling(false);
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (data.success) {
        setDraft(data.settings);
        showToast("Draft changes saved successfully.");
      } else {
        showToast(data.error || "Failed to save draft", "error");
      }
    } catch {
      showToast("Network error saving draft", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Changes
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First save current draft to ensure all latest edits are stored
      await fetch("/api/admin/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      // Then publish
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const data = await res.json();
      if (data.success) {
        setPublished(data.settings);
        setDraft(data.settings);
        showToast("🎉 Footer changes published to live website!");
      } else {
        showToast(data.error || "Failed to publish changes", "error");
      }
    } catch {
      showToast("Network error publishing changes", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset to Defaults
  const handleResetToDefaults = async () => {
    if (!confirm("Are you sure you want to reset all footer settings back to the system defaults? This cannot be undone.")) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.success) {
        setDraft(data.settings);
        setPublished(data.settings);
        showToast("Footer reset to default configuration.");
      } else {
        showToast(data.error || "Failed to reset footer", "error");
      }
    } catch {
      showToast("Network error resetting footer", "error");
    } finally {
      setIsResetting(false);
    }
  };

  // Revert draft to published
  const handleDiscardDraft = () => {
    if (confirm("Discard all unsaved edits and restore the currently published settings?")) {
      setDraft(JSON.parse(JSON.stringify(published)));
      showToast("Unsaved changes discarded.");
    }
  };

  // -------------------------------------------------------------
  // Column Management Helpers
  // -------------------------------------------------------------
  const handleAddColumn = () => {
    const newCol: FooterColumnItem = {
      id: `col_${Date.now()}`,
      title: "New Column",
      source: "custom",
      displayOrder: draft.columns.length + 1,
      isEnabled: true,
      links: [
        {
          id: `lnk_${Date.now()}_1`,
          label: "New Page Link",
          url: "/#courses",
          openInNewTab: false,
          isEnabled: true,
          displayOrder: 1,
        },
      ],
    };
    updateDraft({ columns: [...draft.columns, newCol] });
  };

  const handleUpdateColumn = (colId: string, updates: Partial<FooterColumnItem>) => {
    const newCols = draft.columns.map((c) => (c.id === colId ? { ...c, ...updates } : c));
    updateDraft({ columns: newCols });
  };

  const handleDeleteColumn = (colId: string) => {
    if (draft.columns.length <= 1) {
      alert("At least one footer column must remain.");
      return;
    }
    if (confirm("Delete this entire footer column and its links?")) {
      const newCols = draft.columns.filter((c) => c.id !== colId);
      updateDraft({ columns: newCols });
    }
  };

  const handleMoveColumn = (index: number, direction: "up" | "down") => {
    const newCols = [...draft.columns];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCols.length) return;
    const temp = newCols[index];
    newCols[index] = newCols[targetIdx];
    newCols[targetIdx] = temp;
    // update display order
    newCols.forEach((col, idx) => {
      col.displayOrder = idx + 1;
    });
    updateDraft({ columns: newCols });
  };

  // Link Management within a Column
  const handleAddLink = (colId: string) => {
    const col = draft.columns.find((c) => c.id === colId);
    if (!col) return;
    const newLink: FooterLinkItem = {
      id: `lnk_${Date.now()}`,
      label: "New Link",
      url: "/#courses",
      openInNewTab: false,
      isEnabled: true,
      displayOrder: (col.links || []).length + 1,
    };
    const newCols = draft.columns.map((c) =>
      c.id === colId ? { ...c, links: [...(c.links || []), newLink] } : c
    );
    updateDraft({ columns: newCols });
  };

  const handleUpdateLink = (colId: string, linkId: string, updates: Partial<FooterLinkItem>) => {
    const newCols = draft.columns.map((c) => {
      if (c.id !== colId) return c;
      const updatedLinks = (c.links || []).map((l) => (l.id === linkId ? { ...l, ...updates } : l));
      return { ...c, links: updatedLinks };
    });
    updateDraft({ columns: newCols });
  };

  const handleDeleteLink = (colId: string, linkId: string) => {
    const newCols = draft.columns.map((c) => {
      if (c.id !== colId) return c;
      return { ...c, links: (c.links || []).filter((l) => l.id !== linkId) };
    });
    updateDraft({ columns: newCols });
  };

  const handleMoveLink = (colId: string, linkIdx: number, direction: "up" | "down") => {
    const col = draft.columns.find((c) => c.id === colId);
    if (!col || !col.links) return;
    const targetIdx = direction === "up" ? linkIdx - 1 : linkIdx + 1;
    if (targetIdx < 0 || targetIdx >= col.links.length) return;
    const newLinks = [...col.links];
    const temp = newLinks[linkIdx];
    newLinks[linkIdx] = newLinks[targetIdx];
    newLinks[targetIdx] = temp;
    newLinks.forEach((lnk, i) => {
      lnk.displayOrder = i + 1;
    });
    const newCols = draft.columns.map((c) => (c.id === colId ? { ...c, links: newLinks } : c));
    updateDraft({ columns: newCols });
  };

  // -------------------------------------------------------------
  // Legal Links Management
  // -------------------------------------------------------------
  const handleAddLegalLink = () => {
    const newLegal: FooterLegalLinkItem = {
      id: `lgl_${Date.now()}`,
      label: "Legal Page",
      url: "/privacy",
      isEnabled: true,
      displayOrder: draft.legalLinks.length + 1,
    };
    updateDraft({ legalLinks: [...draft.legalLinks, newLegal] });
  };

  const handleUpdateLegalLink = (id: string, updates: Partial<FooterLegalLinkItem>) => {
    const newLegal = draft.legalLinks.map((l) => (l.id === id ? { ...l, ...updates } : l));
    updateDraft({ legalLinks: newLegal });
  };

  const handleDeleteLegalLink = (id: string) => {
    updateDraft({ legalLinks: draft.legalLinks.filter((l) => l.id !== id) });
  };

  // -------------------------------------------------------------
  // Social Media Management
  // -------------------------------------------------------------
  const handleUpdateSocialLink = (id: string, updates: Partial<FooterSocialItem>) => {
    const newSocial = draft.socialLinks.map((s) => (s.id === id ? { ...s, ...updates } : s));
    updateDraft({ socialLinks: newSocial });
  };

  // Determine computed brand info for preview
  const resolvedBrandName = draft.useBusinessBrand && businessSettings?.businessName
    ? businessSettings.businessName
    : draft.brandName || "NextDrive";
  const resolvedTagline = draft.useBusinessBrand && businessSettings?.tagline
    ? businessSettings.tagline
    : draft.tagline || "Driving Academy Manchester";
  const resolvedDescription = draft.description;
  const resolvedPhone = draft.useBusinessContact && businessSettings?.phone
    ? businessSettings.phone
    : draft.phone || "+44 161 946 0921";
  const resolvedEmail = draft.useBusinessContact && businessSettings?.email
    ? businessSettings.email
    : draft.email || "support@nextdrive.uk";
  const resolvedAddress = draft.useBusinessContact && businessSettings?.headOfficeAddress
    ? businessSettings.headOfficeAddress
    : draft.address || "Peter House, Oxford Street, Manchester, M1 5AN";
  const resolvedDvsa = draft.dvsaSchoolId || businessSettings?.dvsaSchoolId || "DVSA-SCH-90412";

  // Tab definitions
  const tabs = [
    { id: "general", label: "General", icon: SlidersHorizontal },
    { id: "brand", label: "Brand", icon: Building2 },
    { id: "columns", label: "Columns & Links", icon: Layers, badge: draft.columns.length.toString() },
    { id: "locations", label: "Service Areas", icon: MapPin },
    { id: "contact", label: "Contact Info", icon: Phone },
    { id: "social", label: "Social Media", icon: Share2, badge: draft.socialLinks.filter((s) => s.isEnabled).length.toString() },
    { id: "cta", label: "Footer CTA", icon: Megaphone, badge: draft.showCTA ? "ON" : "OFF" },
    { id: "legal", label: "Legal & Bottom", icon: ShieldCheck },
    { id: "credit", label: "Developer Tag", icon: Code, badge: draft.showDeveloperCredit ? "Active" : "Hidden" },
    { id: "design", label: "Design", icon: Palette },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-semibold shadow-xl border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toastMessage.type === "error"
              ? "bg-rose-500/90 text-white border-rose-600 shadow-rose-500/20"
              : toastMessage.type === "info"
              ? "bg-sky-500/90 text-white border-sky-600 shadow-sky-500/20"
              : "bg-emerald-600/95 text-white border-emerald-700 shadow-emerald-500/20"
          }`}
        >
          {toastMessage.type === "error" ? (
            <AlertCircle className="h-4 w-4 shrink-0" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Action & Status Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Master Toggle */}
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3.5 py-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Footer Status:
              </span>
              <button
                type="button"
                onClick={handleToggleEnable}
                disabled={isToggling}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  draft.isEnabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                }`}
                title={draft.isEnabled ? "Click to disable footer" : "Click to enable footer"}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    draft.isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <span
                className={`text-xs font-bold ${
                  draft.isEnabled
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {draft.isEnabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  draft.status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    draft.status === "PUBLISHED" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                  }`}
                />
                {draft.status === "PUBLISHED" ? "Published Live" : "Draft (Unpublished)"}
              </span>

              {hasUnsavedChanges && (
                <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 text-[11px] font-medium text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="h-3 w-3" />
                  Unsaved changes
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Discard
              </button>
            )}

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving Draft..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition disabled:opacity-50"
            >
              <Check className="h-3.5 w-3.5" />
              {isPublishing ? "Publishing..." : "Publish Changes"}
            </button>

            <button
              type="button"
              onClick={handleResetToDefaults}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-900/40 transition disabled:opacity-50"
              title="Reset all footer settings to default factory settings"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Main CMS Editor Layout: Left Editor Tabs + Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Settings Tabs & Form Controls */}
        <div className="lg:col-span-6 space-y-4">
          {/* Tab Navigation Pill Bar */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xs">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span
                        className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700/80"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs space-y-5">
            {/* TAB: GENERAL */}
            {activeTab === "general" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    General Footer Configuration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Control container bounds, vertical spacing, dividers, and background style
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Container Width
                    </label>
                    <select
                      value={draft.containerWidth}
                      onChange={(e) =>
                        updateDraft({
                          containerWidth: e.target.value as "compact" | "standard" | "wide",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                      <option value="compact">Compact (max-w-5xl)</option>
                      <option value="standard">Standard (max-w-7xl)</option>
                      <option value="wide">Wide (max-w-[1400px])</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Vertical Spacing (Padding)
                    </label>
                    <select
                      value={draft.spacing}
                      onChange={(e) =>
                        updateDraft({
                          spacing: e.target.value as "compact" | "comfortable" | "spacious",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                      <option value="compact">Compact (py-10)</option>
                      <option value="comfortable">Comfortable (py-16)</option>
                      <option value="spacious">Spacious (py-24)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Column Grid Layout
                    </label>
                    <select
                      value={draft.columnLayout}
                      onChange={(e) =>
                        updateDraft({
                          columnLayout: e.target.value as "auto" | "3" | "4" | "5",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                      <option value="auto">Automatic (Responsive)</option>
                      <option value="3">3 Columns</option>
                      <option value="4">4 Columns</option>
                      <option value="5">5 Columns (Brand + 3 Columns + Service Areas)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Background Ambient Style
                    </label>
                    <select
                      value={draft.backgroundStyle}
                      onChange={(e) =>
                        updateDraft({
                          backgroundStyle: e.target.value as "plain" | "subtle_gradient" | "premium_glow",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-primary"
                    >
                      <option value="plain">Solid Clean Background</option>
                      <option value="subtle_gradient">Subtle Gradient</option>
                      <option value="premium_glow">Automotive Radial Glow</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Top Ambient Accent Line
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Displays a sleek subtle glowing divider along the top border
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={draft.topDivider}
                      onChange={(e) => updateDraft({ topDivider: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Bottom Bar Separator
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Separates copyright and legal disclaimers from the columns
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={draft.bottomDivider}
                      onChange={(e) => updateDraft({ bottomDivider: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: BRAND */}
            {activeTab === "brand" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Brand &amp; Identity Column
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure the prominent logo, school name, and accreditation message
                    </p>
                  </div>
                </div>

                {/* Inherit from Business Settings */}
                <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/60 dark:bg-indigo-950/30 p-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                        Inherit from Business Settings
                      </span>
                      <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
                        Automatically keep brand name and tagline in sync with central school settings
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.useBusinessBrand}
                    onChange={(e) => updateDraft({ useBusinessBrand: e.target.checked })}
                    className="h-4 w-4 rounded-sm border-indigo-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={draft.brandName}
                      disabled={draft.useBusinessBrand}
                      onChange={(e) => updateDraft({ brandName: e.target.value })}
                      placeholder="NextDrive"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Tagline / Subheading
                    </label>
                    <input
                      type="text"
                      value={draft.tagline}
                      disabled={draft.useBusinessBrand}
                      onChange={(e) => updateDraft({ tagline: e.target.value })}
                      placeholder="Driving Academy Manchester"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Footer Description Paragraph
                  </label>
                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) => updateDraft({ description: e.target.value })}
                    placeholder="DVSA-approved professional driving tuition across Greater Manchester..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Custom Logo Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={draft.logoUrl || ""}
                      onChange={(e) => updateDraft({ logoUrl: e.target.value })}
                      placeholder="https://... or leave blank for default automotive badge"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="showLogo"
                      checked={draft.showLogo}
                      onChange={(e) => updateDraft({ showLogo: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary"
                    />
                    <label
                      htmlFor="showLogo"
                      className="text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                    >
                      Display School Logo Icon / Badge
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: COLUMNS & LINKS */}
            {activeTab === "columns" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Footer Navigation Columns ({draft.columns.length})
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Add, reorder, and configure custom navigation columns and links
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColumn}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Column
                  </button>
                </div>

                {/* Columns List */}
                <div className="space-y-4">
                  {draft.columns.map((column, colIdx) => (
                    <div
                      key={column.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-3"
                    >
                      {/* Column Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-700/60 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {colIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={column.title}
                            onChange={(e) => handleUpdateColumn(column.id, { title: e.target.value })}
                            className="font-bold text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-slate-900 dark:text-white"
                            placeholder="Column Title"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveColumn(colIdx, "up")}
                            disabled={colIdx === 0}
                            title="Move column left/up"
                            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveColumn(colIdx, "down")}
                            disabled={colIdx === draft.columns.length - 1}
                            title="Move column right/down"
                            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateColumn(column.id, { isEnabled: !column.isEnabled })
                            }
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              column.isEnabled
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            }`}
                          >
                            {column.isEnabled ? "Visible" : "Hidden"}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteColumn(column.id)}
                            title="Delete Column"
                            className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Column Source Selector */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600 dark:text-slate-400">
                          Column Data Source:
                        </span>
                        <select
                          value={column.source || "custom"}
                          onChange={(e) =>
                            handleUpdateColumn(column.id, {
                              source: e.target.value as "custom" | "locations_sync",
                            })
                          }
                          className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-800 dark:text-slate-200"
                        >
                          <option value="custom">Custom Links List</option>
                          <option value="locations_sync">
                            Dynamic Sync with Active Test Centers
                          </option>
                        </select>
                      </div>

                      {column.source === "locations_sync" ? (
                        <div className="rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 p-2.5 text-[11px] text-indigo-700 dark:text-indigo-300">
                          ℹ️ This column automatically displays the top active test centres configured in your Locations database (currently {availableLocations.length} locations active).
                        </div>
                      ) : (
                        /* Links inside column */
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                              Links ({column.links.length})
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAddLink(column.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                            >
                              <Plus className="h-3 w-3" />
                              Add Link
                            </button>
                          </div>

                          <div className="space-y-2">
                            {column.links.map((link, linkIdx) => (
                              <div
                                key={link.id}
                                className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs"
                              >
                                <input
                                  type="text"
                                  value={link.label}
                                  onChange={(e) =>
                                    handleUpdateLink(column.id, link.id, { label: e.target.value })
                                  }
                                  placeholder="Link text"
                                  className="flex-1 min-w-[120px] rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs bg-slate-50/50 dark:bg-slate-900"
                                />

                                <input
                                  type="text"
                                  value={link.url}
                                  onChange={(e) =>
                                    handleUpdateLink(column.id, link.id, { url: e.target.value })
                                  }
                                  placeholder="/#courses or https://..."
                                  className="flex-1 min-w-[130px] rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs font-mono text-[11px] bg-slate-50/50 dark:bg-slate-900"
                                />

                                <label
                                  className="flex items-center gap-1 text-[10px] text-slate-500 cursor-pointer"
                                  title="Open in new window"
                                >
                                  <input
                                    type="checkbox"
                                    checked={link.openInNewTab}
                                    onChange={(e) =>
                                      handleUpdateLink(column.id, link.id, {
                                        openInNewTab: e.target.checked,
                                      })
                                    }
                                    className="h-3 w-3 rounded-xs border-slate-300 text-primary"
                                  />
                                  <span>New Tab</span>
                                </label>

                                <div className="flex items-center gap-1 ml-auto">
                                  <button
                                    type="button"
                                    onClick={() => handleMoveLink(column.id, linkIdx, "up")}
                                    disabled={linkIdx === 0}
                                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20"
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleMoveLink(column.id, linkIdx, "down")}
                                    disabled={linkIdx === column.links.length - 1}
                                    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLink(column.id, link.id)}
                                    className="p-1 text-rose-400 hover:text-rose-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: SERVICE AREAS */}
            {activeTab === "locations" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Service Areas &amp; Test Centers Integration
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Feature your primary Manchester test centres directly in the footer for local SEO
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Display Dedicated Service Areas Column
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Includes Cheetham Hill, West Didsbury, Sale, Bury, etc.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.showServiceAreas}
                    onChange={(e) => updateDraft({ showServiceAreas: e.target.checked })}
                    className="h-4 w-4 rounded-sm border-slate-300 text-primary focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Column Heading Title
                    </label>
                    <input
                      type="text"
                      value={draft.serviceAreaColumnTitle || ""}
                      onChange={(e) => updateDraft({ serviceAreaColumnTitle: e.target.value })}
                      placeholder="Coverage & Centers"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Data Source Mode
                    </label>
                    <select
                      value={draft.serviceAreaSource}
                      onChange={(e) =>
                        updateDraft({
                          serviceAreaSource: e.target.value as "automatic" | "custom",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="automatic">Automatic from Database ({availableLocations.length} locations)</option>
                      <option value="custom">Manual links in Column Builder</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Live Database Locations Preview:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {availableLocations.map((loc) => (
                      <span
                        key={loc.id}
                        className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] text-slate-700 dark:text-slate-300"
                      >
                        <MapPin className="h-3 w-3 text-primary" />
                        {loc.testCenterName}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTACT */}
            {activeTab === "contact" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Contact &amp; Accreditation Details
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Head office details, phone hotline, email, opening hours, and DVSA registration
                  </p>
                </div>

                <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/60 dark:bg-indigo-950/30 p-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                        Use Central Business Settings
                      </span>
                      <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-0.5">
                        Keep phone, email, and address in sync with Admin → Settings
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={draft.useBusinessContact}
                    onChange={(e) => updateDraft({ useBusinessContact: e.target.checked })}
                    className="h-4 w-4 rounded-sm border-indigo-300 text-indigo-600 focus:ring-indigo-500 mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Hotline Phone Number
                    </label>
                    <input
                      type="text"
                      value={draft.phone || ""}
                      disabled={draft.useBusinessContact}
                      onChange={(e) => updateDraft({ phone: e.target.value })}
                      placeholder="+44 161 946 0921"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={draft.email || ""}
                      disabled={draft.useBusinessContact}
                      onChange={(e) => updateDraft({ email: e.target.value })}
                      placeholder="support@nextdrive.uk"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-50"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Head Office Address
                    </label>
                    <input
                      type="text"
                      value={draft.address || ""}
                      disabled={draft.useBusinessContact}
                      onChange={(e) => updateDraft({ address: e.target.value })}
                      placeholder="Peter House, Oxford Street, Manchester, M1 5AN"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      DVSA School Certification ID
                    </label>
                    <input
                      type="text"
                      value={draft.dvsaSchoolId || ""}
                      onChange={(e) => updateDraft({ dvsaSchoolId: e.target.value })}
                      placeholder="DVSA-SCH-90412"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      WhatsApp Quick Booking Number
                    </label>
                    <input
                      type="text"
                      value={draft.whatsappNumber || ""}
                      onChange={(e) => updateDraft({ whatsappNumber: e.target.value })}
                      placeholder="+44 7700 900123"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: SOCIAL */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Social Media Channels
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enable channels and enter official social URLs
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.showSocial}
                      onChange={(e) => updateDraft({ showSocial: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                    />
                    <span>Show Socials</span>
                  </label>
                </div>

                <div className="space-y-3">
                  {draft.socialLinks.map((social) => (
                    <div
                      key={social.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-3 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={social.isEnabled}
                        onChange={(e) =>
                          handleUpdateSocialLink(social.id, { isEnabled: e.target.checked })
                        }
                        className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                      />
                      <span className="w-24 font-bold capitalize text-slate-700 dark:text-slate-300">
                        {social.platform}
                      </span>
                      <input
                        type="text"
                        value={social.url}
                        onChange={(e) =>
                          handleUpdateSocialLink(social.id, { url: e.target.value })
                        }
                        placeholder={`https://${social.platform}.com/...`}
                        className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-mono text-[11px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CTA BANNER */}
            {activeTab === "cta" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      High-Conversion Footer CTA Banner
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Display an attention-grabbing action strip right above the footer columns
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.showCTA}
                      onChange={(e) => updateDraft({ showCTA: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                    />
                    <span>Enable CTA Banner</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Eyebrow / Small Header
                    </label>
                    <input
                      type="text"
                      value={draft.ctaEyebrow || ""}
                      onChange={(e) => updateDraft({ ctaEyebrow: e.target.value })}
                      placeholder="START LEARNING TODAY"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Main Heading
                    </label>
                    <input
                      type="text"
                      value={draft.ctaHeading || ""}
                      onChange={(e) => updateDraft({ ctaHeading: e.target.value })}
                      placeholder="Ready to Pass Your Driving Test First Time?"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Description Subtext
                    </label>
                    <input
                      type="text"
                      value={draft.ctaDescription || ""}
                      onChange={(e) => updateDraft({ ctaDescription: e.target.value })}
                      placeholder="Join thousands of Manchester learners with our Grade A DVSA certified instructors."
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Primary Button Text
                    </label>
                    <input
                      type="text"
                      value={draft.ctaPrimaryText || ""}
                      onChange={(e) => updateDraft({ ctaPrimaryText: e.target.value })}
                      placeholder="Book Your First Lesson"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Primary Button Action
                    </label>
                    <select
                      value={draft.ctaPrimaryAction || "booking_modal"}
                      onChange={(e) =>
                        updateDraft({
                          ctaPrimaryAction: e.target.value as "booking_modal" | "courses_link" | "custom_url",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="booking_modal">Open Interactive Booking Modal</option>
                      <option value="courses_link">Scroll to Courses (#courses)</option>
                      <option value="custom_url">Custom Link</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Secondary Button Text
                    </label>
                    <input
                      type="text"
                      value={draft.ctaSecondaryText || ""}
                      onChange={(e) => updateDraft({ ctaSecondaryText: e.target.value })}
                      placeholder="Speak with an Advisor"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Secondary Button Action
                    </label>
                    <select
                      value={draft.ctaSecondaryAction || "call_phone"}
                      onChange={(e) =>
                        updateDraft({
                          ctaSecondaryAction: e.target.value as "call_phone" | "contact_page" | "custom_url",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="call_phone">Call Phone Hotline</option>
                      <option value="contact_page">Go to Contact Page (/contact)</option>
                      <option value="custom_url">Custom Link</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LEGAL & BOTTOM BAR */}
            {activeTab === "legal" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Legal Links &amp; Copyright
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Manage compliance policies, terms, cookies, and dynamic copyright token
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLegalLink}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Policy
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Copyright Notice Template
                  </label>
                  <input
                    type="text"
                    value={draft.copyrightText}
                    onChange={(e) => updateDraft({ copyrightText: e.target.value })}
                    placeholder="&copy; {year} NextDrive UK Ltd. Registered in England & Wales #12948210. All rights reserved."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-mono text-[11px]"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Tip: Use <code className="text-primary font-bold">{"{year}"}</code> anywhere in the string to automatically insert the current calendar year ({new Date().getFullYear()}).
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Compliance &amp; Legal Policies ({draft.legalLinks.length})
                  </span>
                  <div className="space-y-2">
                    {draft.legalLinks.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-2.5 text-xs"
                      >
                        <input
                          type="checkbox"
                          checked={item.isEnabled}
                          onChange={(e) =>
                            handleUpdateLegalLink(item.id, { isEnabled: e.target.checked })
                          }
                          className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                        />
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            handleUpdateLegalLink(item.id, { label: e.target.value })
                          }
                          placeholder="Policy name"
                          className="w-40 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs"
                        />
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) =>
                            handleUpdateLegalLink(item.id, { url: e.target.value })
                          }
                          placeholder="/privacy"
                          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-1 text-xs font-mono text-[11px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteLegalLink(item.id)}
                          className="p-1 text-rose-400 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DEVELOPER CREDIT */}
            {activeTab === "credit" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Developer Credit &amp; Attribution Tag
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Configure the &quot;Designed &amp; Developed by Crftdev Technology&quot; brand credit
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draft.showDeveloperCredit}
                      onChange={(e) =>
                        updateDraft({ showDeveloperCredit: e.target.checked })
                      }
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                    />
                    <span>Show Credit</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Prefix Attribution Text
                    </label>
                    <input
                      type="text"
                      value={draft.developerPrefix}
                      onChange={(e) => updateDraft({ developerPrefix: e.target.value })}
                      placeholder="Designed & Developed by"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Developer / Agency Name
                    </label>
                    <input
                      type="text"
                      value={draft.developerName}
                      onChange={(e) => updateDraft({ developerName: e.target.value })}
                      placeholder="Crftdev Technology"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Developer Website URL
                    </label>
                    <input
                      type="text"
                      value={draft.developerUrl || ""}
                      onChange={(e) => updateDraft({ developerUrl: e.target.value })}
                      placeholder="https://crftdev.com"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Display Style
                    </label>
                    <select
                      value={draft.developerStyle}
                      onChange={(e) =>
                        updateDraft({
                          developerStyle: e.target.value as "minimal" | "badge" | "text",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="minimal">Minimal Inline with Arrow</option>
                      <option value="badge">Subtle Tech Badge</option>
                      <option value="text">Plain Text</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.developerNewTab}
                        onChange={(e) => updateDraft({ developerNewTab: e.target.checked })}
                        className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                      />
                      <span>Open link in new tab (target=&quot;_blank&quot;)</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={draft.developerShowIcon}
                        onChange={(e) => updateDraft({ developerShowIcon: e.target.checked })}
                        className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                      />
                      <span>Show external link icon</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: DESIGN */}
            {activeTab === "design" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Design &amp; Visual Style
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Aesthetics, contrast theme, icons, and micro-interactions
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Visual Aesthetic Preset
                    </label>
                    <select
                      value={draft.style}
                      onChange={(e) =>
                        updateDraft({
                          style: e.target.value as "modern" | "minimal" | "premium",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="premium">Premium Automotive (Accents &amp; Glows)</option>
                      <option value="modern">Modern SaaS (Clean &amp; Structured)</option>
                      <option value="minimal">Minimal Clean (Ultra Simple)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Footer Color Scheme Mode
                    </label>
                    <select
                      value={draft.theme}
                      onChange={(e) =>
                        updateDraft({
                          theme: e.target.value as "auto" | "light" | "dark",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="auto">Adaptive (Follows Website Theme)</option>
                      <option value="dark">Always Dark (Automotive Slate)</option>
                      <option value="light">Always Light (Clean White)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Show Link Hover Indicators</span>
                    <input
                      type="checkbox"
                      checked={draft.showLinkArrows}
                      onChange={(e) => updateDraft({ showLinkArrows: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Show Contact Section Icons</span>
                    <input
                      type="checkbox"
                      checked={draft.showContactIcons}
                      onChange={(e) => updateDraft({ showContactIcons: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <span>Show Social Channel Icons</span>
                    <input
                      type="checkbox"
                      checked={draft.showSocialIcons}
                      onChange={(e) => updateDraft({ showSocialIcons: e.target.checked })}
                      className="h-4 w-4 rounded-sm border-slate-300 text-primary"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Real-Time Live Preview */}
        <div className="lg:col-span-6 space-y-3 sticky top-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Live Footer Preview
                </span>
                <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                  Realtime
                </span>
              </div>

              {/* Viewport switchers */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  title="Desktop View"
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewDevice === "desktop"
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("tablet")}
                  title="Tablet View"
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewDevice === "tablet"
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Tablet className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  title="Mobile View"
                  className={`p-1.5 rounded-lg text-xs transition ${
                    previewDevice === "mobile"
                      ? "bg-primary text-primary-foreground"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* Theme Switcher */}
                <button
                  type="button"
                  onClick={() => setPreviewTheme(previewTheme === "dark" ? "light" : "dark")}
                  title="Toggle Preview Light/Dark Theme"
                  className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                >
                  {previewTheme === "dark" ? (
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <Moon className="h-3.5 w-3.5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Preview Frame Container */}
            <div className="flex justify-center bg-slate-100/70 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 overflow-x-auto min-h-[480px]">
              <div
                style={{
                  width:
                    previewDevice === "mobile"
                      ? "375px"
                      : previewDevice === "tablet"
                      ? "640px"
                      : "100%",
                  transition: "width 0.3s ease",
                }}
                className={`rounded-xl border shadow-lg overflow-hidden select-none text-xs transition-colors duration-200 ${
                  previewTheme === "dark"
                    ? "bg-[#090d16] text-slate-300 border-slate-800"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                {!draft.isEnabled ? (
                  <div className="p-12 text-center text-slate-400 space-y-2">
                    <AlertCircle className="h-8 w-8 mx-auto text-amber-500 opacity-60" />
                    <p className="font-bold text-sm">Footer is Disabled</p>
                    <p className="text-xs">
                      The footer is currently turned off and will not render on the public website.
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* Top ambient line */}
                    {draft.topDivider && (
                      <div className="h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                    )}

                    {/* Radial glow background effect */}
                    {draft.backgroundStyle === "premium_glow" && (
                      <div className="h-[60px] w-full bg-primary/10 blur-[40px] pointer-events-none -mb-[60px]" />
                    )}

                    {/* Optional CTA Strip */}
                    {draft.showCTA && (
                      <div
                        className={`p-5 border-b transition-colors ${
                          previewTheme === "dark"
                            ? "border-slate-800/80 bg-slate-900/60"
                            : "border-slate-100 bg-slate-50/80"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            {draft.ctaEyebrow && (
                              <span className="text-[10px] font-bold tracking-wider uppercase text-primary">
                                {draft.ctaEyebrow}
                              </span>
                            )}
                            <h4
                              className={`text-sm font-bold ${
                                previewTheme === "dark" ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {draft.ctaHeading || "Ready to Start Driving?"}
                            </h4>
                            {draft.ctaDescription && (
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {draft.ctaDescription}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {draft.ctaPrimaryText && (
                              <span className="rounded-lg bg-primary px-3 py-1.5 text-[11px] font-bold text-white shadow-xs">
                                {draft.ctaPrimaryText}
                              </span>
                            )}
                            {draft.ctaSecondaryText && (
                              <span
                                className={`rounded-lg border px-3 py-1.5 text-[11px] font-semibold ${
                                  previewTheme === "dark"
                                    ? "border-slate-700 text-slate-300"
                                    : "border-slate-200 text-slate-700"
                                }`}
                              >
                                {draft.ctaSecondaryText}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Columns Grid */}
                    <div className="p-5 space-y-6">
                      <div
                        className={`grid gap-6 ${
                          previewDevice === "mobile"
                            ? "grid-cols-1"
                            : previewDevice === "tablet"
                            ? "grid-cols-2"
                            : "grid-cols-4"
                        }`}
                      >
                        {/* Brand Column */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2.5">
                            {draft.showLogo && (
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-xs shrink-0">
                                <Car className="h-4 w-4" />
                              </div>
                            )}
                            <div>
                              <span
                                className={`text-sm font-bold tracking-tight ${
                                  previewTheme === "dark" ? "text-white" : "text-slate-900"
                                }`}
                              >
                                {resolvedBrandName.includes("NextDrive") ? (
                                  <>
                                    Next<span className="text-primary">Drive</span>
                                  </>
                                ) : (
                                  resolvedBrandName
                                )}
                              </span>
                              <span className="block text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                {resolvedTagline}
                              </span>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                            {resolvedDescription}
                          </p>

                          {/* Contact Info */}
                          {draft.showContact && (
                            <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                              {resolvedPhone && (
                                <div className="flex items-center gap-1.5">
                                  <Phone className="h-3 w-3 text-primary shrink-0" />
                                  <span>{resolvedPhone}</span>
                                </div>
                              )}
                              {resolvedEmail && (
                                <div className="flex items-center gap-1.5">
                                  <Mail className="h-3 w-3 text-primary shrink-0" />
                                  <span>{resolvedEmail}</span>
                                </div>
                              )}
                              {resolvedAddress && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 text-primary shrink-0" />
                                  <span className="truncate">{resolvedAddress}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Social links */}
                          {draft.showSocial && (
                            <div className="flex items-center gap-2 pt-1 text-slate-400">
                              {draft.socialLinks
                                .filter((s) => s.isEnabled)
                                .map((s) => (
                                  <span
                                    key={s.id}
                                    className="p-1 rounded-md hover:text-primary transition"
                                    title={s.platform}
                                  >
                                    <Globe className="h-3.5 w-3.5" />
                                  </span>
                                ))}
                            </div>
                          )}

                          {/* DVSA School accreditation badge */}
                          <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-500">
                            <ShieldCheck className="h-3 w-3 shrink-0" />
                            <span>DVSA Certified: {resolvedDvsa}</span>
                          </div>
                        </div>

                        {/* Configured Columns */}
                        {draft.columns
                          .filter((c) => c.isEnabled)
                          .map((col) => {
                            const isMobile = previewDevice === "mobile";
                            const isOpen = previewAccordionOpen[col.id] ?? false;

                            return (
                              <div key={col.id} className="space-y-2.5">
                                <div
                                  className={`flex items-center justify-between ${
                                    isMobile ? "cursor-pointer py-1 border-b border-slate-800/40" : ""
                                  }`}
                                  onClick={() => {
                                    if (isMobile) {
                                      setPreviewAccordionOpen((prev) => ({
                                        ...prev,
                                        [col.id]: !isOpen,
                                      }));
                                    }
                                  }}
                                >
                                  <h5
                                    className={`text-[11px] font-bold uppercase tracking-wider ${
                                      previewTheme === "dark" ? "text-slate-200" : "text-slate-800"
                                    }`}
                                  >
                                    {col.title}
                                  </h5>
                                  {isMobile && (
                                    <ChevronDown
                                      className={`h-3 w-3 text-slate-400 transition-transform ${
                                        isOpen ? "rotate-180" : ""
                                      }`}
                                    />
                                  )}
                                </div>

                                {(!isMobile || isOpen) && (
                                  <ul className="space-y-2 text-[11px] text-slate-400">
                                    {col.source === "locations_sync" ? (
                                      availableLocations.slice(0, 4).map((loc) => (
                                        <li
                                          key={loc.id}
                                          className="hover:text-primary transition truncate"
                                        >
                                          {loc.testCenterName}
                                        </li>
                                      ))
                                    ) : (
                                      col.links
                                        .filter((l) => l.isEnabled)
                                        .map((link) => (
                                          <li
                                            key={link.id}
                                            className="hover:text-primary transition flex items-center justify-between gap-1"
                                          >
                                            <span className="truncate">{link.label}</span>
                                            {link.openInNewTab && (
                                              <ExternalLink className="h-2.5 w-2.5 opacity-50 shrink-0" />
                                            )}
                                          </li>
                                        ))
                                    )}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                      </div>

                      {/* Bottom Copyright & Legal Sub-Bar */}
                      <div
                        className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 ${
                          previewTheme === "dark" ? "border-slate-800" : "border-slate-200"
                        }`}
                      >
                        <p className="text-center sm:text-left">
                          {draft.copyrightText.replace(
                            "{year}",
                            new Date().getFullYear().toString()
                          )}
                        </p>

                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                            <Award className="h-3 w-3 text-primary" />
                            89.4% Pass Rate
                          </span>
                        </div>
                      </div>

                      {/* Developer Credit & Legal Disclaimers */}
                      <div
                        className={`pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 ${
                          previewTheme === "dark" ? "border-slate-800/60" : "border-slate-100"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {draft.legalLinks
                            .filter((l) => l.isEnabled)
                            .map((l, idx) => (
                              <React.Fragment key={l.id}>
                                <span className="hover:text-primary transition">{l.label}</span>
                                {idx < draft.legalLinks.length - 1 && (
                                  <span className="opacity-30">•</span>
                                )}
                              </React.Fragment>
                            ))}
                        </div>

                        {draft.showDeveloperCredit && (
                          <div className="flex items-center gap-1">
                            <span>{draft.developerPrefix}</span>
                            <span className="font-semibold text-slate-300 dark:text-slate-100 underline underline-offset-2">
                              {draft.developerName}
                            </span>
                            {draft.developerShowIcon && (
                              <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
