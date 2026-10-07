"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  Search,
  FileSpreadsheet,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  AlertCircle,
  Edit3,
  X,
  Save,
  Car,
} from "lucide-react";
import { Booking, Instructor, BookingStatus } from "@/types";

interface InstructorLessonsClientProps {
  initialLessons: Booking[];
  instructor: Instructor;
}

export function InstructorLessonsClient({
  initialLessons,
  instructor,
}: InstructorLessonsClientProps) {
  const searchParams = useSearchParams();
  const highlightBookingId = searchParams.get("bookingId");

  const [lessons, setLessons] = useState<Booking[]>(initialLessons);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [editingLesson, setEditingLesson] = useState<Booking | null>(
    highlightBookingId
      ? initialLessons.find((l) => l.id === highlightBookingId) || null
      : null
  );

  const [formStatus, setFormStatus] = useState<BookingStatus>("CONFIRMED");
  const [formInstructorNotes, setFormInstructorNotes] = useState("");
  const [formProgressNotes, setFormProgressNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const openEditModal = (lesson: Booking) => {
    setEditingLesson(lesson);
    setFormStatus(lesson.status);
    setFormInstructorNotes(lesson.instructorNotes || lesson.notes || "");
    setFormProgressNotes(lesson.progressNotes || "");
  };

  const filteredLessons = useMemo(() => {
    return lessons.filter((l) => {
      const matchesStatus =
        statusFilter === "ALL" || l.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        l.studentName.toLowerCase().includes(q) ||
        l.lessonTitle.toLowerCase().includes(q) ||
        l.pickupLocation.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [lessons, search, statusFilter]);

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    setSaving(true);

    try {
      const res = await fetch("/api/instructor/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: editingLesson.id,
          status: formStatus,
          instructorNotes: formInstructorNotes,
          progressNotes: formProgressNotes,
        }),
      });

      if (res.ok) {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === editingLesson.id
              ? {
                  ...l,
                  status: formStatus,
                  instructorNotes: formInstructorNotes,
                  progressNotes: formProgressNotes,
                }
              : l
          )
        );
        setSuccessBanner(`Lesson ${editingLesson.id} updated successfully.`);
        setTimeout(() => setSuccessBanner(null), 3500);
        setEditingLesson(null);
      }
    } catch {
      // silently handle
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    window.location.href = "/api/instructor/export?type=lessons";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarCheck className="h-6 w-6 text-emerald-600" />
            My Lessons & Schedule
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Driving lessons assigned to {instructor.name}. Update statuses, add instructor feedback, and log student competencies.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition self-start sm:self-auto"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Lessons (Excel)
        </button>
      </div>

      {successBanner && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs font-medium text-emerald-800 dark:text-emerald-300 shadow-xs">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by learner, lesson topic, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    statusFilter === status
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500">
            <CalendarCheck className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold">No lessons found</p>
            <p className="text-xs text-slate-400 mt-1">Try switching status filters or search query.</p>
          </div>
        ) : (
          filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition hover:border-emerald-500/50"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      {lesson.studentName}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        lesson.status === "CONFIRMED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : lesson.status === "IN_PROGRESS"
                          ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 animate-pulse"
                          : lesson.status === "COMPLETED"
                          ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          : lesson.status === "NO_SHOW"
                          ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                          : "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                      }`}
                    >
                      {lesson.status.replace("_", " ")}
                    </span>
                    <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-400">
                      {lesson.transmission}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      &bull; £{lesson.price} ({lesson.durationHours} hrs)
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {lesson.lessonTitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {lesson.dateTime}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {lesson.pickupLocation}
                    </span>
                    {lesson.studentPhone && (
                      <a
                        href={`tel:${lesson.studentPhone}`}
                        className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        {lesson.studentPhone}
                      </a>
                    )}
                  </div>

                  {/* Notes Callouts */}
                  {(lesson.instructorNotes || lesson.progressNotes) && (
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {lesson.instructorNotes && (
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-850 p-3">
                          <p className="font-bold text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Lesson Notes:
                          </p>
                          <p className="mt-1 text-slate-600 dark:text-slate-400">
                            {lesson.instructorNotes}
                          </p>
                        </div>
                      )}
                      {lesson.progressNotes && (
                        <div className="rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3">
                          <p className="font-bold text-[11px] text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                            Student Progress & Competency:
                          </p>
                          <p className="mt-1 text-emerald-700 dark:text-emerald-400">
                            {lesson.progressNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit Button */}
                <div className="flex md:flex-col items-center gap-2 self-start md:self-center shrink-0">
                  <button
                    onClick={() => openEditModal(lesson)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition shadow-xs"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-emerald-600" />
                    Update Lesson
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingLesson(null)}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Update Driving Lesson
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingLesson.studentName} &bull; {editingLesson.dateTime}
                  </p>
                </div>
                <button
                  onClick={() => setEditingLesson(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveNotes} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Lesson Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as BookingStatus)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 py-2.5 px-3 text-xs text-slate-900 dark:text-white focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  >
                    <option value="CONFIRMED">Confirmed / Scheduled</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="NO_SHOW">No Show</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Instructor Notes (Private internal tuition record)
                  </label>
                  <textarea
                    rows={3}
                    value={formInstructorNotes}
                    onChange={(e) => setFormInstructorNotes(e.target.value)}
                    placeholder="E.g. Practiced bay parking at Cheetham Hill test centre car park, improved mirror checks..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Student Progress Feedback (Visible to learner in their portal)
                  </label>
                  <textarea
                    rows={3}
                    value={formProgressNotes}
                    onChange={(e) => setFormProgressNotes(e.target.value)}
                    placeholder="E.g. Great progress on multi-lane roundabouts today. Remember to check blind spots before moving off..."
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingLesson(null)}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" />
                    {saving ? "Saving..." : "Save Lesson Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
