"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  FileSpreadsheet,
} from "lucide-react";
import { Student, StudentStatus, TheoryStatus, Instructor, Booking } from "@/types";

interface CustomersManagerProps {
  initialStudents: Student[];
  instructors?: Instructor[];
  allBookings?: Booking[];
}

export function CustomersManager({
  initialStudents,
  instructors = [],
  allBookings = [],
}: CustomersManagerProps) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [theoryFilter, setTheoryFilter] = useState<string>("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingBookingsStudent, setViewingBookingsStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    postcode: string;
    theoryStatus: TheoryStatus;
    hoursCompleted: number;
    assignedInstructorId: string;
    assignedInstructorName: string;
    status: StudentStatus;
    testDate: string;
    provisionalLicenseNumber: string;
    notes: string;
  }>({
    name: "",
    email: "",
    phone: "+44 79",
    postcode: "London",
    theoryStatus: "STUDYING",
    hoursCompleted: 0,
    assignedInstructorId: instructors[0]?.id || "inst_01",
    assignedInstructorName: instructors[0]?.name || "David Miller",
    status: "ACTIVE",
    testDate: "",
    provisionalLicenseNumber: "",
    notes: "",
  });

  const showNotification = (type: "success" | "error", text: string) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenEnrollModal = () => {
    setEditingStudent(null);
    setForm({
      name: "",
      email: "",
      phone: "+44 79",
      postcode: "London",
      theoryStatus: "STUDYING",
      hoursCompleted: 0,
      assignedInstructorId: instructors[0]?.id || "inst_01",
      assignedInstructorName: instructors[0]?.name || "David Miller",
      status: "ACTIVE",
      testDate: "",
      provisionalLicenseNumber: "",
      notes: "",
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (s: Student) => {
    setEditingStudent(s);
    setForm({
      name: s.name,
      email: s.email,
      phone: s.phone,
      postcode: s.postcode || "London",
      theoryStatus: s.theoryStatus,
      hoursCompleted: s.hoursCompleted,
      assignedInstructorId: s.assignedInstructorId || "inst_01",
      assignedInstructorName: s.assignedInstructorName || "Dave Miller",
      status: s.status,
      testDate: s.testDate || "",
      provisionalLicenseNumber: s.provisionalLicenseNumber || "",
      notes: s.notes || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingStudent) {
        const res = await fetch("/api/admin/students", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingStudent.id,
            ...form,
            hoursCompleted: Number(form.hoursCompleted),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update student profile");

        setStudents((prev) =>
          prev.map((s) => (s.id === editingStudent.id ? data.student : s))
        );
        showNotification("success", `Student profile for ${data.student.name} updated.`);
      } else {
        const res = await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            hoursCompleted: Number(form.hoursCompleted),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to enroll student");

        setStudents((prev) => [data.student, ...prev]);
        showNotification("success", `New learner driver ${data.student.name} enrolled!`);
      }
      setModalOpen(false);
    } catch (err) {
      showNotification("error", err instanceof Error ? err.message : "Error saving student profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove learner record for "${name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/students?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete student");

      setStudents((prev) => prev.filter((s) => s.id !== id));
      showNotification("success", "Student record deleted successfully.");
    } catch (err) {
      showNotification("error", err instanceof Error ? err.message : "Failed to delete student.");
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.assignedInstructorName ? s.assignedInstructorName.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (s.postcode && s.postcode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesTheory = theoryFilter === "ALL" || s.theoryStatus === theoryFilter;

    return matchesSearch && matchesStatus && matchesTheory;
  });

  const activeCount = students.filter((s) => s.status === "ACTIVE").length;

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, email, phone, postcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:border-indigo-600 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active Lessons</option>
              <option value="TEST_READY">Test Ready</option>
              <option value="PASSED">Passed</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <select
            value={theoryFilter}
            onChange={(e) => setTheoryFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:border-indigo-600 focus:outline-none"
          >
            <option value="ALL">All Theory Statuses</option>
            <option value="PASSED">Theory Passed</option>
            <option value="BOOKED">Theory Booked</option>
            <option value="STUDYING">Studying</option>
            <option value="FAILED">Theory Failed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => (window.location.href = "/api/admin/export?type=students")}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Export to Excel</span>
          </button>

          <button
            onClick={handleOpenEnrollModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            <span>Enroll Student</span>
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

      {/* Students Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 px-6 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Enrolled Learner Roster ({activeCount} Active of {students.length} Total)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live DB sync
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">
              No data available
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchQuery || statusFilter !== "ALL" || theoryFilter !== "ALL"
                ? "No learner drivers match your search filters."
                : "No student records found in the database. Click Enroll Student to register a learner."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Student / Learner</th>
                  <th className="px-6 py-3.5">Assigned Instructor</th>
                  <th className="px-6 py-3.5">Theory Status</th>
                  <th className="px-6 py-3.5">Lesson Hours</th>
                  <th className="px-6 py-3.5">Syllabus Progress</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{s.name}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {s.email}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono flex items-center gap-1">
                        <Phone className="h-2.5 w-2.5" />
                        {s.phone}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                      {s.assignedInstructorName}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          s.theoryStatus === "PASSED"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                            : s.theoryStatus === "BOOKED"
                            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300"
                            : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                        }`}
                      >
                        {s.theoryStatus === "PASSED" && <CheckCircle2 className="h-3 w-3" />}
                        {s.theoryStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        {s.hoursCompleted} hrs
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-28">
                        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                          <span>{Math.min(100, Math.round((s.hoursCompleted / 30) * 100))}%</span>
                          <span>30h target</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full"
                            style={{
                              width: `${Math.min(100, Math.round((s.hoursCompleted / 30) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          s.status === "PASSED"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 ring-1 ring-emerald-600/20"
                            : s.status === "TEST_READY"
                            ? "bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 ring-1 ring-purple-600/20"
                            : s.status === "ACTIVE"
                            ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 ring-1 ring-indigo-600/20"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {s.status === "PASSED"
                          ? `🎉 Passed (${s.passDate || "Official DVSA"})`
                          : s.status === "TEST_READY"
                          ? `🎯 Ready (${s.testDate || "Booked"})`
                          : s.status === "ACTIVE"
                          ? "Active Lessons"
                          : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewingBookingsStudent(s)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                          title="View Student Bookings"
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-850"
                          title="Edit Student"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Student Record"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Student Bookings Modal */}
      {viewingBookingsStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Bookings for {viewingBookingsStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500">{viewingBookingsStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingBookingsStudent(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {allBookings.filter(
                (b) =>
                  b.studentEmail.toLowerCase() === viewingBookingsStudent.email.toLowerCase() ||
                  b.studentName.toLowerCase() === viewingBookingsStudent.name.toLowerCase()
              ).length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No bookings found for this student.
                </div>
              ) : (
                allBookings
                  .filter(
                    (b) =>
                      b.studentEmail.toLowerCase() === viewingBookingsStudent.email.toLowerCase() ||
                      b.studentName.toLowerCase() === viewingBookingsStudent.name.toLowerCase()
                  )
                  .map((b) => (
                    <div
                      key={b.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 text-xs bg-slate-50/50 dark:bg-slate-850/50 flex items-start justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{b.lessonTitle}</div>
                        <div className="text-slate-500 dark:text-slate-400 mt-1">
                          📅 {b.dateTime} ({b.durationHours}h) • Instructor: {b.instructorName}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                          📍 {b.pickupLocation}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          b.status === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : b.status === "CONFIRMED"
                            ? "bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                  ))
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewingBookingsStudent(null)}
                className="rounded-lg bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll / Edit Student Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {editingStudent ? "Edit Learner Profile" : "Enroll New Learner Driver"}
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
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="learner@student.nextdrive.uk"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+44 7911 000000"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Assigned Instructor
                  </label>
                  <select
                    value={form.assignedInstructorName}
                    onChange={(e) => {
                      const selected = instructors.find((i) => i.name === e.target.value);
                      setForm({
                        ...form,
                        assignedInstructorName: e.target.value,
                        assignedInstructorId: selected?.id || "inst_01",
                      });
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.name}>
                        {inst.name} ({inst.grade || "Grade A ADI"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Postcode / Area
                  </label>
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                    placeholder="e.g. N22, London"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Theory Status
                  </label>
                  <select
                    value={form.theoryStatus}
                    onChange={(e) =>
                      setForm({ ...form, theoryStatus: e.target.value as TheoryStatus })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="STUDYING">STUDYING</option>
                    <option value="BOOKED">BOOKED</option>
                    <option value="PASSED">PASSED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Hours Completed
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.hoursCompleted}
                    onChange={(e) =>
                      setForm({ ...form, hoursCompleted: Number(e.target.value) })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Overall Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value as StudentStatus })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="TEST_READY">TEST READY</option>
                    <option value="PASSED">PASSED</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    DVSA Practical Test Date (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.testDate}
                    onChange={(e) => setForm({ ...form, testDate: e.target.value })}
                    placeholder="e.g. 2026-11-15 at Wood Green"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Provisional License No.
                  </label>
                  <input
                    type="text"
                    value={form.provisionalLicenseNumber}
                    onChange={(e) => setForm({ ...form, provisionalLicenseNumber: e.target.value })}
                    placeholder="e.g. MORGA901234AB99"
                    className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs text-slate-900 dark:text-white focus:border-indigo-600 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Instructor Notes / Learning Log
                </label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Notes on maneuvers, roundabouts, mock test scores..."
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
                  {loading ? "Saving..." : editingStudent ? "Update Student" : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
