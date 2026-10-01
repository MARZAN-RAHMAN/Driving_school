"use client";

import React, { useState } from "react";
import {
  Plus,
  Star,
  Phone,
  Mail,
  Edit2,
  Trash2,
  X,
  Car,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Instructor, TransmissionType } from "@/types";

interface InstructorsManagerProps {
  initialInstructors: Instructor[];
}

export function InstructorsManager({ initialInstructors }: InstructorsManagerProps) {
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState({
    name: "",
    badgeNumber: "ADI-",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces",
    phone: "+44 7700 900",
    email: "@nextdrive.uk",
    transmission: "BOTH" as TransmissionType | "BOTH",
    rating: 4.9,
    totalPasses: 100,
    activeStudents: 10,
    status: "ACTIVE" as Instructor["status"],
    vehicle: "2025 VW Golf 1.5 TSI (Dual Controls)",
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      name: "",
      badgeNumber: "ADI-",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=faces",
      phone: "+44 7700 900123",
      email: "new.instructor@nextdrive.uk",
      transmission: "BOTH",
      rating: 5.0,
      totalPasses: 50,
      activeStudents: 8,
      status: "ACTIVE",
      vehicle: "2025 Dual-Control Modern Vehicle",
    });
    setModalOpen(true);
  };

  const openEditModal = (inst: Instructor) => {
    setEditingId(inst.id);
    setForm({
      name: inst.name,
      badgeNumber: inst.badgeNumber,
      avatar: inst.avatar,
      phone: inst.phone,
      email: inst.email,
      transmission: inst.transmission,
      rating: inst.rating,
      totalPasses: inst.totalPasses,
      activeStudents: inst.activeStudents,
      status: inst.status,
      vehicle: inst.vehicle,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      if (editingId) {
        const res = await fetch("/api/admin/instructors", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            ...form,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update instructor");

        setInstructors((prev) =>
          prev.map((i) => (i.id === editingId ? data.instructor : i))
        );
        setNotification({ type: "success", text: "Instructor details updated successfully." });
      } else {
        const res = await fetch("/api/admin/instructors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to register instructor");

        setInstructors((prev) => [...prev, data.instructor]);
        setNotification({ type: "success", text: "New ADI instructor registered to fleet!" });
      }

      setModalOpen(false);
      setTimeout(() => setNotification(null), 3500);
    } catch (err) {
      setNotification({
        type: "error",
        text: err instanceof Error ? err.message : "Error saving instructor.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the active fleet?`)) return;

    try {
      const res = await fetch(`/api/admin/instructors?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInstructors((prev) => prev.filter((i) => i.id !== id));
        setNotification({ type: "success", text: "Instructor removed successfully." });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification({ type: "error", text: "Failed to remove instructor." });
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
          <span>Register ADI Instructor</span>
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

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {instructors.map((inst) => (
          <div
            key={inst.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs transition hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={inst.avatar}
                      alt={inst.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-indigo-50 dark:ring-indigo-950/60"
                    />
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{inst.name}</h3>
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                      {inst.badgeNumber}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 rounded-md bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-300 font-mono">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{inst.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Vehicle & Transmission */}
              <div className="mt-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Transmission</span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                      inst.transmission === "MANUAL"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        : inst.transmission === "AUTOMATIC"
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    }`}
                  >
                    {inst.transmission === "BOTH" ? "Dual (Manual & Auto)" : inst.transmission}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Car className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{inst.vehicle}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-4 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`tel:${inst.phone}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                    {inst.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a href={`mailto:${inst.email}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                    {inst.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Performance Stats & Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Passes</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{inst.totalPasses}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Students</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{inst.activeStudents}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(inst)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  title="Edit Instructor"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(inst.id, inst.name)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                  title="Remove Instructor"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
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
                <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingId ? "Edit ADI Instructor Profile" : "Register Approved Driving Instructor (ADI)"}
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Liam O'Connor"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    DVSA ADI Badge #
                  </label>
                  <input
                    type="text"
                    required
                    value={form.badgeNumber}
                    onChange={(e) => setForm({ ...form, badgeNumber: e.target.value })}
                    placeholder="e.g. ADI-51004"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +44 7700 900654"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Instructor Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. liam@nextdrive.uk"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Transmission
                  </label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value as Instructor["transmission"] })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="BOTH">Dual (Manual &amp; Auto)</option>
                    <option value="MANUAL">Manual Only</option>
                    <option value="AUTOMATIC">Automatic Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Duty Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Instructor["status"] })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (On Road)</option>
                    <option value="ON_LEAVE">ON LEAVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Vehicle Model (Dual Controls)
                </label>
                <input
                  type="text"
                  required
                  value={form.vehicle}
                  onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
                  placeholder="e.g. 2025 VW Golf 1.5 TSI (Dual Controls)"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
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
                  {loading ? "Saving..." : editingId ? "Update ADI" : "Register ADI"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
