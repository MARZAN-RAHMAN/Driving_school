"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Copy,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Search,
  X,
  Eye,
  EyeOff,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { FAQItem } from "@/types";

interface FaqsManagerProps {
  initialFaqs: FAQItem[];
}

const DEFAULT_CATEGORIES = ["Lessons", "Vehicles", "Bookings", "Test Day", "Safety"];

type ModalMode = "create" | "edit" | "duplicate";

interface FormState {
  id?: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: "ACTIVE" | "INACTIVE";
}

export function FaqsManager({ initialFaqs }: FaqsManagerProps) {
  // FAQs list state
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState<FormState>({
    question: "",
    answer: "",
    category: "Lessons",
    order: 10,
    status: "ACTIVE",
  });
  const [initialFormState, setInitialFormState] = useState<FormState | null>(null);
  const [formErrors, setFormErrors] = useState<{ question?: string; answer?: string }>({});

  // Loading & Notifications
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Unsaved Changes Confirmation Modal
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Delete Confirmation Modal
  const [faqToDelete, setFaqToDelete] = useState<FAQItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal dialog ref
  const questionInputRef = useRef<HTMLInputElement>(null);

  // Extract all categories available in the data
  const allCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  // Show temporary toast notification
  const showToast = (text: string, type: "success" | "error" = "success") => {
    setNotification({ type, text });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Check if form has unsaved changes compared to initial state
  const hasUnsavedChanges = useMemo(() => {
    if (!initialFormState) return false;
    return (
      form.question !== initialFormState.question ||
      form.answer !== initialFormState.answer ||
      form.category !== initialFormState.category ||
      form.order !== initialFormState.order ||
      form.status !== initialFormState.status
    );
  }, [form, initialFormState]);

  // Close attempt with unsaved changes verification
  const handleAttemptCloseModal = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
    } else {
      setIsModalOpen(false);
      setFormErrors({});
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    setIsModalOpen(false);
    setFormErrors({});
  };

  // Focus trap / ESC key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (faqToDelete) {
          setFaqToDelete(null);
        } else if (showDiscardConfirm) {
          setShowDiscardConfirm(false);
        } else if (isModalOpen) {
          handleAttemptCloseModal();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, hasUnsavedChanges, showDiscardConfirm, faqToDelete]);

  // Auto focus first input when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => {
        questionInputRef.current?.focus();
      }, 50);
    }
  }, [isModalOpen]);

  // -------------------------------------------------------------
  // Open Modal Actions
  // -------------------------------------------------------------
  const handleOpenCreate = () => {
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.order || 0)) + 1 : 1;
    const initialState: FormState = {
      question: "",
      answer: "",
      category: selectedCategory !== "ALL" ? selectedCategory : "Lessons",
      order: maxOrder,
      status: "ACTIVE",
    };
    setForm(initialState);
    setInitialFormState(initialState);
    setFormErrors({});
    setModalMode("create");
    setActiveFaqId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: FAQItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const initialState: FormState = {
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "Lessons",
      order: faq.order || 1,
      status: faq.status || "ACTIVE",
    };
    setForm(initialState);
    setInitialFormState(initialState);
    setFormErrors({});
    setModalMode("edit");
    setActiveFaqId(faq.id);
    setIsModalOpen(true);
  };

  const handleOpenDuplicate = (faq: FAQItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.order || 0)) + 1 : 1;
    const initialState: FormState = {
      question: `${faq.question} (Copy)`,
      answer: faq.answer,
      category: faq.category || "Lessons",
      order: maxOrder,
      status: faq.status || "ACTIVE",
    };
    setForm(initialState);
    setInitialFormState(initialState);
    setFormErrors({});
    setModalMode("duplicate");
    setActiveFaqId(null);
    setIsModalOpen(true);
  };

  // -------------------------------------------------------------
  // Form Submit: Create, Edit (Save Changes), or Duplicate
  // -------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side Validation
    const errors: { question?: string; answer?: string } = {};
    const trimmedQuestion = form.question.trim();
    const trimmedAnswer = form.answer.trim();

    if (!trimmedQuestion) {
      errors.question = "FAQ question is required.";
    }
    if (!trimmedAnswer) {
      errors.answer = "FAQ answer explanation is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    setFormErrors({});

    try {
      if (modalMode === "edit" && activeFaqId) {
        // UPDATE EXISTING RECORD (Preserving ID)
        const payload = {
          id: activeFaqId,
          question: trimmedQuestion,
          answer: trimmedAnswer,
          category: form.category,
          order: Number(form.order) || 1,
          status: form.status,
        };

        const res = await fetch("/api/admin/faqs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          showToast(data.error || "Unable to update FAQ. Please try again.", "error");
        } else {
          // Update in local state
          setFaqs((prev) =>
            prev.map((f) => (f.id === activeFaqId ? { ...f, ...data.faq } : f))
          );
          setIsModalOpen(false);
          showToast("FAQ updated successfully. Public website updated.");
        }
      } else {
        // CREATE NEW OR DUPLICATE RECORD
        const payload = {
          question: trimmedQuestion,
          answer: trimmedAnswer,
          category: form.category,
          order: Number(form.order) || 10,
          status: form.status,
        };

        const res = await fetch("/api/admin/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          showToast(data.error || "Failed to create FAQ", "error");
        } else {
          setFaqs((prev) => [...prev, data.faq]);
          setIsModalOpen(false);
          showToast(
            modalMode === "duplicate"
              ? "FAQ duplicated and published successfully!"
              : "New FAQ published to public website!"
          );
        }
      }
    } catch {
      showToast("Network error occurred while saving FAQ.", "error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Delete Handling with Confirmation Dialog
  // -------------------------------------------------------------
  const handleOpenDelete = (faq: FAQItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setFaqToDelete(faq);
  };

  const handleConfirmDelete = async () => {
    if (!faqToDelete) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/faqs?id=${faqToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error || "Failed to delete FAQ.", "error");
      } else {
        setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
        showToast("FAQ deleted successfully.");
        setFaqToDelete(null);
      }
    } catch {
      showToast("Network error deleting FAQ.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // -------------------------------------------------------------
  // Filtered FAQs Calculation
  // -------------------------------------------------------------
  const filteredFaqs = useMemo(() => {
    return faqs
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "ALL" && item.category !== selectedCategory) {
          return false;
        }
        // Status filter
        if (statusFilter !== "ALL") {
          const itemStatus = item.status || "ACTIVE";
          if (itemStatus !== statusFilter) return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchQuestion = item.question.toLowerCase().includes(q);
          const matchAnswer = item.answer.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          return matchQuestion || matchAnswer || matchCategory;
        }
        return true;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [faqs, selectedCategory, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2.5 rounded-xl p-4 text-xs font-semibold shadow-sm transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60"
          }`}
          role="alert"
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Top Search, Category Filters, & Add FAQ Button */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs by question, answer, category..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Add Question Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add FAQ Question</span>
          </button>
        </div>

        {/* Category Pills & Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              All Categories ({faqs.length})
            </button>
            {allCategories.map((cat) => {
              const count = faqs.filter((f) => f.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <Filter className="h-3 w-3" />
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
              }
              className="rounded-lg border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* FAQs List */}
      {filteredFaqs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
          <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-white">
            No FAQs Found
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {searchQuery || selectedCategory !== "ALL" || statusFilter !== "ALL"
              ? "No questions match your current search or filter criteria."
              : "Get started by creating your first driving tuition FAQ."}
          </p>
          {(searchQuery || selectedCategory !== "ALL" || statusFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setStatusFilter("ALL");
              }}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((f) => {
            const isActive = f.status !== "INACTIVE";

            return (
              <div
                key={f.id}
                onClick={() => handleOpenEdit(f)}
                className={`group rounded-2xl border bg-white p-5 shadow-xs transition-all duration-200 cursor-pointer dark:bg-slate-900 ${
                  isActive
                    ? "border-slate-200 hover:border-indigo-400/80 hover:shadow-sm dark:border-slate-800 dark:hover:border-indigo-500/50"
                    : "border-slate-200/60 bg-slate-50/50 opacity-75 hover:opacity-100 dark:border-slate-800/60 dark:bg-slate-900/40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Category Badge, Question, Answer */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {f.category}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isActive ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </span>

                      {f.order !== undefined && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          Order #{f.order}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {f.question}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {f.answer}
                    </p>
                  </div>

                  {/* Right: Small Professional Action Area */}
                  <div className="flex items-center gap-1 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 justify-end">
                    {/* Edit FAQ Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenEdit(f, e)}
                      title="Edit FAQ"
                      aria-label="Edit FAQ"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-950/50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    {/* Duplicate FAQ Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenDuplicate(f, e)}
                      title="Duplicate FAQ"
                      aria-label="Duplicate FAQ"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <Copy className="h-4 w-4" />
                    </button>

                    {/* Delete FAQ Button */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenDelete(f, e)}
                      title="Delete FAQ"
                      aria-label="Delete FAQ"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/40 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-rose-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* UNIFIED REUSABLE FAQ MODAL (CREATE / EDIT / DUPLICATE)    */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="faq-modal-title"
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    {modalMode === "edit" ? (
                      <Pencil className="h-4 w-4" />
                    ) : modalMode === "duplicate" ? (
                      <Copy className="h-4 w-4" />
                    ) : (
                      <HelpCircle className="h-4 w-4" />
                    )}
                  </div>
                  <h2
                    id="faq-modal-title"
                    className="text-lg font-bold text-slate-900 dark:text-white"
                  >
                    {modalMode === "edit"
                      ? "Edit FAQ"
                      : modalMode === "duplicate"
                      ? "Duplicate FAQ Question"
                      : "Add FAQ Question"}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">
                  {modalMode === "edit"
                    ? "Modify existing question, answer, category, or public visibility"
                    : modalMode === "duplicate"
                    ? "Create a new question pre-filled with existing content"
                    : "Create a new FAQ to help learners prepare for practical tests"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAttemptCloseModal}
                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Category & Order Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={form.order}
                    onChange={(e) =>
                      setForm({ ...form, order: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Question Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={questionInputRef}
                  type="text"
                  value={form.question}
                  onChange={(e) => {
                    setForm({ ...form, question: e.target.value });
                    if (formErrors.question) {
                      setFormErrors((prev) => ({ ...prev, question: undefined }));
                    }
                  }}
                  placeholder="e.g. How many driving lessons will I need to pass?"
                  className={`w-full rounded-xl border px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    formErrors.question
                      ? "border-rose-400 focus:ring-rose-500 dark:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500 dark:border-slate-700"
                  }`}
                />
                {formErrors.question && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formErrors.question}
                  </p>
                )}
              </div>

              {/* Detailed Answer Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.answer}
                  onChange={(e) => {
                    setForm({ ...form, answer: e.target.value });
                    if (formErrors.answer) {
                      setFormErrors((prev) => ({ ...prev, answer: undefined }));
                    }
                  }}
                  placeholder="Provide a clear, accurate, and reassuring answer for students..."
                  className={`w-full rounded-xl border px-3 py-2 text-xs text-slate-900 leading-relaxed focus:outline-hidden focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    formErrors.answer
                      ? "border-rose-400 focus:ring-rose-500 dark:border-rose-500"
                      : "border-slate-200 focus:ring-indigo-500 dark:border-slate-700"
                  }`}
                />
                {formErrors.answer && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formErrors.answer}
                  </p>
                )}
              </div>

              {/* Status Radio / Select Toggle */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Public Visibility Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                      form.status === "ACTIVE"
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="ACTIVE"
                      checked={form.status === "ACTIVE"}
                      onChange={() => setForm({ ...form, status: "ACTIVE" })}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="block text-xs font-bold">Active</span>
                      <span className="block text-[10px] opacity-75">
                        Visible on website
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition ${
                      form.status === "INACTIVE"
                        ? "border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200"
                        : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value="INACTIVE"
                      checked={form.status === "INACTIVE"}
                      onChange={() => setForm({ ...form, status: "INACTIVE" })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <div>
                      <span className="block text-xs font-bold">Inactive</span>
                      <span className="block text-[10px] opacity-75">
                        Hidden from visitors
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleAttemptCloseModal}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>{modalMode === "edit" ? "Saving..." : "Creating..."}</span>
                    </>
                  ) : modalMode === "edit" ? (
                    "Save Changes"
                  ) : modalMode === "duplicate" ? (
                    "Create Duplicate"
                  ) : (
                    "Add FAQ"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* UNSAVED CHANGES CONFIRMATION DIALOG                       */}
      {/* ========================================================= */}
      {showDiscardConfirm && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Discard unsaved changes?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  You have unsaved edits. If you discard, all changes will be lost.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleConfirmDiscard}
                className="rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION DIALOG                                */}
      {/* ========================================================= */}
      {faqToDelete && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="alertdialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0 mt-0.5">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Delete FAQ Question?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This action cannot be undone and will permanently remove this question from the public website.
                </p>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-2.5 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 font-medium">
                  &ldquo;{faqToDelete.question}&rdquo;
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setFaqToDelete(null)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete FAQ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default FaqsManager;
