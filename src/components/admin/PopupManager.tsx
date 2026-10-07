"use client";

import React, { useState, useEffect } from "react";
import {
  PopupCampaign,
  PopupFieldConfig,
  PopupAnalyticsSummary,
  PopupTriggerType,
  PopupFrequency,
  PopupAfterDismissal,
  PopupAfterSubmission,
  PopupPosition,
  PopupSize,
  PopupTheme,
  PopupAnimation,
} from "@/types";
import {
  Check,
  X,
  Eye,
  Save,
  RotateCcw,
  Copy,
  Sliders,
  Sparkles,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  MousePointer,
  MoveDown,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Layers,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Palette,
  Layout,
  Settings2,
  TrendingUp,
  Percent,
  Megaphone,
  RefreshCw,
  Sun,
  Moon,
  Info,
  Car,
} from "lucide-react";

interface PopupManagerProps {
  initialCampaign: PopupCampaign;
  initialPublished: PopupCampaign;
  initialAnalytics: PopupAnalyticsSummary;
}

type TabType =
  | "overview"
  | "content"
  | "fields"
  | "triggers"
  | "frequency"
  | "targeting"
  | "design"
  | "analytics";

export function PopupManager({
  initialCampaign,
  initialPublished,
  initialAnalytics,
}: PopupManagerProps) {
  // State management
  const [campaign, setCampaign] = useState<PopupCampaign>(initialCampaign);
  const [published, setPublished] = useState<PopupCampaign>(initialPublished);
  const [analytics, setAnalytics] = useState<PopupAnalyticsSummary>(initialAnalytics);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Operation states
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Preview Modal state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [previewTheme, setPreviewTheme] = useState<"light" | "dark">("light");
  const [previewSubmitted, setPreviewSubmitted] = useState(false);

  // Track whether draft differs from published
  const hasUnpublishedChanges =
    JSON.stringify(campaign) !== JSON.stringify(published);

  // Show temporary toast
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Master Toggle (ON / OFF)
  const handleMasterToggle = async () => {
    setIsToggling(true);
    const newStatus = !campaign.isEnabled;
    try {
      const res = await fetch("/api/admin/popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", isEnabled: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaign(data.campaign);
        setPublished(data.campaign);
        showToast(
          `Website popup ${newStatus ? "ENABLED" : "DISABLED"} and published.`,
          "success"
        );
      } else {
        showToast(data.error || "Failed to toggle popup", "error");
      }
    } catch (err) {
      showToast("Network error toggling popup", "error");
    } finally {
      setIsToggling(false);
    }
  };

  // Save Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/popup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaign(data.campaign);
        showToast("Draft saved successfully.", "success");
      } else {
        showToast(data.error || "Failed to save draft", "error");
      }
    } catch (err) {
      showToast("Network error saving draft", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Publish Changes
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // First save working draft
      await fetch("/api/admin/popup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaign),
      });

      // Then trigger publish
      const res = await fetch("/api/admin/popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish" }),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaign(data.campaign);
        setPublished(data.campaign);
        showToast("Popup changes published LIVE to public website!", "success");
      } else {
        showToast(data.error || "Failed to publish popup", "error");
      }
    } catch (err) {
      showToast("Network error publishing changes", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  // Reset to Defaults
  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all popup configuration back to factory defaults? Unsaved changes will be lost."
      )
    ) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch("/api/admin/popup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaign(data.campaign);
        showToast("Popup settings reset to defaults.", "info");
      } else {
        showToast(data.error || "Failed to reset popup", "error");
      }
    } catch (err) {
      showToast("Network error resetting popup", "error");
    } finally {
      setIsResetting(false);
    }
  };

  // Duplicate settings / create snapshot
  const handleDuplicate = () => {
    setCampaign((prev) => ({
      ...prev,
      name: `${prev.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    }));
    showToast("Duplicate created in draft. Click 'Save Draft' to persist.", "info");
  };

  // Refresh Analytics
  const handleRefreshAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/popup/analytics");
      const data = await res.json();
      if (data.success && data.analytics) {
        setAnalytics(data.analytics);
        showToast("Analytics metrics refreshed.", "info");
      }
    } catch (err) {
      showToast("Failed to refresh analytics", "error");
    }
  };

  // Field Reordering
  const moveField = (index: number, direction: "up" | "down") => {
    const newFields = [...campaign.fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;

    const [moved] = newFields.splice(index, 1);
    newFields.splice(targetIndex, 0, moved);

    // Reassign displayOrder
    const reordered = newFields.map((f, i) => ({ ...f, displayOrder: i + 1 }));
    setCampaign((prev) => ({ ...prev, fields: reordered }));
  };

  // Update specific field properties
  const updateField = (index: number, updates: Partial<PopupFieldConfig>) => {
    setCampaign((prev) => {
      const newFields = [...prev.fields];
      newFields[index] = { ...newFields[index], ...updates };
      return { ...prev, fields: newFields };
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-xl transition-all duration-300 ${
            toastMessage.type === "success"
              ? "bg-emerald-600 text-white shadow-emerald-600/20"
              : toastMessage.type === "error"
              ? "bg-rose-600 text-white shadow-rose-600/20"
              : "bg-indigo-600 text-white shadow-indigo-600/20"
          }`}
        >
          {toastMessage.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : toastMessage.type === "error" ? (
            <AlertCircle className="h-5 w-5 shrink-0" />
          ) : (
            <Info className="h-5 w-5 shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 rounded-md p-1 hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* TOP CONTROL CENTER CARD */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Status & Name */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Website Popup
              </span>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status:
                </span>
                <button
                  type="button"
                  onClick={handleMasterToggle}
                  disabled={isToggling}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition shadow-xs ${
                    campaign.isEnabled
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 hover:bg-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      campaign.isEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                    }`}
                  />
                  {campaign.isEnabled ? "ON (Active)" : "OFF (Disabled)"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">
                &ldquo;{campaign.name}&rdquo;
              </span>
              {hasUnpublishedChanges ? (
                <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  ● Draft Changes
                </span>
              ) : (
                <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  ✓ Published
                </span>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <Sliders className="h-3.5 w-3.5 text-slate-400" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => {
                setPreviewSubmitted(false);
                setIsPreviewOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/40 px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 shadow-xs hover:bg-indigo-100/70 dark:hover:bg-indigo-950/70 transition"
            >
              <Eye className="h-3.5 w-3.5 text-indigo-500" />
              Preview Popup
            </button>

            <button
              type="button"
              onClick={handleDuplicate}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              title="Duplicate popup configuration"
            >
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              Duplicate
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition disabled:opacity-60"
            >
              <Save className="h-3.5 w-3.5 text-slate-500" />
              {isSaving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 transition active:scale-[0.98] disabled:opacity-60"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isPublishing ? "Publishing..." : "Publish Changes"}
            </button>
          </div>
        </div>

        {/* Quick Summary Strip */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800/80 pt-4 sm:grid-cols-4 lg:grid-cols-5 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-500 block">Trigger:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {campaign.triggerType === "time"
                ? `Time Delay (${campaign.delaySeconds}s)`
                : campaign.triggerType === "exit_intent"
                ? "Exit Intent (Desktop)"
                : campaign.triggerType === "scroll"
                ? `Scroll (${campaign.scrollPercentage}%)`
                : campaign.triggerType === "button"
                ? "Button Click"
                : campaign.triggerType === "time_scroll"
                ? `Time (${campaign.delaySeconds}s) + Scroll`
                : "Manual Only"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-500 block">Frequency:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {campaign.frequency === "once_per_session"
                ? "Once Per Session"
                : campaign.frequency === "every_visit"
                ? "Every Visit"
                : campaign.frequency === "once_per_day"
                ? "Once Daily"
                : campaign.frequency === "once_7_days"
                ? "Once / 7 Days"
                : "Custom Frequency"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-500 block">Active Fields:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {campaign.fields.filter((f) => f.isEnabled).length} of {campaign.fields.length}{" "}
              ({campaign.fields.filter((f) => f.isEnabled && f.isRequired).length} required)
            </span>
          </div>

          <div>
            <span className="text-slate-400 dark:text-slate-500 block">Target Devices:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {[
                campaign.showDesktop && "Desktop",
                campaign.showTablet && "Tablet",
                campaign.showMobile && "Mobile",
              ]
                .filter(Boolean)
                .join(", ") || "None"}
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-400 dark:text-slate-500 block">Conversion Rate:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {analytics.conversionRate} ({analytics.submitted} leads)
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: "overview", label: "Overview & Stats", icon: BarChart3 },
          { id: "content", label: "Content & Copy", icon: Layers },
          { id: "fields", label: "Form Field Builder", icon: ArrowUpDown },
          { id: "triggers", label: "Trigger & Timing", icon: Clock },
          { id: "frequency", label: "Frequency & Actions", icon: RefreshCw },
          { id: "targeting", label: "Page & Devices", icon: Monitor },
          { id: "design", label: "Design & Animation", icon: Palette },
          { id: "analytics", label: "Live Telemetry", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`inline-flex items-center gap-2 rounded-t-lg px-3.5 py-2.5 transition whitespace-nowrap ${
                isActive
                  ? "bg-white dark:bg-slate-900 border-x border-t border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs -mb-px"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Page Impressions
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.impressions}
              </p>
              <span className="text-[10px] text-slate-400">Total qualified loads</span>
            </div>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Popups Displayed
              </span>
              <p className="mt-1 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {analytics.opened}
              </p>
              <span className="text-[10px] text-slate-400">Triggered &amp; shown</span>
            </div>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Form Engagements
              </span>
              <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {analytics.formStarted}
              </p>
              <span className="text-[10px] text-slate-400">Visitor clicked input</span>
            </div>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Dismissals
              </span>
              <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
                {analytics.dismissed}
              </p>
              <span className="text-[10px] text-slate-400">Closed without lead</span>
            </div>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Leads Captured
              </span>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {analytics.submitted}
              </p>
              <span className="text-[10px] text-slate-400">Direct into Leads CRM</span>
            </div>

            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Conversion Rate
              </span>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {analytics.conversionRate}
              </p>
              <span className="text-[10px] text-slate-400">Opens to submissions</span>
            </div>
          </div>

          {/* Quick Launch Checklist & Device Distribution */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* System Health & Verification Checklist */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-indigo-500" />
                  System Readiness &amp; Safety Audit
                </h3>
                <span className="text-xs text-slate-400 font-medium">Real-time status</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 mt-0.5 ${
                      campaign.isEnabled ? "text-emerald-500" : "text-slate-400"
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Master Switch: {campaign.isEnabled ? "Active & Serving" : "Disabled (Off)"}
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      {campaign.isEnabled
                        ? "The popup is primed to fire according to configured frequency and trigger parameters."
                        : "Popup is completely turned off site-wide. No visitors will see the popup."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Target &amp; Admin Exclusion Zones
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Protected routes (`/admin`, `/instructor`, `/student`, `/login`, `/signup`) are
                      hardcoded as excluded to prevent disruption to logged-in users.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Lead Pipeline &amp; CRM Integration
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Submissions automatically populate the Admin Leads CRM, dispatch instant email
                      telemetry, and record audit log traces.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Session Safety &amp; Focus Trapping
                    </span>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Popup respects existing open booking modals, traps focus when opened, and closes
                      gracefully on Escape key press.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isResetting}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset to Factory Defaults
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Preview Live Simulation &rarr;
                </button>
              </div>
            </div>

            {/* Device Breakdown & Performance */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Device Engagement Breakdown
                </h3>
                <button
                  type="button"
                  onClick={handleRefreshAnalytics}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 text-slate-400" /> Desktop
                    </span>
                    <span>{analytics.eventsByDevice.desktop} events</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${
                          analytics.impressions > 0
                            ? Math.min(
                                100,
                                (analytics.eventsByDevice.desktop /
                                  (analytics.impressions + analytics.opened + 1)) *
                                  100
                              )
                            : 50
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-slate-400" /> Mobile
                    </span>
                    <span>{analytics.eventsByDevice.mobile} events</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${
                          analytics.impressions > 0
                            ? Math.min(
                                100,
                                (analytics.eventsByDevice.mobile /
                                  (analytics.impressions + analytics.opened + 1)) *
                                  100
                              )
                            : 35
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Tablet className="h-3.5 w-3.5 text-slate-400" /> Tablet
                    </span>
                    <span>{analytics.eventsByDevice.tablet} events</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-500"
                      style={{
                        width: `${
                          analytics.impressions > 0
                            ? Math.min(
                                100,
                                (analytics.eventsByDevice.tablet /
                                  (analytics.impressions + analytics.opened + 1)) *
                                  100
                              )
                            : 15
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Active Campaign ID:</span>
                <code className="font-mono text-[11px] bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                  {campaign.id}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONTENT & COPY */}
      {activeTab === "content" && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Popup Text &amp; Call-to-Action Content
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize the headline, explanation, trust signals, and post-submission acknowledgment
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Campaign Internal Name
              </label>
              <input
                type="text"
                value={campaign.name}
                onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Autumn 2026 Driving Lesson Lead Capture"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Popup Headline (Title)
              </label>
              <input
                type="text"
                value={campaign.title}
                onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Ready to Start Driving?"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Subtitle
              </label>
              <input
                type="text"
                value={campaign.subtitle || ""}
                onChange={(e) => setCampaign({ ...campaign, subtitle: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Book your first lesson with NextDrive Academy."
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Description / Body Copy
              </label>
              <textarea
                rows={3}
                value={campaign.description || ""}
                onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Tell prospective students what will happen when they submit..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Primary Button Text
              </label>
              <input
                type="text"
                value={campaign.buttonText}
                onChange={(e) => setCampaign({ ...campaign, buttonText: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Book My Lesson"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Trust Badge / Footer Micro-copy
              </label>
              <input
                type="text"
                value={campaign.trustBadgeText || ""}
                onChange={(e) => setCampaign({ ...campaign, trustBadgeText: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. ✓ 89.4% First-Time Pass Rate • Certified Grade A ADIs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Success Title (Post-Submission)
              </label>
              <input
                type="text"
                value={campaign.successTitle}
                onChange={(e) => setCampaign({ ...campaign, successTitle: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. Lesson Request Received!"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Success Message
              </label>
              <input
                type="text"
                value={campaign.successMessage}
                onChange={(e) => setCampaign({ ...campaign, successMessage: e.target.value })}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Thank you! We will match you with a senior instructor shortly."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Save className="h-3.5 w-3.5" />
              Save Content Changes
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FORM FIELD BUILDER */}
      {activeTab === "fields" && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Form Field Builder &amp; Reordering
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Enable, require, rename labels, adjust placeholder copy, and reorder popup capture fields
              </p>
            </div>
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Active Fields:{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {campaign.fields.filter((f) => f.isEnabled).length}
              </span>
            </div>
          </div>

          {/* Fields List */}
          <div className="space-y-3">
            {campaign.fields.map((field, idx) => (
              <div
                key={field.fieldKey}
                className={`rounded-xl border p-4 transition-all ${
                  field.isEnabled
                    ? "border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
                    : "border-slate-200/50 dark:border-slate-800/40 bg-slate-100/40 dark:bg-slate-900/40 opacity-60"
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left: Reordering & Field Identifier */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveField(idx, "up")}
                        disabled={idx === 0}
                        className="rounded p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveField(idx, "down")}
                        disabled={idx === campaign.fields.length - 1}
                        className="rounded p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-200/70 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {field.label}
                        </span>
                        <code className="text-[10px] text-slate-400 font-mono bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded">
                          {field.fieldKey}
                        </code>
                      </div>
                      <span className="text-[11px] text-slate-500 capitalize">
                        Type: {field.fieldType}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Controls for Label & Placeholder */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 grow max-w-xl">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Label
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(idx, { label: e.target.value })}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ""}
                        onChange={(e) => updateField(idx, { placeholder: e.target.value })}
                        className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Right: Toggle Switches */}
                  <div className="flex items-center gap-4 shrink-0">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={field.isEnabled}
                        onChange={(e) => updateField(idx, { isEnabled: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>Enabled</span>
                    </label>

                    <label
                      className={`flex items-center gap-2 cursor-pointer text-xs font-semibold ${
                        field.isEnabled
                          ? "text-slate-700 dark:text-slate-300"
                          : "text-slate-400 dark:text-slate-600"
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={!field.isEnabled}
                        checked={field.isRequired}
                        onChange={(e) => updateField(idx, { isRequired: e.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-40"
                      />
                      <span>Required</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Save className="h-3.5 w-3.5" />
              Save Field Configuration
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: TRIGGER & TIMING */}
      {activeTab === "triggers" && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Trigger Behavior &amp; Timing Rules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Decide exactly when and how the popup appears on the visitor&apos;s screen
            </p>
          </div>

          {/* Trigger Selection Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: "time",
                title: "Time Delay",
                desc: "Fires automatically after visitor spends a set number of seconds on page.",
                icon: Clock,
              },
              {
                id: "exit_intent",
                title: "Exit Intent",
                desc: "Triggers on desktop when visitor cursor leaves the top viewport boundary.",
                icon: MousePointer,
              },
              {
                id: "scroll",
                title: "Scroll Percentage",
                desc: "Displays when the visitor scrolls past a specific vertical scroll depth.",
                icon: MoveDown,
              },
              {
                id: "button",
                title: "Button / Event Click",
                desc: "Only opens when custom CTA or 'open-website-popup' event is fired.",
                icon: Zap,
              },
              {
                id: "time_scroll",
                title: "Time + Scroll Combined",
                desc: "Waits until both minimum time has elapsed AND user has scrolled down.",
                icon: Sliders,
              },
              {
                id: "manual",
                title: "Manual Control Only",
                desc: "Automated triggers disabled; controlled via code or special campaigns.",
                icon: Settings2,
              },
            ].map((item) => {
              const isSelected = campaign.triggerType === item.id;
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() =>
                    setCampaign({
                      ...campaign,
                      triggerType: item.id as PopupTriggerType,
                    })
                  }
                  className={`cursor-pointer rounded-xl border p-4 transition-all ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Configurable Delays & Depths */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Desktop Delay (Seconds)</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {campaign.delaySeconds}s
                </span>
              </label>
              <input
                type="range"
                min={3}
                max={120}
                step={1}
                value={campaign.delaySeconds}
                onChange={(e) =>
                  setCampaign({ ...campaign, delaySeconds: Number(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>3s</span>
                <span>30s</span>
                <span>60s</span>
                <span>120s</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Mobile Delay (Seconds)</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {campaign.mobileDelaySeconds}s
                </span>
              </label>
              <input
                type="range"
                min={3}
                max={120}
                step={1}
                value={campaign.mobileDelaySeconds}
                onChange={(e) =>
                  setCampaign({ ...campaign, mobileDelaySeconds: Number(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>3s (Fast)</span>
                <span>15s (Optimal)</span>
                <span>60s</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Scroll Depth Trigger</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {campaign.scrollPercentage}%
                </span>
              </label>
              <input
                type="range"
                min={10}
                max={90}
                step={5}
                value={campaign.scrollPercentage}
                onChange={(e) =>
                  setCampaign({ ...campaign, scrollPercentage: Number(e.target.value) })
                }
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>10% (Top)</span>
                <span>50% (Mid-page)</span>
                <span>90% (Bottom)</span>
              </div>
            </div>
          </div>

          {/* Countdown & Safety Notice */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
            <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Non-blocking Execution Guarantee:
              </span>
              Countdown timers strictly begin after the document load event finishes. If another modal
              (such as the standard course booking or login dialog) is already open, the trigger
              postpones automatically to preserve user flow.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Save className="h-3.5 w-3.5" />
              Save Trigger Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: FREQUENCY & ACTIONS */}
      {activeTab === "frequency" && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Display Frequency &amp; After-Submission Rules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Control how often visitors encounter the popup and what action takes place when they submit
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Frequency Options */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Display Frequency
              </label>
              {[
                { id: "every_visit", label: "Every visit (Testing / High-intensity)" },
                { id: "once_per_session", label: "Once per browser session (Recommended)" },
                { id: "once_per_day", label: "Once per calendar day" },
                { id: "once_3_days", label: "Once every 3 days" },
                { id: "once_7_days", label: "Once every 7 days" },
                { id: "once_30_days", label: "Once every 30 days" },
                { id: "never_after_submission", label: "Never show again after any submission" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200"
                >
                  <input
                    type="radio"
                    name="popupFrequency"
                    value={opt.id}
                    checked={campaign.frequency === opt.id}
                    onChange={(e) =>
                      setCampaign({
                        ...campaign,
                        frequency: e.target.value as PopupFrequency,
                      })
                    }
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>

            {/* After Dismissal & Cooldown */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  After Dismissal Rule (Visitor closes popup)
                </label>
                <div className="space-y-2">
                  {[
                    { id: "cooldown_days", label: "Apply cooldown in days" },
                    { id: "session", label: "Suppress for current session only" },
                  ].map((rule) => (
                    <label
                      key={rule.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <input
                        type="radio"
                        name="dismissalRule"
                        value={rule.id}
                        checked={campaign.dismissalRule === rule.id}
                        onChange={(e) =>
                          setCampaign({
                            ...campaign,
                            dismissalRule: e.target.value as PopupAfterDismissal,
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{rule.label}</span>
                    </label>
                  ))}
                </div>

                {campaign.dismissalRule === "cooldown_days" && (
                  <div className="pt-2">
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      Cooldown Period: <strong>{campaign.cooldownDays} days</strong>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      value={campaign.cooldownDays}
                      onChange={(e) =>
                        setCampaign({
                          ...campaign,
                          cooldownDays: Math.max(1, Number(e.target.value)),
                        })
                      }
                      className="w-32 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* After Submission Action */}
              <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Action After Successful Lead Submission
                </label>
                <div className="space-y-2">
                  {[
                    { id: "show_success", label: "Show success message inside popup" },
                    { id: "close", label: "Close popup immediately after 2s" },
                    { id: "redirect_booking", label: "Redirect to Courses / Pricing section" },
                    { id: "redirect_custom", label: "Redirect to custom external/internal URL" },
                  ].map((act) => (
                    <label
                      key={act.id}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200"
                    >
                      <input
                        type="radio"
                        name="afterSubmissionAction"
                        value={act.id}
                        checked={campaign.afterSubmissionAction === act.id}
                        onChange={(e) =>
                          setCampaign({
                            ...campaign,
                            afterSubmissionAction: e.target.value as PopupAfterSubmission,
                          })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{act.label}</span>
                    </label>
                  ))}
                </div>

                {campaign.afterSubmissionAction === "redirect_custom" && (
                  <div className="pt-2">
                    <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">
                      Redirect URL:
                    </label>
                    <input
                      type="text"
                      value={campaign.customRedirectUrl || ""}
                      onChange={(e) =>
                        setCampaign({ ...campaign, customRedirectUrl: e.target.value })
                      }
                      placeholder="e.g. /thank-you or https://nextdrive.uk/welcome"
                      className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Save className="h-3.5 w-3.5" />
              Save Frequency Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB 6: TARGETING & DEVICES */}
      {activeTab === "targeting" && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Device &amp; URL Targeting Rules
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select which devices and website sections are eligible to trigger the popup
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Devices */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Target Device Categories
              </label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaign.showDesktop}
                    onChange={(e) =>
                      setCampaign({ ...campaign, showDesktop: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Monitor className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Desktop Computers
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Supports exit intent and full-width layout
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaign.showTablet}
                    onChange={(e) =>
                      setCampaign({ ...campaign, showTablet: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Tablet className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Tablets &amp; iPads
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Touchscreen tablet viewports
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campaign.showMobile}
                    onChange={(e) =>
                      setCampaign({ ...campaign, showMobile: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Smartphone className="h-4 w-4 text-slate-500" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Mobile Phones
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Uses independent mobile delay ({campaign.mobileDelaySeconds}s)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Target & Excluded Pages */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Included Target Pages
                </label>
                <div className="space-y-1.5">
                  {[
                    { path: "/", label: "Homepage (/)" },
                    { path: "/#courses", label: "Courses & Pricing Section" },
                    { path: "/#locations", label: "Service Locations & Test Centers" },
                    { path: "/#instructors", label: "Instructors Section" },
                    { path: "/#reviews", label: "Student Reviews" },
                  ].map((p) => {
                    const isIncluded = campaign.targetPages.includes(p.path);
                    return (
                      <label
                        key={p.path}
                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCampaign({
                                ...campaign,
                                targetPages: [...campaign.targetPages, p.path],
                              });
                            } else {
                              setCampaign({
                                ...campaign,
                                targetPages: campaign.targetPages.filter(
                                  (item) => item !== p.path
                                ),
                              });
                            }
                          }}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{p.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Hardcoded Excluded Areas (Strict Isolation)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["/admin/*", "/instructor/*", "/student/*", "/login", "/signup", "/auth/*"].map(
                    (p) => (
                      <span
                        key={p}
                        className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 font-mono text-[11px] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      >
                        {p}
                      </span>
                    )
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  These pages NEVER trigger popups under any circumstances to safeguard app navigation.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Save className="h-3.5 w-3.5" />
              Save Targeting Rules
            </button>
          </div>
        </div>
      )}

      {/* TAB 7: DESIGN & ANIMATION */}
      {activeTab === "design" && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Visual Design, Positioning &amp; Entrance Animations
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize placement on the viewport, modal dimensions, color theme, and transition physics
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Position */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Screen Position
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "center", label: "Center Modal" },
                  { id: "bottom_right", label: "Bottom Right Floating" },
                  { id: "bottom_left", label: "Bottom Left Floating" },
                  { id: "bottom_center", label: "Bottom Center Banner" },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() =>
                      setCampaign({ ...campaign, position: pos.id as PopupPosition })
                    }
                    className={`rounded-xl border p-3 text-left transition-all ${
                      campaign.position === pos.id
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <Layout className="h-4 w-4 mb-1.5 text-indigo-500" />
                    <span className="text-xs font-semibold block">{pos.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Width */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Desktop Modal Width
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "small", label: "Small (420px)" },
                  { id: "medium", label: "Medium (500px)" },
                  { id: "large", label: "Large (600px)" },
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() =>
                      setCampaign({ ...campaign, size: sz.id as PopupSize })
                    }
                    className={`rounded-xl border p-3 text-center transition-all ${
                      campaign.size === sz.id
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <span className="text-xs font-semibold block">{sz.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Theme */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: "auto", label: "Auto (Matches OS/Site)", icon: Sparkles },
                  { id: "light", label: "Force Light", icon: Sun },
                  { id: "dark", label: "Force Dark", icon: Moon },
                ].map((th) => {
                  const Icon = th.icon;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() =>
                        setCampaign({ ...campaign, theme: th.id as PopupTheme })
                      }
                      className={`rounded-xl border p-3 text-left transition-all ${
                        campaign.theme === th.id
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
                      }`}
                    >
                      <Icon className="h-4 w-4 mb-1.5 text-indigo-500" />
                      <span className="text-xs font-semibold block">{th.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Animation Physics */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Entrance Animation
              </label>
              <select
                value={campaign.animation}
                onChange={(e) =>
                  setCampaign({
                    ...campaign,
                    animation: e.target.value as PopupAnimation,
                  })
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option value="fade_scale">Fade + Subtle Scale (3D Pop)</option>
                <option value="fade">Pure Fade In</option>
                <option value="slide_up">Slide Up From Bottom</option>
                <option value="slide_down">Slide Down From Top</option>
                <option value="none">No Animation (Instant)</option>
              </select>
            </div>

            {/* Backdrop Controls */}
            <div className="space-y-3 md:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    Darkened Backdrop Overlay
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Dim background content to focus visitor attention on the popup
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={campaign.backdropEnabled}
                  onChange={(e) =>
                    setCampaign({ ...campaign, backdropEnabled: e.target.checked })
                  }
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>

              {campaign.backdropEnabled && (
                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1">
                    <span>Backdrop Darkness (Opacity)</span>
                    <strong className="text-indigo-600 dark:text-indigo-400">
                      {campaign.backdropOpacity}%
                    </strong>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={80}
                    step={5}
                    value={campaign.backdropOpacity}
                    onChange={(e) =>
                      setCampaign({
                        ...campaign,
                        backdropOpacity: Number(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-600"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
            >
              <Save className="h-3.5 w-3.5" />
              Save Design Settings
            </button>
          </div>
        </div>
      )}

      {/* TAB 8: LIVE TELEMETRY & EVENT STREAM */}
      {activeTab === "analytics" && (
        <div className="space-y-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Visitor Event Telemetry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time stream of popup impressions, clicks, dismissals, and lead submissions
              </p>
            </div>
            <button
              type="button"
              onClick={handleRefreshAnalytics}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh Events
            </button>
          </div>

          {/* Event Stream Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Event Name</th>
                  <th className="px-4 py-2.5">Page URL</th>
                  <th className="px-4 py-2.5">Device</th>
                  <th className="px-4 py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {analytics.recentEvents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      No telemetry events recorded yet.
                    </td>
                  </tr>
                ) : (
                  analytics.recentEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-2.5 font-medium">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                            evt.event === "popup_submitted"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : evt.event === "popup_opened"
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                              : evt.event === "popup_dismissed"
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : evt.event === "popup_form_started"
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {evt.event}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {evt.pageUrl}
                      </td>
                      <td className="px-4 py-2.5 capitalize text-slate-600 dark:text-slate-400">
                        {evt.deviceType}
                      </td>
                      <td className="px-4 py-2.5 text-slate-400 text-[11px]">
                        {new Date(evt.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INTERACTIVE PREVIEW MODAL */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="flex h-full max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Top Preview Bar */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="h-4 w-4 text-indigo-500" />
                  Live Popup Simulator
                </span>
                <span className="text-[11px] text-slate-400">
                  Interactive preview of current draft
                </span>
              </div>

              {/* Viewport & Theme Switcher */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      previewDevice === "desktop"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      previewDevice === "mobile"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    Mobile
                  </button>
                </div>

                <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("light")}
                    className={`p-1.5 rounded-md transition ${
                      previewTheme === "light"
                        ? "bg-amber-100 text-amber-800 dark:bg-slate-800"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                    title="Light Mode"
                  >
                    <Sun className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTheme("dark")}
                    className={`p-1.5 rounded-md transition ${
                      previewTheme === "dark"
                        ? "bg-indigo-900 text-indigo-200"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                    title="Dark Mode"
                  >
                    <Moon className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Stage Canvas */}
            <div className="relative flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 p-6 flex items-center justify-center">
              {/* Device Frame */}
              <div
                className={`transition-all duration-300 w-full ${
                  previewDevice === "mobile"
                    ? "max-w-sm rounded-[32px] border-8 border-slate-800 shadow-2xl p-4 bg-white dark:bg-slate-900 min-h-[560px]"
                    : "max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 p-6"
                } ${previewTheme === "dark" ? "dark bg-slate-900 text-white" : "bg-white text-slate-900"}`}
              >
                {/* Simulated Popup Body */}
                {previewSubmitted ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {campaign.successTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                      {campaign.successMessage}
                    </p>
                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => setPreviewSubmitted(false)}
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        Reset Simulator
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          NextDrive Academy
                        </span>
                        <span className="text-slate-400 text-xs">✕</span>
                      </div>
                      <h3 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {campaign.title}
                      </h3>
                      {campaign.subtitle && (
                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                          {campaign.subtitle}
                        </p>
                      )}
                      {campaign.description && (
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {campaign.description}
                        </p>
                      )}
                    </div>

                    {/* Active Fields Simulator */}
                    <div className="space-y-2.5">
                      {campaign.fields
                        .filter((f) => f.isEnabled)
                        .map((f) => (
                          <div key={f.fieldKey} className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              {f.label}{" "}
                              {f.isRequired && <span className="text-rose-500">*</span>}
                            </label>
                            {f.fieldType === "select" ? (
                              <select className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-1.5 text-xs text-slate-900 dark:text-white">
                                {f.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            ) : f.fieldType === "textarea" ? (
                              <textarea
                                rows={2}
                                placeholder={f.placeholder || ""}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                              />
                            ) : (
                              <input
                                type={f.fieldType === "email" ? "email" : f.fieldType === "tel" ? "tel" : "text"}
                                placeholder={f.placeholder || ""}
                                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                              />
                            )}
                          </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <button
                      type="button"
                      onClick={() => setPreviewSubmitted(true)}
                      className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition active:scale-[0.98]"
                    >
                      {campaign.buttonText}
                    </button>

                    {/* Trust Badge */}
                    {campaign.trustBadgeText && (
                      <p className="text-center text-[10px] text-slate-400 dark:text-slate-500">
                        {campaign.trustBadgeText}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
