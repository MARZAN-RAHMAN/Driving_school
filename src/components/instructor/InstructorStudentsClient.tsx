"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  ChevronRight,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { Student, Instructor } from "@/types";

interface InstructorStudentsClientProps {
  students: Student[];
  instructor: Instructor;
}

export function InstructorStudentsClient({
  students,
  instructor,
}: InstructorStudentsClientProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesStatus =
        statusFilter === "ALL" || s.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.postcode.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [students, search, statusFilter]);

  const handleExport = () => {
    window.location.href = "/api/instructor/export?type=students";
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="h-6 w-6 text-emerald-600" />
            My Assigned Students
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Learners assigned directly to {instructor.name} ({instructor.badgeNumber}). Multi-tenant data isolation active.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition self-start sm:self-auto"
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Students (Excel)
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, email, or postcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {["ALL", "ACTIVE", "TEST_READY", "PASSED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Students Table / Grid */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400">
            <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
            <p className="mt-3 text-sm font-semibold">No assigned students match your filter</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting the search or status filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Learner Name</th>
                  <th className="px-4 py-3.5">Postcode / Area</th>
                  <th className="px-4 py-3.5">Hours Done</th>
                  <th className="px-4 py-3.5">Theory Test</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Test Details</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-850/50 transition cursor-pointer"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {student.email}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {student.postcode}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {student.hoursCompleted} hrs
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          student.theoryStatus === "PASSED"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : student.theoryStatus === "BOOKED"
                            ? "bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {student.theoryStatus}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          student.status === "TEST_READY"
                            ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                            : student.status === "PASSED"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                            : "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                        }`}
                      >
                        {student.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-[11px] text-slate-500">
                      {student.testDate || student.passDate || "No test scheduled"}
                    </td>

                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${student.phone}`}
                          title={`Call ${student.name}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-800 transition"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${student.email}`}
                          title={`Email ${student.name}`}
                          className="rounded-lg p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-800 transition"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => setSelectedStudent(student)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
                        >
                          Profile
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

      {/* Student Details Slide-Over Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedStudent(null)}
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 p-6 shadow-2xl overflow-y-auto space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Learner Profile
                  </h3>
                  <p className="text-xs text-slate-500">NextDrive Student Record</p>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Student Header */}
              <div className="flex items-center gap-4 rounded-xl bg-slate-50 dark:bg-slate-850 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-base font-bold text-white shadow-xs">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {selectedStudent.name}
                  </p>
                  <span
                    className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      selectedStudent.status === "TEST_READY"
                        ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                        : selectedStudent.status === "PASSED"
                        ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                        : "bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300"
                    }`}
                  >
                    {selectedStudent.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Contact Information
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Telephone:</span>
                  <a
                    href={`tel:${selectedStudent.phone}`}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    {selectedStudent.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Email:</span>
                  <a
                    href={`mailto:${selectedStudent.email}`}
                    className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                  >
                    <Mail className="h-3 w-3" />
                    {selectedStudent.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Postcode:</span>
                  <span className="font-semibold text-slate-900 dark:text-white font-mono">
                    {selectedStudent.postcode}
                  </span>
                </div>
              </div>

              {/* DVSA Syllabus & Licensing */}
              <div className="space-y-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 text-xs">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  DVSA Training & Licence
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Hours Completed:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedStudent.hoursCompleted} hours
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Theory Test:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedStudent.theoryStatus}
                  </span>
                </div>
                {selectedStudent.provisionalLicenseNumber && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Provisional Licence:</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {selectedStudent.provisionalLicenseNumber}
                    </span>
                  </div>
                )}
                {selectedStudent.testDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Practical Test Date:</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {selectedStudent.testDate}
                    </span>
                  </div>
                )}
              </div>

              {/* Internal Tuition Notes */}
              {selectedStudent.notes && (
                <div className="space-y-2 rounded-xl bg-slate-50 dark:bg-slate-850 p-4 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Internal Tuition Notes
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedStudent.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`tel:${selectedStudent.phone}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Call Student
                </a>
                <a
                  href={`mailto:${selectedStudent.email}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
