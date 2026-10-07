"use client";

import React, { useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  Save,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Instructor } from "@/types";
import { ConnectedAccountsCard } from "@/components/shared/ConnectedAccountsCard";
import { InstructorPhotoUpload } from "@/components/admin/InstructorPhotoUpload";

interface InstructorProfileClientProps {
  instructor: Instructor;
}

export function InstructorProfileClient({
  instructor,
}: InstructorProfileClientProps) {
  const [phone, setPhone] = useState(instructor.phone || "");
  const [bio, setBio] = useState(instructor.bio || "");
  const [areasInput, setAreasInput] = useState(
    (instructor.areas || ["Manchester City Centre", "Cheetham Hill DTC", "West Didsbury DTC"]).join(", ")
  );
  const [avatar, setAvatar] = useState(instructor.avatar || "");
  const [avatarPositionX, setAvatarPositionX] = useState(instructor.avatarPositionX ?? 50);
  const [avatarPositionY, setAvatarPositionY] = useState(instructor.avatarPositionY ?? 20);
  const [avatarZoom, setAvatarZoom] = useState(instructor.avatarZoom ?? 1);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);

    const areas = areasInput
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/instructor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          bio,
          areas,
          avatar,
          avatarPositionX,
          avatarPositionY,
          avatarZoom,
        }),
      });

      if (res.ok) {
        setSuccess("Profile information updated successfully.");
        window.dispatchEvent(
          new CustomEvent("nextdrive:user-updated", {
            detail: { avatar },
          })
        );
        setTimeout(() => setSuccess(null), 4000);
      }
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
          <UserCheck className="h-6 w-6 text-emerald-600" />
          Instructor Profile & Credentials
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your official DVSA Approved Driving Instructor (ADI) accreditation and manage public learner bio.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      {/* Official Credentials Read-Only Banner */}
      <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/60 bg-gradient-to-br from-emerald-50/70 to-teal-50/30 dark:from-emerald-950/30 dark:to-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-200/60 dark:border-emerald-900/40 pb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
            <ShieldCheck className="h-4 w-4" />
            DVSA Verified Credentials (Read-Only)
          </span>
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Lock className="h-3 w-3" /> Managed by Head Office
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500">ADI Badge Number:</span>
            <p className="mt-1 font-mono font-bold text-slate-900 dark:text-white text-sm">
              {instructor.badgeNumber}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Standards Check Grade:</span>
            <p className="mt-1 font-bold text-emerald-700 dark:text-emerald-400 text-sm">
              {instructor.grade || "Grade A (51/51)"}
            </p>
          </div>
          <div>
            <span className="text-slate-500">Student First-Time Passes:</span>
            <p className="mt-1 font-bold text-slate-900 dark:text-white text-sm">
              {instructor.totalPasses} passes
            </p>
          </div>
          <div>
            <span className="text-slate-500">Dual-Control Car:</span>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white truncate">
              {instructor.vehicle}
            </p>
          </div>
        </div>
      </div>

      {/* Editable Information Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Photo & Framing */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Official Profile Photo &amp; Framing
            </h2>
            <span className="text-[11px] text-slate-400">
              Visible on Fleet Directory &amp; Student Portal
            </span>
          </div>

          <InstructorPhotoUpload
            instructorName={instructor.name}
            badgeNumber={instructor.badgeNumber}
            currentAvatar={avatar}
            avatarPositionX={avatarPositionX}
            avatarPositionY={avatarPositionY}
            avatarZoom={avatarZoom}
            onChange={({ avatar, avatarPositionX, avatarPositionY, avatarZoom }) => {
              setAvatar(avatar);
              setAvatarPositionX(avatarPositionX);
              setAvatarPositionY(avatarPositionY);
              setAvatarZoom(avatarZoom);
            }}
            onRemove={() => {
              setAvatar("");
              setAvatarPositionX(50);
              setAvatarPositionY(20);
              setAvatarZoom(1);
            }}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Public Tuition Bio & Contact
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Official Name
              </label>
              <input
                type="text"
                disabled
                value={instructor.name}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={instructor.email}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-3 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Direct Contact Telephone (Visible to assigned learners)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Areas & Test Centers Covered (Comma-separated)
            </label>
            <input
              type="text"
              value={areasInput}
              onChange={(e) => setAreasInput(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Example: Manchester City Centre, Cheetham Hill DTC, West Didsbury DTC, Sale, Salford, Bury
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Instructor Bio & Teaching Approach
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell prospective students about your driving school experience, teaching style, and success rates..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none leading-relaxed"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </div>
      </form>

      {/* Connected Social Accounts */}
      <ConnectedAccountsCard userRole="INSTRUCTOR" />
    </div>
  );
}
