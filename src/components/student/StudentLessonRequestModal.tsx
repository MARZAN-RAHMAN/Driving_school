"use client";

import React, { useState } from "react";
import { Plus, X, Calendar, Clock, MapPin, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Instructor, LessonPackage } from "@/types";

interface StudentLessonRequestModalProps {
  instructors: Instructor[];
  packages: LessonPackage[];
  defaultPickup?: string;
  onBookingCreated: () => void;
}

export function StudentLessonRequestModal({
  instructors,
  packages,
  defaultPickup = "Manchester, UK",
  onBookingCreated,
}: StudentLessonRequestModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    lessonTitle: packages[0]?.title || "2-Hour Practical Test Simulation",
    transmission: "MANUAL",
    pickupLocation: defaultPickup,
    dateTime: "Tomorrow, 10:00 - 12:00 PM",
    durationHours: 2,
    instructorId: instructors[0]?.id || "inst_01",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const selectedInstructor = instructors.find((i) => i.id === form.instructorId);

    try {
      const res = await fetch("/api/student/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          instructorName: selectedInstructor?.name || "Dave Miller",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit booking request.");
      }

      setSuccess("Your lesson request has been dispatched! Your instructor will confirm the time slot.");
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(null);
        onBookingCreated();
      }, 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error submitting request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Request Next Lesson</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Request a Driving Lesson
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    Direct booking request to your allocated ADI instructor
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-error/10 border border-error/20 p-3 text-xs text-error">
                <AlertCircle className="h-4 w-4 shrink-0 text-error mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-success/10 border border-success/20 p-3 text-xs text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Lesson Type / Syllabus Target
                </label>
                <select
                  value={form.lessonTitle}
                  onChange={(e) => setForm({ ...form, lessonTitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-input-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="Cockpit Drill & Basic Controls" className="bg-card text-card-foreground">Cockpit Drill &amp; Basic Controls</option>
                  <option value="Junctions, Cross-Roads & Traffic Lights" className="bg-card text-card-foreground">Junctions, Cross-Roads &amp; Traffic Lights</option>
                  <option value="Complex Roundabouts & Lane Discipline" className="bg-card text-card-foreground">Complex Roundabouts &amp; Lane Discipline</option>
                  <option value="Parallel Parking & Bay Maneuvers" className="bg-card text-card-foreground">Parallel Parking &amp; Bay Maneuvers</option>
                  <option value="Dual Carriageway & High Speed Driving" className="bg-card text-card-foreground">Dual Carriageway &amp; High Speed Driving</option>
                  <option value="Official DVSA Mock Driving Test Simulation" className="bg-card text-card-foreground">Official DVSA Mock Driving Test Simulation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Transmission
                  </label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-input-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value="MANUAL" className="bg-card text-card-foreground">Manual Transmission</option>
                    <option value="AUTOMATIC" className="bg-card text-card-foreground">Automatic Transmission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">
                    Duration
                  </label>
                  <select
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-input-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
                  >
                    <option value={2} className="bg-card text-card-foreground">2 Hours (Standard)</option>
                    <option value={1.5} className="bg-card text-card-foreground">1.5 Hours</option>
                    <option value={3} className="bg-card text-card-foreground">3 Hours (Intensive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Preferred Date &amp; Time Slot
                </label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={form.dateTime}
                    onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                    placeholder="e.g. Thursday, 14:00 - 16:00 PM"
                    className="w-full rounded-lg border border-input-border bg-input pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Pickup Location &amp; Postcode
                </label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={form.pickupLocation}
                    onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                    placeholder="e.g. 14 Wilmslow Road, Didsbury, M20 2RN"
                    className="w-full rounded-lg border border-input-border bg-input pl-9 pr-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Notes for Instructor (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Want to practice parallel parking near test center"
                  className="mt-1 w-full rounded-lg border border-input-border bg-input px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary-hover transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Transmitting Request..." : "Submit Booking Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
