"use client";

import React, { useState } from "react";
import {
  Plus,
  MapPin,
  Target,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { LocationArea } from "@/types";

interface LocationsManagerProps {
  initialLocations: LocationArea[];
}

export function LocationsManager({ initialLocations }: LocationsManagerProps) {
  const [locations, setLocations] = useState<LocationArea[]>(initialLocations);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    postcodesText: "NW1, NW3, N1",
    activeInstructors: 3,
    testCenterName: "Wood Green DTC",
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      postcodesText: "SW1, SW3, SW7",
      activeInstructors: 2,
      testCenterName: "Morden DTC",
    });
    setModalOpen(true);
  };

  const openEditModal = (loc: LocationArea) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      postcodesText: loc.postcodes.join(", "),
      activeInstructors: loc.activeInstructors,
      testCenterName: loc.testCenterName,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const postcodes = form.postcodesText
      .split(",")
      .map((p) => p.trim().toUpperCase())
      .filter(Boolean);

    try {
      if (editingId) {
        const res = await fetch("/api/admin/locations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            name: form.name,
            testCenterName: form.testCenterName,
            activeInstructors: Number(form.activeInstructors),
            postcodes,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update location");

        setLocations((prev) =>
          prev.map((l) => (l.id === editingId ? data.location : l))
        );
        setNotification({ type: "success", text: "Service location updated successfully." });
      } else {
        const res = await fetch("/api/admin/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            testCenterName: form.testCenterName,
            activeInstructors: Number(form.activeInstructors),
            postcodes,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to add location");

        setLocations((prev) => [...prev, data.location]);
        setNotification({ type: "success", text: "New service coverage area created!" });
      }

      setModalOpen(false);
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      setNotification({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving location.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove coverage area "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/locations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLocations((prev) => prev.filter((l) => l.id !== id));
        setNotification({ type: "success", text: "Location deleted successfully." });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification({ type: "error", text: "Failed to delete location." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Add Coverage Area</span>
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

      {/* Locations Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{loc.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {loc.activeInstructors} Instructors actively dispatched
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                  <button
                    onClick={() => openEditModal(loc)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    title="Edit Location"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(loc.id, loc.name)}
                    className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Delete Location"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Test Center */}
              <div className="mt-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  Primary DVSA Test Center: {loc.testCenterName}
                </div>
                <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300">
                  Mock tests and route simulation conducted directly on this center&apos;s published test routes.
                </p>
              </div>

              {/* Postcodes covered */}
              <div className="mt-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Covered Postcode Sectors
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {loc.postcodes.map((pc) => (
                    <span
                      key={pc}
                      className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {pc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit Service Coverage Area" : "Add Service Coverage Area"}
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
                  Area / Zone Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. South West & Wimbledon"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Primary DVSA Test Center
                </label>
                <input
                  type="text"
                  required
                  value={form.testCenterName}
                  onChange={(e) => setForm({ ...form, testCenterName: e.target.value })}
                  placeholder="e.g. Morden DTC"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Active Instructors Assigned
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={form.activeInstructors}
                  onChange={(e) => setForm({ ...form, activeInstructors: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Covered Postcodes (Comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={form.postcodesText}
                  onChange={(e) => setForm({ ...form, postcodesText: e.target.value })}
                  placeholder="e.g. SW19, SW20, SM4, CR4"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none uppercase"
                />
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
                  {loading ? "Saving..." : editingId ? "Update Area" : "Save Coverage Area"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
