"use client";

import React, { useState } from "react";
import {
  Clock,
  CalendarCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Calendar,
} from "lucide-react";
import { Instructor, InstructorAvailability } from "@/types";

interface InstructorAvailabilityClientProps {
  instructor: Instructor;
}

const ALL_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function InstructorAvailabilityClient({
  instructor,
}: InstructorAvailabilityClientProps) {
  const currentAvail = instructor.availability || {
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    startTime: "08:00",
    endTime: "18:00",
    breaks: ["12:00-13:00"],
    unavailableDates: ["2026-10-25"],
  };

  const [workingDays, setWorkingDays] = useState<string[]>(currentAvail.workingDays || []);
  const [startTime, setStartTime] = useState(currentAvail.startTime || "08:00");
  const [endTime, setEndTime] = useState(currentAvail.endTime || "18:00");
  const [unavailableDates, setUnavailableDates] = useState<string[]>(
    currentAvail.unavailableDates || []
  );
  const [newDate, setNewDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleDay = (day: string) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter((d) => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  const addBlockedDate = () => {
    if (newDate && !unavailableDates.includes(newDate)) {
      setUnavailableDates([...unavailableDates, newDate]);
      setNewDate("");
    }
  };

  const removeBlockedDate = (date: string) => {
    setUnavailableDates(unavailableDates.filter((d) => d !== date));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(null);

    const payload: InstructorAvailability = {
      workingDays,
      startTime,
      endTime,
      breaks: currentAvail.breaks || ["12:00-13:00"],
      unavailableDates,
    };

    try {
      const res = await fetch("/api/instructor/availability", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: payload }),
      });

      if (res.ok) {
        setSuccess("Tuition schedule and availability updated successfully.");
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
          <Clock className="h-6 w-6 text-emerald-600" />
          Manage Tuition Availability
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure your working days, daily teaching hours, and blocked time-off dates.
        </p>
      </div>

      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Working Days */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Working Days (Tuition Delivery)
          </h2>
          <p className="text-xs text-slate-500">
            Select the days of the week you are available for driving lessons:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
            {ALL_DAYS.map((day) => {
              const active = workingDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`flex flex-col items-center justify-center rounded-xl p-3 text-xs font-bold transition ${
                    active
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-50 dark:bg-slate-850 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{day.slice(0, 3)}</span>
                  <span className="text-[10px] mt-1 font-normal opacity-90">
                    {active ? "Available" : "Off"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Working Hours */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Daily Teaching Hours
          </h2>
          <p className="text-xs text-slate-500">
            Set your earliest start time and latest finish time:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs font-mono text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs font-mono text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Blocked Dates / Holiday Manager */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Blocked Dates & Time Off
          </h2>
          <p className="text-xs text-slate-500">
            Add specific dates when you are unavailable for lessons (holidays, vehicle maintenance):
          </p>

          <div className="flex gap-2 pt-2">
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={addBlockedDate}
              disabled={!newDate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 dark:bg-slate-700 px-4 py-2 text-xs font-bold text-white hover:bg-slate-900 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add Date
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {unavailableDates.length === 0 ? (
              <p className="text-xs text-slate-400">No dates currently blocked.</p>
            ) : (
              unavailableDates.map((date) => (
                <span
                  key={date}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200"
                >
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  {date}
                  <button
                    type="button"
                    onClick={() => removeBlockedDate(date)}
                    className="text-rose-500 hover:text-rose-700 ml-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving Changes..." : "Save Availability Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
