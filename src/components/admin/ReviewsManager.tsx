"use client";

import React, { useState } from "react";
import { Star, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { ReviewItem } from "@/types";

interface ReviewsManagerProps {
  initialReviews: ReviewItem[];
}

export function ReviewsManager({ initialReviews }: ReviewsManagerProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    student: "",
    instructor: "",
    testCenter: "",
    rating: 5,
    result: "PASSED FIRST TIME",
    minors: "0 Minor Faults",
    quote: "",
    featured: true,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setNotification({ type: "error", text: data.error || "Failed to create review" });
      } else {
        setReviews((prev) => [data.review, ...prev]);
        setIsAdding(false);
        setForm({
          student: "",
          instructor: "",
          testCenter: "",
          rating: 5,
          result: "PASSED FIRST TIME",
          minors: "0 Minor Faults",
          quote: "",
          featured: true,
        });
        setNotification({ type: "success", text: "New pass story published to public website!" });
      }
    } catch {
      setNotification({ type: "error", text: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove the review for ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        setNotification({ type: "success", text: "Review deleted successfully." });
      }
    } catch {
      setNotification({ type: "error", text: "Failed to delete review." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header action */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? "Cancel" : "Add Pass Story / Review"}
        </button>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 rounded-xl p-4 text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/50"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Add Review Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6 space-y-4 dark:border-indigo-900/60 dark:bg-indigo-950/30"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Add Verified Student Pass Story
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Student Name</label>
              <input
                type="text"
                required
                value={form.student}
                onChange={(e) => setForm({ ...form, student: e.target.value })}
                placeholder="e.g. Jordan Rivera"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Instructor</label>
              <input
                type="text"
                required
                value={form.instructor}
                onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                placeholder="e.g. Aisha Patel"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Test Center</label>
              <input
                type="text"
                required
                value={form.testCenter}
                onChange={(e) => setForm({ ...form, testCenter: e.target.value })}
                placeholder="e.g. West Didsbury DTC"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Rating (Stars)</label>
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value={5}>5 Stars ★★★★★</option>
                <option value={4}>4 Stars ★★★★☆</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Test Result</label>
              <input
                type="text"
                value={form.result}
                onChange={(e) => setForm({ ...form, result: e.target.value })}
                placeholder="PASSED FIRST TIME"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Minor Faults Count</label>
              <input
                type="text"
                value={form.minors}
                onChange={(e) => setForm({ ...form, minors: e.target.value })}
                placeholder="0 Minor Faults (Clean Sheet)"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Student Quote / Testimonial</label>
            <textarea
              required
              rows={2}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              placeholder="Tell other learners about the experience..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-950 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              {loading ? "Publishing..." : "Publish to Website"}
            </button>
          </div>
        </form>
      )}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative group dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[...Array(r.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 dark:text-slate-500">{r.date}</span>
                  <button
                    onClick={() => handleDelete(r.id, r.student)}
                    className="text-slate-300 hover:text-rose-600 transition dark:text-slate-600 dark:hover:text-rose-400"
                    title="Delete Review"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-700 leading-relaxed italic dark:text-slate-300">
                &quot;{r.quote}&quot;
              </p>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-950 block dark:text-white">
                    {r.student}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Instructor: {r.instructor}
                  </span>
                </div>
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  🎯 {r.testCenter}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
