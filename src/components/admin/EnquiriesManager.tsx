"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Car,
  Compass,
  FileText,
  Lock,
  X,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  Save,
  Loader2,
  ArrowUpDown,
  Tag,
  Check,
  FileSpreadsheet,
  UserPlus,
} from "lucide-react";
import { ContactInquiry, InquiryStatus, ProvisionalLicenceStatus } from "@/types";

interface EnquiriesManagerProps {
  initialInquiries: ContactInquiry[];
  availableCourses?: string[];
  availableAreas?: string[];
}

function EnquiriesManagerContent({
  initialInquiries,
  availableCourses = [],
  availableAreas = [],
}: EnquiriesManagerProps) {
  const searchParams = useSearchParams();
  const initialStatusParam = searchParams.get("status") || "ALL";

  const [inquiries, setInquiries] = useState<ContactInquiry[]>(initialInquiries);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusParam);
  const [courseFilter, setCourseFilter] = useState<string>("ALL");
  const [areaFilter, setAreaFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);

  // Drawer / Internal Notes Editor State
  const [internalNotesInput, setInternalNotesInput] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [drawerStatus, setDrawerStatus] = useState<InquiryStatus>("NEW");
  const [drawerNotice, setDrawerNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Global notification
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleConvertToStudent = async () => {
    if (!selectedInquiry) return;
    setIsConverting(true);
    setDrawerNotice(null);

    try {
      const res = await fetch("/api/admin/leads/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: selectedInquiry.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to convert lead.");

      const updated = {
        ...selectedInquiry,
        status: "CONVERTED" as InquiryStatus,
        internalNotes: (selectedInquiry.internalNotes ? selectedInquiry.internalNotes + " | " : "") + `Converted to Student [${data.student?.id || "enrolled"}]`,
      };

      setInquiries((prev) =>
        prev.map((i) => (i.id === selectedInquiry.id ? updated : i))
      );
      setSelectedInquiry(updated);
      setDrawerStatus("CONVERTED");
      setDrawerNotice({
        type: "success",
        text: `Lead converted! Registered student record created for ${data.student?.name || selectedInquiry.name}.`,
      });
    } catch (err) {
      setDrawerNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to convert lead to student.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  // Sync selected inquiry notes when selection changes without cascading effect
  const [prevSelectedId, setPrevSelectedId] = useState<string | null>(null);
  if (selectedInquiry && selectedInquiry.id !== prevSelectedId) {
    setPrevSelectedId(selectedInquiry.id);
    setInternalNotesInput(selectedInquiry.internalNotes || "");
    setDrawerStatus(selectedInquiry.status);
    setDrawerNotice(null);
  } else if (!selectedInquiry && prevSelectedId !== null) {
    setPrevSelectedId(null);
  }

  // Status counts
  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === "NEW").length,
      contacted: inquiries.filter((i) => i.status === "CONTACTED").length,
      followUp: inquiries.filter((i) => i.status === "FOLLOW_UP").length,
      converted: inquiries.filter((i) => i.status === "CONVERTED" || i.status === "BOOKED").length,
      closed: inquiries.filter((i) => i.status === "CLOSED" || i.status === "ARCHIVED" || i.status === "RESOLVED").length,
    };
  }, [inquiries]);

  // Dynamic courses list
  const coursesList = useMemo(() => {
    const set = new Set<string>(availableCourses);
    inquiries.forEach((i) => {
      if (i.course) set.add(i.course);
      if (i.targetPackage) set.add(i.targetPackage);
    });
    return Array.from(set).filter(Boolean);
  }, [availableCourses, inquiries]);

  // Dynamic areas list
  const areasList = useMemo(() => {
    const set = new Set<string>(availableAreas);
    inquiries.forEach((i) => {
      if (i.area) set.add(i.area);
    });
    return Array.from(set).filter(Boolean);
  }, [availableAreas, inquiries]);

  // Filtered & Sorted Inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        // Status filter
        if (statusFilter !== "ALL") {
          if (statusFilter === "CONVERTED") {
            if (inq.status !== "CONVERTED" && inq.status !== "BOOKED") return false;
          } else if (statusFilter === "CLOSED") {
            if (inq.status !== "CLOSED" && inq.status !== "ARCHIVED" && inq.status !== "RESOLVED") return false;
          } else if (inq.status !== statusFilter) {
            return false;
          }
        }

        // Course filter
        if (courseFilter !== "ALL") {
          const leadCourse = inq.course || inq.targetPackage;
          if (leadCourse !== courseFilter) return false;
        }

        // Area filter
        if (areaFilter !== "ALL") {
          if (inq.area !== areaFilter) return false;
        }

        // Query search
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matches =
            inq.name.toLowerCase().includes(q) ||
            inq.email.toLowerCase().includes(q) ||
            inq.phone.toLowerCase().includes(q) ||
            inq.postcode.toLowerCase().includes(q) ||
            (inq.course && inq.course.toLowerCase().includes(q)) ||
            (inq.area && inq.area.toLowerCase().includes(q)) ||
            (inq.internalNotes && inq.internalNotes.toLowerCase().includes(q)) ||
            (inq.notes && inq.notes.toLowerCase().includes(q));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.createdAt).getTime() || 0;
        const timeB = new Date(b.createdAt).getTime() || 0;
        return sortOrder === "oldest" ? timeA - timeB : timeB - timeA;
      });
  }, [inquiries, statusFilter, courseFilter, areaFilter, searchQuery, sortOrder]);

  // Handle status update
  const handleUpdateStatus = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
        );
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
          setDrawerStatus(newStatus);
        }
        setNotification({
          type: "success",
          text: `Lead status updated to ${newStatus}.`,
        });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification({ type: "error", text: "Failed to update status." });
    }
  };

  // Handle saving internal notes
  const handleSaveInternalNotes = async () => {
    if (!selectedInquiry) return;
    setIsSavingNotes(true);
    setDrawerNotice(null);

    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedInquiry.id,
          internalNotes: internalNotesInput,
          status: drawerStatus,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedInquiry = data.inquiry || {
          ...selectedInquiry,
          internalNotes: internalNotesInput,
          status: drawerStatus,
        };

        setInquiries((prev) =>
          prev.map((i) => (i.id === selectedInquiry.id ? updatedInquiry : i))
        );
        setSelectedInquiry(updatedInquiry);
        setDrawerNotice({ type: "success", text: "Internal notes and status saved successfully." });
        setTimeout(() => setDrawerNotice(null), 3000);
      } else {
        throw new Error("Failed to save changes.");
      }
    } catch (err) {
      setDrawerNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to save internal notes.",
      });
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle delete inquiry
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the lead enquiry from ${name}?`)) return;

    try {
      const res = await fetch(`/api/admin/enquiries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (selectedInquiry?.id === id) setSelectedInquiry(null);
        setNotification({ type: "success", text: "Enquiry deleted successfully." });
        setTimeout(() => setNotification(null), 3000);
      }
    } catch {
      setNotification({ type: "error", text: "Failed to delete enquiry." });
    }
  };

  const getStatusBadgeClass = (status: InquiryStatus) => {
    switch (status) {
      case "NEW":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900";
      case "CONTACTED":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900";
      case "FOLLOW_UP":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900";
      case "CONVERTED":
      case "BOOKED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900";
      case "CLOSED":
      case "ARCHIVED":
      case "RESOLVED":
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Status Tabs & Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === "ALL"
                ? "bg-slate-900 text-white dark:bg-indigo-600 shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            All Leads ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter("NEW")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              statusFilter === "NEW"
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-slate-200/80 dark:border-slate-800 hover:bg-rose-50/50"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            New Leads ({counts.new})
          </button>
          <button
            onClick={() => setStatusFilter("CONTACTED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === "CONTACTED"
                ? "bg-amber-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 border border-slate-200/80 dark:border-slate-800 hover:bg-amber-50/50"
            }`}
          >
            Contacted ({counts.contacted})
          </button>
          <button
            onClick={() => setStatusFilter("FOLLOW_UP")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === "FOLLOW_UP"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 border border-slate-200/80 dark:border-slate-800 hover:bg-blue-50/50"
            }`}
          >
            Follow Up ({counts.followUp})
          </button>
          <button
            onClick={() => setStatusFilter("CONVERTED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === "CONVERTED"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 border border-slate-200/80 dark:border-slate-800 hover:bg-emerald-50/50"
            }`}
          >
            Converted ({counts.converted})
          </button>
          <button
            onClick={() => setStatusFilter("CLOSED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === "CLOSED"
                ? "bg-slate-700 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50"
            }`}
          >
            Closed / Archived ({counts.closed})
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = "/api/admin/export?type=leads";
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Export Leads (Excel)</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xs lg:grid-cols-12 lg:items-center">
        {/* Search */}
        <div className="relative lg:col-span-5">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, phone, email, postcode, notes..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-indigo-600 focus:outline-hidden"
          />
        </div>

        {/* Filter by Course */}
        <div className="lg:col-span-3">
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:border-indigo-600 focus:outline-hidden"
          >
            <option value="ALL">All Courses ({coursesList.length})</option>
            {coursesList.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Area */}
        <div className="lg:col-span-2">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:border-indigo-600 focus:outline-hidden"
          >
            <option value="ALL">All Areas</option>
            {areasList.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="lg:col-span-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
            className="inline-flex items-center gap-1.5 w-full justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <span>{sortOrder === "newest" ? "Newest First" : "Oldest First"}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`flex items-center gap-2 rounded-xl p-3 text-xs font-semibold ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
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

      {/* Main Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4 bg-slate-50/50 dark:bg-slate-850/50">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Student Leads &amp; Enquiries ({filteredInquiries.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {sortOrder === "newest" ? "Sorted by Newest" : "Sorted by Oldest"}
          </span>
        </div>

        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">
            No leads matching current filters or search terms.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3.5">Student Contact</th>
                  <th className="px-5 py-3.5">Course &amp; Area</th>
                  <th className="px-5 py-3.5">Postcode &amp; Licence</th>
                  <th className="px-5 py-3.5">Source &amp; Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                {filteredInquiries.map((inq) => {
                  const leadCourse = inq.course || inq.targetPackage || "Driving Lessons";
                  const hasInternalNotes = !!inq.internalNotes;

                  return (
                    <tr
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className="hover:bg-indigo-50/30 dark:hover:bg-slate-850/60 transition cursor-pointer group"
                    >
                      {/* Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                            {inq.name}
                          </span>
                          {hasInternalNotes && (
                            <span
                              title="Contains private internal notes"
                              className="inline-flex items-center text-indigo-600 dark:text-indigo-400"
                            >
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <Phone className="h-3 w-3 shrink-0 text-slate-400" />
                          <a
                            href={`tel:${inq.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline font-mono text-[11px]"
                          >
                            {inq.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <Mail className="h-3 w-3 shrink-0 text-slate-400" />
                          <a
                            href={`mailto:${inq.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:underline text-[11px]"
                          >
                            {inq.email}
                          </a>
                        </div>
                      </td>

                      {/* Course & Area */}
                      <td className="px-5 py-4 max-w-[200px]">
                        <div className="font-semibold text-slate-900 dark:text-white truncate" title={leadCourse}>
                          {leadCourse}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {inq.area || "London Wide"}
                        </div>
                        <span
                          className={`inline-flex items-center rounded px-1.5 py-0.2 text-[9px] font-bold mt-1 ${
                            inq.transmission === "AUTOMATIC"
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                              : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                          }`}
                        >
                          {inq.transmission || "MANUAL"}
                        </span>
                      </td>

                      {/* Postcode & Provisional */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-slate-900 dark:text-white">
                          {inq.postcode}
                        </div>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                              inq.provisionalLicence === "Yes"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-500/20"
                                : inq.provisionalLicence === "Applying soon"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-500/20"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            Licence: {inq.provisionalLicence || "Not set"}
                          </span>
                        </div>
                      </td>

                      {/* Source & Date */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300">
                          <Compass className="w-3 h-3 text-indigo-500 shrink-0" />
                          <span>{inq.howFound || "Website"}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {inq.createdAt}
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            handleUpdateStatus(inq.id, e.target.value as InquiryStatus)
                          }
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition focus:outline-hidden ${getStatusBadgeClass(
                            inq.status
                          )}`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="FOLLOW_UP">FOLLOW UP</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInquiry(inq)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400 transition"
                            title="View Full Lead Details & Notes"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id, inq.name)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition"
                            title="Delete Lead"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* LEAD DETAILS & INTERNAL NOTES DRAWER / MODAL */}
      {/* ========================================================================= */}
      {selectedInquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSavingNotes) {
              setSelectedInquiry(null);
            }
          }}
        >
          <div className="relative w-full max-w-2xl bg-card text-card-foreground border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Drawer Header */}
            <div className="flex items-start justify-between p-5 border-b border-border bg-muted/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(
                      selectedInquiry.status
                    )}`}
                  >
                    {selectedInquiry.status}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    ID: {selectedInquiry.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {selectedInquiry.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Submitted {selectedInquiry.createdAt}
                </p>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6">
              {drawerNotice && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    drawerNotice.type === "success"
                      ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{drawerNotice.text}</span>
                </div>
              )}

              {/* Direct Actions: Call & Email */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 font-semibold text-xs border border-indigo-200/60 dark:border-indigo-800 transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedInquiry.phone}</span>
                </a>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Student</span>
                </a>
              </div>

              {/* Lead Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/30 border border-border text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Selected Driving Course:</span>
                  <span className="font-bold text-foreground text-sm mt-0.5 block">
                    {selectedInquiry.course || selectedInquiry.targetPackage || "Driving Lessons"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Preferred Area &amp; Postcode:</span>
                  <span className="font-bold text-foreground text-sm mt-0.5 block font-mono">
                    {selectedInquiry.area || "London Wide"} ({selectedInquiry.postcode})
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Provisional Licence:</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {selectedInquiry.provisionalLicence || "Not specified"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Transmission Preference:</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {selectedInquiry.transmission || "Manual"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">How did they find us?</span>
                  <span className="font-semibold text-foreground mt-0.5 block">
                    {selectedInquiry.howFound || "Direct / Website"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">Source Page / Referrer:</span>
                  <span className="font-mono text-foreground mt-0.5 block truncate" title={selectedInquiry.sourcePage}>
                    {selectedInquiry.sourcePage || "/"}
                  </span>
                </div>

                {(selectedInquiry.utmSource || selectedInquiry.utmCampaign) && (
                  <div className="sm:col-span-2 pt-2 border-t border-border">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                      Marketing Attribution (UTM):
                    </span>
                    <span className="font-mono text-[11px] text-foreground mt-0.5 block">
                      {selectedInquiry.utmSource ? `Source: ${selectedInquiry.utmSource} ` : ""}
                      {selectedInquiry.utmMedium ? `| Medium: ${selectedInquiry.utmMedium} ` : ""}
                      {selectedInquiry.utmCampaign ? `| Campaign: ${selectedInquiry.utmCampaign}` : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Student Message */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Student Message / Additional Information:
                </h4>
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border text-xs text-foreground leading-relaxed italic">
                  {selectedInquiry.notes || selectedInquiry.message || "No additional notes submitted by the student."}
                </div>
              </div>

              {/* Private Internal Admin Notes */}
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                    <Lock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Private Internal Notes</span>
                  </div>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Hidden from students &amp; public
                  </span>
                </div>

                <textarea
                  rows={3}
                  value={internalNotesInput}
                  onChange={(e) => setInternalNotesInput(e.target.value)}
                  placeholder="Add private staff notes here (e.g., 'Called 01/10 - confirmed student has provisional licence, wants manual lessons on weekends with Mark Davies')..."
                  className="w-full p-2.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary resize-y"
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-foreground">Update Status:</label>
                    <select
                      value={drawerStatus}
                      onChange={(e) => setDrawerStatus(e.target.value as InquiryStatus)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold border focus:outline-hidden ${getStatusBadgeClass(
                        drawerStatus
                      )}`}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="FOLLOW_UP">FOLLOW UP</option>
                      <option value="CONVERTED">CONVERTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveInternalNotes}
                    disabled={isSavingNotes}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition disabled:opacity-50"
                  >
                    {isSavingNotes ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Internal Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Convert Lead to Registered Student Action */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    <UserPlus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Convert to Registered Student</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Creates an active student account in the system and links all contact info.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleConvertToStudent}
                  disabled={isConverting || selectedInquiry.status === "CONVERTED"}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition disabled:opacity-50"
                >
                  {isConverting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{selectedInquiry.status === "CONVERTED" ? "Already Converted" : "Convert Now"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
              <button
                type="button"
                onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="py-2 px-4 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-muted/60 transition"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function EnquiriesManager(props: EnquiriesManagerProps) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-foreground">
          Loading leads &amp; enquiries manager...
        </div>
      }
    >
      <EnquiriesManagerContent {...props} />
    </Suspense>
  );
}
