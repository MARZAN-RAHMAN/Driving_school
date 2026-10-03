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
  Compass,
  EyeOff,
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
    slug: "",
    postcodesText: "M1, M2, M3, M4",
    activeInstructors: 3,
    testCenterName: "Cheetham Hill DTC",
    latitude: 53.4808,
    longitude: -2.2426,
    coverageText: "Grade A instructor dual-control lessons",
    description: "High-density city driving, inner-ring road mastery, and complex multi-lane junctions.",
    isActive: true,
    displayOrder: 1,
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      slug: "",
      postcodesText: "M14, M19, M20",
      activeInstructors: 4,
      testCenterName: "West Didsbury DTC",
      latitude: 53.4244,
      longitude: -2.2312,
      coverageText: "DVSA test route & intensive tuition",
      description: "Comprehensive coverage across local test centers with high first-time pass rates.",
      isActive: true,
      displayOrder: locations.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (loc: LocationArea) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      slug: loc.slug || "",
      postcodesText: loc.postcodes.join(", "),
      activeInstructors: loc.activeInstructors,
      testCenterName: loc.testCenterName,
      latitude: loc.latitude ?? 53.4808,
      longitude: loc.longitude ?? -2.2426,
      coverageText: loc.coverageText || "",
      description: loc.description || "",
      isActive: loc.isActive !== false,
      displayOrder: loc.displayOrder ?? 1,
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (loc: LocationArea) => {
    const updatedStatus = !(loc.isActive !== false);
    try {
      const res = await fetch("/api/admin/locations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: loc.id,
          isActive: updatedStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setLocations((prev) =>
        prev.map((l) => (l.id === loc.id ? { ...l, isActive: updatedStatus } : l))
      );
      setNotification({
        type: "success",
        text: `Area "${loc.name}" is now ${updatedStatus ? "Active on public map" : "Hidden from public map"}.`,
      });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      setNotification({
        type: "error",
        text: err instanceof Error ? err.message : "Error updating location status.",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    const postcodes = form.postcodesText
      .split(",")
      .map((p) => p.trim().toUpperCase())
      .filter(Boolean);

    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      testCenterName: form.testCenterName,
      activeInstructors: Number(form.activeInstructors),
      postcodes,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      coverageText: form.coverageText,
      description: form.description,
      isActive: form.isActive,
      displayOrder: Number(form.displayOrder),
    };

    try {
      if (editingId) {
        const res = await fetch("/api/admin/locations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            ...payload,
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
          body: JSON.stringify(payload),
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Service Locations &amp; Map Coordinates</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage live Manchester test centers and coverage zones rendered on the interactive public map.
          </p>
        </div>
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
        {locations.map((loc) => {
          const isActive = loc.isActive !== false;
          return (
            <div
              key={loc.id}
              className={`flex flex-col justify-between rounded-2xl border transition-all ${
                isActive
                  ? "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                  : "border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 opacity-80"
              } p-6`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 p-2 text-indigo-600 dark:text-indigo-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">{loc.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          #{loc.displayOrder ?? 1}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {loc.activeInstructors} Instructors actively dispatched
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(loc)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                      title="Click to toggle active on public website"
                    >
                      {isActive ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(loc)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Edit Location"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id, loc.name)}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                      title="Delete Location"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* GPS Coordinates Badge */}
                <div className="mt-3.5 flex items-center gap-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  <Compass className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span>
                    GPS: {loc.latitude?.toFixed(4) ?? "53.4808"}, {loc.longitude?.toFixed(4) ?? "-2.2426"}
                  </span>
                  {loc.coverageText && (
                    <span className="ml-auto text-[10px] text-indigo-600 dark:text-indigo-400 font-sans font-medium truncate max-w-[180px]">
                      {loc.coverageText}
                    </span>
                  )}
                </div>

                {/* Description */}
                {loc.description && (
                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {loc.description}
                  </p>
                )}

                {/* Test Center */}
                <div className="mt-4 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/40 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                    <Target className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    Primary DVSA Test Center: {loc.testCenterName}
                  </div>
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
          );
        })}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl my-8">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Area / Zone Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. South Manchester & Didsbury"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Primary DVSA Test Center *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.testCenterName}
                    onChange={(e) => setForm({ ...form, testCenterName: e.target.value })}
                    placeholder="e.g. West Didsbury DTC"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Active Instructors
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
                    Latitude (GPS) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })}
                    placeholder="53.4808"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Longitude (GPS) *
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })}
                    placeholder="-2.2426"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Covered Postcodes (Comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={form.postcodesText}
                  onChange={(e) => setForm({ ...form, postcodesText: e.target.value })}
                  placeholder="e.g. M14, M19, M20, SK4"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Coverage Highlight / Tagline
                </label>
                <input
                  type="text"
                  value={form.coverageText}
                  onChange={(e) => setForm({ ...form, coverageText: e.target.value })}
                  placeholder="e.g. Grade A instructor dual-control lessons"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Area Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description of the driving environment, test routes, and typical routes practiced."
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Active &amp; Visible on Public Map
                  </span>
                </label>

                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Display Order:</label>
                  <input
                    type="number"
                    min={1}
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="w-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-2 py-1 text-xs text-center font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
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
