"use client";

import React, { useState } from "react";
import { Plus, Trash2, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { FAQItem } from "@/types";

interface FaqsManagerProps {
  initialFaqs: FAQItem[];
}

export function FaqsManager({ initialFaqs }: FaqsManagerProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "Lessons",
    order: 10,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setNotification({ type: "error", text: data.error || "Failed to create FAQ" });
      } else {
        setFaqs((prev) => [...prev, data.faq]);
        setIsAdding(false);
        setForm({
          question: "",
          answer: "",
          category: "Lessons",
          order: 10,
        });
        setNotification({ type: "success", text: "New FAQ published to public homepage!" });
      }
    } catch {
      setNotification({ type: "error", text: "Network error occurred." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, q: string) => {
    if (!confirm(`Are you sure you want to delete FAQ: "${q}"?`)) return;

    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f.id !== id));
        setNotification({ type: "success", text: "FAQ deleted successfully." });
      }
    } catch {
      setNotification({ type: "error", text: "Failed to delete FAQ." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          {isAdding ? "Cancel" : "Add FAQ Question"}
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

      {isAdding && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-6 space-y-4 dark:border-indigo-900/60 dark:bg-indigo-950/30"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-300">
            <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Add Frequently Asked Question
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Question</label>
              <input
                type="text"
                required
                value={form.question}
                onChange={(e) => setForm({ ...form, question: e.target.value })}
                placeholder="e.g. Do you offer evening and weekend driving lessons?"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              >
                <option value="Lessons">Lessons</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Bookings">Bookings</option>
                <option value="Test Day">Test Day</option>
                <option value="Safety">Safety</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-700 dark:text-slate-300">Detailed Answer</label>
            <textarea
              required
              rows={3}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Provide clear, concise explanation..."
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
              {loading ? "Publishing..." : "Publish to Homepage FAQ"}
            </button>
          </div>
        </form>
      )}

      {/* FAQs List */}
      <div className="space-y-4">
        {faqs.map((f) => (
          <div
            key={f.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {f.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white">{f.question}</h3>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed dark:text-slate-300">{f.answer}</p>
              </div>

              <button
                onClick={() => handleDelete(f.id, f.question)}
                className="text-slate-300 hover:text-rose-600 transition shrink-0 p-1 dark:text-slate-600 dark:hover:text-rose-400"
                title="Delete Question"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
