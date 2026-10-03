"use client";

import React, { useState } from "react";
import {
  Building2,
  Calendar,
  PoundSterling,
  ShieldCheck,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  KeyRound,
  ShieldAlert,
  Info,
} from "lucide-react";
import {
  GoogleIcon,
  AppleIcon,
  LinkedInIcon,
  MicrosoftIcon,
  XIcon,
} from "@/components/ui/SocialIcons";
import { BusinessSettings } from "@/types";

interface BusinessSettingsFormProps {
  initialSettings: BusinessSettings;
}

export function BusinessSettingsForm({
  initialSettings,
}: BusinessSettingsFormProps) {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<
    "profile" | "scheduling" | "rates" | "compliance" | "notifications" | "auth"
  >("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    field: keyof BusinessSettings,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleAuthProviderToggle = (
    provider: "google" | "apple" | "linkedin" | "microsoft" | "x",
    enabled: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      authProviders: {
        google: true,
        apple: true,
        linkedin: true,
        microsoft: false,
        x: false,
        ...(prev.authProviders || {}),
        [provider]: enabled,
      },
    }));
    if (statusMessage) setStatusMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatusMessage({
          type: "error",
          text: data.error || "Failed to save business settings.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: "Business settings saved and live dispatch rules updated!",
        });
        if (data.settings) {
          setSettings(data.settings);
        }
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error occurred while updating settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setStatusMessage({
      type: "success",
      text: "Settings restored to initial state.",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden dark:border-slate-800 dark:bg-slate-900">
      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 overflow-x-auto scrollbar-none px-4 pt-3 dark:border-slate-800 dark:bg-slate-950/40">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "profile"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Building2 className="h-4 w-4" />
          School Profile & Identity
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("scheduling")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "scheduling"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Calendar className="h-4 w-4" />
          Dispatch & Scheduling
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rates")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "rates"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <PoundSterling className="h-4 w-4" />
          Tuition Rates & Currency
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("compliance")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "compliance"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          DVSA Compliance & Safety
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "notifications"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Bell className="h-4 w-4" />
          Notifications & Alerts
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("auth")}
          className={`flex items-center gap-2 border-b-2 px-3.5 pb-3 text-xs font-semibold whitespace-nowrap transition ${
            activeTab === "auth"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-500 dark:text-indigo-400"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <KeyRound className="h-4 w-4" />
          Authentication Providers
        </button>
      </div>

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div
          className={`flex items-center gap-2 px-6 py-3 text-xs font-medium border-b ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
              : "bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50"
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

      {/* Main Form */}
      <form onSubmit={handleSave} className="p-6">
        {/* Tab 1: Profile & Identity */}
        {activeTab === "profile" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Driving School Profile & Brand Identity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official company details displayed on receipts, invoices, and booking confirmations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Driving School Legal Name
                </label>
                <input
                  type="text"
                  value={settings.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Trading Name / Brand
                </label>
                <input
                  type="text"
                  value={settings.tradingName}
                  onChange={(e) => handleChange("tradingName", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Companies House Registration No.
                </label>
                <input
                  type="text"
                  value={settings.companyRegistrationNumber}
                  onChange={(e) =>
                    handleChange("companyRegistrationNumber", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  DVSA School Accreditation ID
                </label>
                <input
                  type="text"
                  value={settings.dvsaSchoolId}
                  onChange={(e) => handleChange("dvsaSchoolId", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Customer Support & Booking Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Emergency Instructor Dispatch Line
                </label>
                <input
                  type="text"
                  value={settings.emergencyPhone}
                  onChange={(e) =>
                    handleChange("emergencyPhone", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Official Support & Notification Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Head Office & Dispatch Depot Address
                </label>
                <textarea
                  rows={2}
                  value={settings.headOfficeAddress}
                  onChange={(e) =>
                    handleChange("headOfficeAddress", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dispatch & Scheduling Rules */}
        {activeTab === "scheduling" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Booking Dispatch & Operating Window
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define lesson slot lengths, dispatch hours, cancellation notice requirements, and advance booking windows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Standard Lesson Slot Duration (Minutes)
                </label>
                <select
                  value={settings.standardSlotDurationMinutes}
                  onChange={(e) =>
                    handleChange(
                      "standardSlotDurationMinutes",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                >
                  <option value={60}>60 Minutes (1 Hour)</option>
                  <option value={90}>90 Minutes (1.5 Hours)</option>
                  <option value={120}>120 Minutes (2 Hours - Standard Recommended)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Cancellation Notice Threshold (Hours)
                </label>
                <input
                  type="number"
                  min={12}
                  max={72}
                  value={settings.cancellationNoticeHours}
                  onChange={(e) =>
                    handleChange(
                      "cancellationNoticeHours",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Late cancellations within this window forfeit lesson credit.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Weekday Dispatch Hours (Opening - Closing)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={settings.weekdayOpeningTime}
                    onChange={(e) =>
                      handleChange("weekdayOpeningTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-400 dark:text-slate-500">to</span>
                  <input
                    type="time"
                    value={settings.weekdayClosingTime}
                    onChange={(e) =>
                      handleChange("weekdayClosingTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Weekend Dispatch Hours (Opening - Closing)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={settings.weekendOpeningTime}
                    onChange={(e) =>
                      handleChange("weekendOpeningTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-400 dark:text-slate-500">to</span>
                  <input
                    type="time"
                    value={settings.weekendClosingTime}
                    onChange={(e) =>
                      handleChange("weekendClosingTime", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Min Advance Booking Notice (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={settings.minAdvanceBookingHours}
                  onChange={(e) =>
                    handleChange(
                      "minAdvanceBookingHours",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Max Advance Booking Window (Days)
                </label>
                <input
                  type="number"
                  min={7}
                  max={120}
                  value={settings.maxAdvanceBookingDays}
                  onChange={(e) =>
                    handleChange(
                      "maxAdvanceBookingDays",
                      Number(e.target.value)
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Tuition Rates & Currency */}
        {activeTab === "rates" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Tuition Rates, Surcharges & Currency
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set base hourly tuition rates for Manual and Automatic instruction and test day car rental fees.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Base Hourly Rate — Manual Transmission (£)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">
                    £
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    value={settings.hourlyRateManual}
                    onChange={(e) =>
                      handleChange("hourlyRateManual", Number(e.target.value))
                    }
                    required
                    className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Standard 2-hour lesson = £{(settings.hourlyRateManual * 2).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Base Hourly Rate — Automatic Transmission (£)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">
                    £
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="10"
                    value={settings.hourlyRateAutomatic}
                    onChange={(e) =>
                      handleChange(
                        "hourlyRateAutomatic",
                        Number(e.target.value)
                      )
                    }
                    required
                    className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Standard 2-hour lesson = £{(settings.hourlyRateAutomatic * 2).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  DVSA Test Day Car Hire Fee (£)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">
                    £
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="50"
                    value={settings.testDayCarHireFee}
                    onChange={(e) =>
                      handleChange("testDayCarHireFee", Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Includes 1-hour pre-test warm-up + insurance for the examiner test.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Weekend / Peak Surcharge (£ per session)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">
                    £
                  </span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={settings.weekendSurcharge}
                    onChange={(e) =>
                      handleChange("weekendSurcharge", Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-3 text-xs font-mono font-bold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Added automatically for Saturday and Sunday bookings.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: DVSA Compliance & Safety */}
        {activeTab === "compliance" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                DVSA Compliance & Safety Certifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ensure regulatory alignment with DVSA dual-control inspection guidelines and learner insurance policies.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50/70 cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={settings.dualControlInspected}
                  onChange={(e) =>
                    handleChange("dualControlInspected", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Mandatory Dual-Control Fleet Inspection Verified
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    All instructor vehicles have undergone He-Man / FAST dual control safety validation.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50/70 cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={settings.freeTheoryAppAccess}
                  onChange={(e) =>
                    handleChange("freeTheoryAppAccess", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Theory Test Pro Student Integration
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Automatically provision a free Theory Test Pro account upon a student&apos;s first booking.
                  </span>
                </div>
              </label>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 dark:text-slate-300">
                  Fleet Commercial Insurance Policy Coverage
                </label>
                <input
                  type="text"
                  value={settings.insuranceCoverageLevel}
                  onChange={(e) =>
                    handleChange("insuranceCoverageLevel", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Notifications & Automation */}
        {activeTab === "notifications" && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Automated Customer Notifications & Alerts
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure automated SMS reminders, instructor dispatch alerts, and student review invitations.
              </p>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50/70 cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={settings.smsRemindersEnabled}
                  onChange={(e) =>
                    handleChange("smsRemindersEnabled", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    24-Hour SMS Lesson Reminders
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Sends an automated SMS to students 24 hours prior to their pickup time.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50/70 cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={settings.instantDispatchAlerts}
                  onChange={(e) =>
                    handleChange("instantDispatchAlerts", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Instant Instructor Dispatch Alerts
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Pushes a mobile alert to the assigned ADI when a new lesson is booked in their coverage sector.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50/70 cursor-pointer dark:border-slate-700 dark:hover:bg-slate-800/40">
                <input
                  type="checkbox"
                  checked={settings.autoReviewInvites}
                  onChange={(e) =>
                    handleChange("autoReviewInvites", e.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                />
                <div>
                  <span className="block text-xs font-bold text-slate-900 dark:text-white">
                    Automated Test Pass Review Invitation
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Sends congratulations and a Google/Trustpilot review invitation 2 hours after a test pass is recorded.
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Tab 6: Authentication Providers & Single Sign-On */}
        {activeTab === "auth" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Social Sign-In & Authentication Providers
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure OAuth identity providers available for Student and Instructor registration and login.
              </p>
            </div>

            {/* Admin Security Isolation Banner */}
            <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-4 flex items-start gap-3">
              <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-200">
                  Strict Admin Authentication Isolation Active
                </p>
                <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  Social authentication is enabled exclusively for <strong>Student</strong> and <strong>Instructor</strong> accounts.
                  Administrator logins strictly require verified email and encrypted password credentials with zero public OAuth registration.
                </p>
              </div>
            </div>

            {/* Providers Toggles */}
            <div className="grid grid-cols-1 gap-3">
              {/* Google */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center justify-center shadow-xs">
                    <GoogleIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Google Workspace &amp; Accounts
                      </span>
                      <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.2 text-[10px] font-semibold">
                        Primary (Student &amp; Instructor)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      1-click authentication using verified Google OpenID Connect profile and email.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.authProviders?.google ?? true}
                    onChange={(e) => handleAuthProviderToggle("google", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Apple */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center justify-center shadow-xs">
                    <AppleIcon className="h-5 w-5 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Sign in with Apple
                      </span>
                      <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 px-2 py-0.2 text-[10px] font-semibold">
                        Primary (Student &amp; Instructor)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Native iOS and macOS Apple ID sign-in with private email relay support.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.authProviders?.apple ?? true}
                    onChange={(e) => handleAuthProviderToggle("apple", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center justify-center shadow-xs">
                    <LinkedInIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        LinkedIn OAuth 2.0
                      </span>
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.2 text-[10px] font-semibold">
                        Instructor Career Focus
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Professional identity authentication for Approved Driving Instructors (ADIs).
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.authProviders?.linkedin ?? true}
                    onChange={(e) => handleAuthProviderToggle("linkedin", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Microsoft */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center justify-center shadow-xs">
                    <MicrosoftIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Microsoft Entra ID / Live
                      </span>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.2 text-[10px] font-semibold">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Support school, university, and personal Outlook/Microsoft account logins.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.authProviders?.microsoft ?? false}
                    onChange={(e) => handleAuthProviderToggle("microsoft", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* X */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 p-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center justify-center shadow-xs">
                    <XIcon className="h-4 w-4 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        X (formerly Twitter)
                      </span>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.2 text-[10px] font-semibold">
                        Optional
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      OAuth 2.0 social authentication using X profiles.
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.authProviders?.x ?? false}
                    onChange={(e) => handleAuthProviderToggle("x", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            {/* Development / Test Simulator Info */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 flex items-start gap-3">
              <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>Local Development Simulator:</strong> When running in development without external OAuth API credentials configured in <code>.env</code>, NextDrive redirects to an interactive local consent screen (<code>/auth/mock-oauth</code>) for fast verification without external cloud dependencies.
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 dark:border-slate-800">
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Changes take effect immediately across all booking flows and dispatch routes.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <Save className="h-3.5 w-3.5" />
              {isSaving ? "Saving Settings..." : "Save Business Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
