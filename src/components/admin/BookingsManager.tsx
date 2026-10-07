"use client";

import React, { useState } from "react";
import {
  CalendarCheck,
  Plus,
  MapPin,
  Trash2,
  X,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Car,
  Clock,
  Phone,
  Mail,
  FileSpreadsheet,
  User,
} from "lucide-react";
import { Booking, BookingStatus, Instructor, LessonPackage, TransmissionType } from "@/types";

interface BookingsManagerProps {
  initialBookings: Booking[];
  instructors?: Instructor[];
  lessons?: LessonPackage[];
}

export function BookingsManager({
  initialBookings,
  instructors = [],
  lessons = [],
}: BookingsManagerProps) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [transmissionFilter, setTransmissionFilter] = useState<string>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Booking form state
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    instructorId: instructors[0]?.id || "inst_01",
    instructorName: instructors[0]?.name || "David Miller",
    lessonTitle: lessons[0]?.title || "Standard 2-Hour Driving Lesson",
    transmission: "MANUAL" as TransmissionType,
    pickupLocation: "",
    dateTime: "",
    durationHours: 2,
    price: 75,
    notes: "",
    testCenter: "Cheetham Hill DTC",
  });

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCreateModal = () => {
    setForm({
      studentName: "",
      studentEmail: "",
      studentPhone: "+44 79",
      instructorId: instructors[0]?.id || "inst_01",
      instructorName: instructors[0]?.name || "David Miller",
      lessonTitle: lessons[0]?.title || "Standard 2-Hour Driving Lesson",
      transmission: "MANUAL",
      pickupLocation: "",
      dateTime: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      durationHours: 2,
      price: 75,
      notes: "",
      testCenter: "Cheetham Hill DTC",
    });
    setModalOpen(true);
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    setStatusUpdatingId(id);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update booking status");

      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      showNotification("success", `Booking marked as ${newStatus.replace("_", " ")}.`);
    } catch (err) {
      showNotification("error", err instanceof Error ? err.message : "Failed to update status.");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, studentName: string) => {
    if (!confirm(`Are you sure you want to cancel and remove booking for "${studentName}"?`)) return;

    try {
      const res = await fetch(`/api/admin/bookings?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete booking");

      setBookings((prev) => prev.filter((b) => b.id !== id));
      showNotification("success", "Booking deleted from dispatch schedule.");
    } catch (err) {
      showNotification("error", err instanceof Error ? err.message : "Failed to delete booking.");
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create booking");

      setBookings((prev) => [data.booking, ...prev]);
      setModalOpen(false);
      showNotification("success", `Booking created for ${data.booking.studentName}!`);
    } catch (err) {
      showNotification("error", err instanceof Error ? err.message : "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const matchesTransmission =
      transmissionFilter === "ALL" || b.transmission === transmissionFilter;

    return matchesSearch && matchesStatus && matchesTransmission;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-auto sm:min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student, email, instructor, or postcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:border-indigo-600 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Transmission Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={transmissionFilter}
              onChange={(e) => setTransmissionFilter(e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:border-indigo-600 focus:outline-none"
            >
              <option value="ALL">All Transmissions</option>
              <option value="MANUAL">Manual Only</option>
              <option value="AUTOMATIC">Automatic Only</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/api/admin/export?type=bookings";
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Export Bookings</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Booking</span>
          </button>
        </div>
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

      {/* Bookings Table Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 px-6 py-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Active Booking Dispatch List ({filteredBookings.length})
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live DB sync
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarCheck className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              No data available
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchQuery || statusFilter !== "ALL" || transmissionFilter !== "ALL"
                ? "No driving lessons match your search filters."
                : "No bookings have been scheduled yet. Click New Booking to dispatch the first lesson."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card List (Visible on mobile screens < md) */}
            <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition"
                >
                  {/* Top Header: Student info & Price */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {b.studentName}
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                          <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                          <a
                            href={`mailto:${b.studentEmail}`}
                            className="hover:underline truncate"
                          >
                            {b.studentEmail}
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1.5">
                          <Phone className="h-2.5 w-2.5 shrink-0" />
                          <a href={`tel:${b.studentPhone}`} className="hover:underline">
                            {b.studentPhone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-base text-slate-900 dark:text-white font-mono">
                        £{b.price}
                      </span>
                    </div>
                  </div>

                  {/* Lesson Details Box */}
                  <div className="rounded-xl bg-slate-50 dark:bg-slate-850 p-3 border border-slate-100 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">
                        {b.lessonTitle}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0 ${
                          b.transmission === "MANUAL"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                            : "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                        }`}
                      >
                        {b.transmission}
                      </span>
                    </div>

                    {b.testCenter && (
                      <div className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1">
                        <span>🎯</span>
                        <span>{b.testCenter}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                      {/* Assigned Instructor */}
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          <span className="font-semibold">{b.instructorName}</span>
                          <span className="text-[10px] text-slate-400 ml-1">(Assigned ADI)</span>
                        </span>
                      </div>

                      {/* Date & Time Slot */}
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>
                          {b.dateTime} ({b.durationHours}h)
                        </span>
                      </div>

                      {/* Pickup Location */}
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 sm:col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{b.pickupLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                        Status:
                      </span>
                      <select
                        disabled={statusUpdatingId === b.id}
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(b.id, e.target.value as BookingStatus)
                        }
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-bold border transition ${
                          b.status === "CONFIRMED"
                            ? "border-indigo-300 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
                            : b.status === "IN_PROGRESS"
                            ? "border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                            : b.status === "COMPLETED"
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                            : b.status === "CANCELLED"
                            ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                            : "border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                        }`}
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="PENDING">PENDING</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleDelete(b.id, b.studentName)}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-800 transition"
                      title="Cancel & Remove Booking"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Visible on md screens and above) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-xs">
                <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Student / Learner</th>
                    <th className="px-6 py-3.5">Lesson &amp; Transmission</th>
                    <th className="px-6 py-3.5">Assigned Instructor</th>
                    <th className="px-6 py-3.5">Date &amp; Time Slot</th>
                    <th className="px-6 py-3.5">Pickup Location</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                  {filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {b.studentName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {b.studentEmail}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="h-2.5 w-2.5" />
                          {b.studentPhone}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-slate-900 dark:text-white font-semibold">
                          {b.lessonTitle}
                        </div>
                        <div className="mt-1 flex items-center gap-1.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                              b.transmission === "MANUAL"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                : "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                            }`}
                          >
                            {b.transmission}
                          </span>
                          {b.testCenter && (
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                              🎯 {b.testCenter}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {b.instructorName}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          Assigned ADI
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">
                          {b.dateTime}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {b.durationHours} Hours Session
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                          <MapPin className="h-3 w-3 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate max-w-[150px]">
                            {b.pickupLocation}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">
                          £{b.price}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <select
                          disabled={statusUpdatingId === b.id}
                          value={b.status}
                          onChange={(e) =>
                            handleStatusChange(b.id, e.target.value as BookingStatus)
                          }
                          className={`rounded-lg px-2 py-1 text-[11px] font-bold border ${
                            b.status === "CONFIRMED"
                              ? "border-indigo-300 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
                              : b.status === "IN_PROGRESS"
                              ? "border-amber-300 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800"
                              : b.status === "COMPLETED"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                              : b.status === "CANCELLED"
                              ? "border-rose-300 bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                              : "border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                          }`}
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="PENDING">PENDING</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(b.id, b.studentName)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          title="Cancel & Remove Booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* New Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Schedule New Driving Lesson Dispatch
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.studentName}
                  onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={form.studentEmail}
                    onChange={(e) => setForm({ ...form, studentEmail: e.target.value })}
                    placeholder="student@example.com"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Student Phone
                  </label>
                  <input
                    type="tel"
                    value={form.studentPhone}
                    onChange={(e) => setForm({ ...form, studentPhone: e.target.value })}
                    placeholder="+44 7900 123456"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Instructor
                  </label>
                  <select
                    value={form.instructorName}
                    onChange={(e) => {
                      const selected = instructors.find((i) => i.name === e.target.value);
                      setForm({
                        ...form,
                        instructorName: e.target.value,
                        instructorId: selected?.id || "inst_01",
                      });
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    {instructors.length > 0 ? (
                      instructors.map((inst) => (
                        <option key={inst.id} value={inst.name}>
                          {inst.name} ({inst.grade || "Grade A ADI"})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="David Miller">David Miller</option>
                        <option value="Sarah Jenkins">Sarah Jenkins</option>
                        <option value="Tariq Ahmad">Tariq Ahmad</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Transmission
                  </label>
                  <select
                    value={form.transmission}
                    onChange={(e) =>
                      setForm({ ...form, transmission: e.target.value as TransmissionType })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="MANUAL">MANUAL (Dual-control)</option>
                    <option value="AUTOMATIC">AUTOMATIC (Dual-control)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Lesson Package / Type
                </label>
                <select
                  value={form.lessonTitle}
                  onChange={(e) => {
                    const selLesson = lessons.find((l) => l.title === e.target.value);
                    setForm({
                      ...form,
                      lessonTitle: e.target.value,
                      price: selLesson ? selLesson.price : form.price,
                      durationHours: selLesson ? selLesson.durationHours : form.durationHours,
                    });
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                >
                  {lessons.length > 0 ? (
                    lessons.map((l) => (
                      <option key={l.id} value={l.title}>
                        {l.title} (£{l.price} - {l.durationHours} hrs)
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Standard 2-Hour Driving Lesson">Standard 2-Hour Driving Lesson</option>
                      <option value="10-Hour Pass Fast Intensive Package">10-Hour Pass Fast Intensive Package</option>
                      <option value="DVSA Practical Test Day Package">DVSA Practical Test Day Package</option>
                      <option value="Motorway Confidence & Advanced Driving">Motorway Confidence &amp; Advanced Driving</option>
                    </>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Pickup Location / Postcode *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.pickupLocation}
                    onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                    placeholder="e.g. 42 High Street, N22 6YQ"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Target DVSA Test Center
                  </label>
                  <input
                    type="text"
                    value={form.testCenter}
                    onChange={(e) => setForm({ ...form, testCenter: e.target.value })}
                    placeholder="e.g. Cheetham Hill DTC"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Date &amp; Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.dateTime}
                    onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                    placeholder="e.g. 2026-10-04 10:00 AM"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Duration (Hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Price (£)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Instructor Notes / Learner Requests
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Focus on parallel parking and roundabout entry"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
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
                  {loading ? "Scheduling..." : "Confirm & Dispatch Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
