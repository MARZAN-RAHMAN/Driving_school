"use client";

import React, { useState } from "react";
import {
  Plus,
  Zap,
  Check,
  Edit2,
  Trash2,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
} from "lucide-react";
import { LessonPackage, TransmissionType } from "@/types";

interface LessonsManagerProps {
  initialPackages: LessonPackage[];
}

export function LessonsManager({ initialPackages }: LessonsManagerProps) {
  const [packages, setPackages] = useState<LessonPackage[]>(initialPackages);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    transmission: "BOTH" as TransmissionType | "BOTH",
    durationHours: 2,
    price: 75,
    level: "Beginner" as LessonPackage["level"],
    popular: false,
    featuresText: "Personalized lesson roadmap\nDoor-to-door pickup & dropoff\nDVSA progress tracker app",
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      title: "",
      transmission: "BOTH",
      durationHours: 2,
      price: 75,
      level: "Beginner",
      popular: false,
      featuresText: "Personalized lesson roadmap\nDoor-to-door pickup & dropoff\nDVSA progress tracker app",
    });
    setModalOpen(true);
  };

  const openEditModal = (pkg: LessonPackage) => {
    setEditingId(pkg.id);
    setForm({
      title: pkg.title,
      transmission: pkg.transmission,
      durationHours: pkg.durationHours,
      price: pkg.price,
      level: pkg.level,
      popular: Boolean(pkg.popular),
      featuresText: pkg.features.join("\n"),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const features = form.featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        // Update
        const res = await fetch("/api/admin/lessons", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            ...form,
            features,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update package");

        setPackages((prev) =>
          prev.map((p) => (p.id === editingId ? data.package : p))
        );
        setNotification({ type: "success", text: "Package updated successfully! Changes reflected across public site." });
      } else {
        // Create
        const res = await fetch("/api/admin/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            features,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create package");

        setPackages((prev) => [...prev, data.package]);
        setNotification({ type: "success", text: "New tuition package published to public website!" });
      }

      setModalOpen(false);
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      setNotification({
        type: "error",
        text: err instanceof Error ? err.message : "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/lessons?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
        setNotification({ type: "success", text: "Package deleted successfully." });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification({ type: "error", text: "Failed to delete package." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course Package</span>
        </button>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/60"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Packages Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative flex flex-col justify-between rounded-2xl border bg-white dark:bg-slate-900 p-6 shadow-xs transition hover:shadow-md ${
              pkg.popular
                ? "border-indigo-500 ring-2 ring-indigo-500/20"
                : "border-slate-200/80 dark:border-slate-800"
            }`}
          >
            {pkg.popular && (
              <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                <Zap className="h-3 w-3 fill-white" />
                Most Popular
              </span>
            )}

            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                  {pkg.level}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {pkg.durationHours} Hours Total
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">{pkg.title}</h3>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                  £{pkg.price}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  (£{(pkg.price / (pkg.durationHours || 1)).toFixed(2)}/hr)
                </span>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                {pkg.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">
                {pkg.transmission === "BOTH" ? "Manual & Auto" : pkg.transmission}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(pkg)}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pkg.id, pkg.title)}
                  className="rounded-lg p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
                  title="Delete Package"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Package Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit Tuition Package" : "Create New Tuition Package"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Course Package Title
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 15-Hour Intensive Fast-Pass"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Hours
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Package Price (£)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target Skill Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value as LessonPackage["level"] })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Refresher">Refresher</option>
                    <option value="Pass Plus">Pass Plus</option>
                    <option value="Intensive">Intensive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Transmission
                  </label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value as LessonPackage["transmission"] })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="BOTH">Dual (Manual &amp; Auto)</option>
                    <option value="MANUAL">Manual Only</option>
                    <option value="AUTOMATIC">Automatic Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Included Features (One per line)
                </label>
                <textarea
                  rows={3}
                  value={form.featuresText}
                  onChange={(e) => setForm({ ...form, featuresText: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={form.popular}
                  onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="popular" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Highlight as &quot;Most Popular&quot; course badge on public site
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingId ? "Update Package" : "Publish Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
