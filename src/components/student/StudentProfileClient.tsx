"use client";

import React, { useState } from "react";
import { User, Phone, MapPin, FileText, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import { Student } from "@/types";

interface StudentProfileClientProps {
  student: Student;
}

export function StudentProfileClient({ student }: StudentProfileClientProps) {
  const [phone, setPhone] = useState(student.phone || "");
  const [postcode, setPostcode] = useState(student.postcode || "");
  const [provisionalLicenseNumber, setProvisionalLicenseNumber] = useState(
    student.provisionalLicenseNumber || ""
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          postcode,
          provisionalLicenseNumber,
        }),
      });

      if (res.ok) {
        setSuccess("Contact details and licence information updated successfully.");
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="h-6 w-6 text-indigo-600" />
          My Learner Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal contact details, pickup postcode, and UK provisional driving licence number.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Overview Card */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 font-bold text-white text-lg shadow-xs">
            {student.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {student.name}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Learner ID: {student.id} &bull; Registered {new Date(student.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Full Name (Official DVSA Record)
              </label>
              <input
                type="text"
                disabled
                value={student.name}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={student.email}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Telephone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Pickup Postcode
              </label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs uppercase text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Provisional Driving Licence Number
            </label>
            <input
              type="text"
              value={provisionalLicenseNumber}
              onChange={(e) => setProvisionalLicenseNumber(e.target.value.toUpperCase())}
              placeholder="e.g. THORN709214MT88"
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs uppercase font-mono text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Your 16-character UK provisional driving licence number required for practical test booking.
            </p>
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
