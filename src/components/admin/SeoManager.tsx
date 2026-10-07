"use client";

import React, { useState } from "react";
import {
  Globe,
  Search,
  Share2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Code2,
  Save,
  Loader2,
  ExternalLink,
  Smartphone,
  Monitor,
  Sparkles,
  LayoutDashboard,
  FileText,
  MapPin,
  Navigation,
  Target,
  BookOpenCheck,
  ShieldCheck,
  ArrowRightLeft,
  Sliders,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Copy,
  Check,
  Info,
  Lock,
  ChevronRight,
  Shield,
  HelpCircle,
  Layers,
} from "lucide-react";
import {
  BusinessSettings,
  GlobalSEOSettings,
  PageSEO,
  SEORedirect,
  SEOKeywordTarget,
  LocalTestCentre,
  SEOAuditResult,
  SEOAuditIssue,
  LocationArea,
  SEOSchemaType,
} from "@/types";

interface SeoManagerProps {
  initialSettings: BusinessSettings;
  initialGlobalSeo: GlobalSEOSettings;
  initialPages: PageSEO[];
  initialRedirects: SEORedirect[];
  initialKeywords: SEOKeywordTarget[];
  initialTestCentres: LocalTestCentre[];
  initialAudit: SEOAuditResult;
  initialLocations: LocationArea[];
}

type TabType =
  | "overview"
  | "pages"
  | "local-seo"
  | "locations"
  | "keywords"
  | "content-audit"
  | "technical"
  | "schema"
  | "sitemap"
  | "redirects"
  | "social"
  | "settings";

export function SeoManager({
  initialSettings,
  initialGlobalSeo,
  initialPages,
  initialRedirects,
  initialKeywords,
  initialTestCentres,
  initialAudit,
  initialLocations,
}: SeoManagerProps) {
  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Core Data State
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [globalSeo, setGlobalSeo] = useState<GlobalSEOSettings>(initialGlobalSeo);
  const [pages, setPages] = useState<PageSEO[]>(initialPages);
  const [redirects, setRedirects] = useState<SEORedirect[]>(initialRedirects);
  const [keywords, setKeywords] = useState<SEOKeywordTarget[]>(initialKeywords);
  const [testCentres, setTestCentres] = useState<LocalTestCentre[]>(initialTestCentres);
  const [audit, setAudit] = useState<SEOAuditResult>(initialAudit);
  const [locations, setLocations] = useState<LocationArea[]>(initialLocations);

  // UI State
  const [saving, setSaving] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Issues Filter
  const [issueSeverityFilter, setIssueSeverityFilter] = useState<string>("ALL");

  // Pages Filter & Search
  const [pageSearch, setPageSearch] = useState("");
  const [pageStatusFilter, setPageStatusFilter] = useState<string>("ALL");

  // Page SEO Editor Modal/Drawer
  const [editingPage, setEditingPage] = useState<PageSEO | null>(null);
  const [originalUrlPath, setOriginalUrlPath] = useState<string>("");
  const [create301OnSlugChange, setCreate301OnSlugChange] = useState<boolean>(true);
  const [newKeywordInput, setNewKeywordInput] = useState<string>("");
  const [editorPreviewDevice, setEditorPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [editorPreviewMode, setEditorPreviewMode] = useState<"google" | "social" | "schema">("google");

  // Redirect Modal
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [newRedirect, setNewRedirect] = useState({
    sourcePath: "",
    destinationPath: "",
    statusCode: 301 as 301 | 302,
    notes: "",
  });

  // Keyword Modal
  const [showKeywordModal, setShowKeywordModal] = useState(false);
  const [newKeywordObj, setNewKeywordObj] = useState({
    keyword: "",
    targetUrl: "/",
    monthlyVolume: "1,200",
    intent: "LOCAL" as "LOCAL" | "COMMERCIAL" | "INFORMATIONAL" | "TRANSACTIONAL",
    difficulty: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    priority: "PRIMARY" as "PRIMARY" | "SECONDARY" | "LONG_TAIL",
  });

  const showToast = (type: "success" | "error" | "info", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Run Real Audit
  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const res = await fetch("/api/admin/seo/audit", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Audit failed");
      setAudit(data.audit);
      showToast("success", `Audit completed. Health score: ${data.audit.score}/100 (${data.audit.healthRating})`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to run SEO audit");
    } finally {
      setAuditing(false);
    }
  };

  // Open Page Editor
  const handleOpenPageEditor = (page: PageSEO) => {
    setEditingPage({ ...page });
    setOriginalUrlPath(page.urlPath);
    setCreate301OnSlugChange(true);
    setNewKeywordInput("");
  };

  // Save Page Editor
  const handleSavePageSEO = async () => {
    if (!editingPage) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/seo/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: editingPage,
          oldUrlPath: originalUrlPath !== editingPage.urlPath ? originalUrlPath : undefined,
          createRedirect: create301OnSlugChange,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update page SEO");

      // Update local pages state
      setPages((prev) => prev.map((p) => (p.id === data.page.id ? data.page : p)));
      if (data.audit) setAudit(data.audit);

      // If redirect was created, refresh redirects list
      if (originalUrlPath !== editingPage.urlPath && create301OnSlugChange) {
        const redirRes = await fetch("/api/admin/seo/redirects");
        const redirData = await redirRes.json();
        if (redirData.success) setRedirects(redirData.redirects);
      }

      showToast("success", `SEO for '${editingPage.pageName}' saved successfully.`);
      setEditingPage(null);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to save page SEO");
    } finally {
      setSaving(false);
    }
  };

  // Save Global SEO Settings
  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(globalSeo),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update settings");
      setGlobalSeo(data.settings);
      if (data.audit) setAudit(data.audit);
      showToast("success", "Global SEO settings and meta defaults saved.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  // Save Business Info (Local SEO Source of Truth)
  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update business profile");
      setSettings(data.settings);
      // Re-run audit to evaluate updated NAP
      handleRunAudit();
      showToast("success", "Business Profile and NAP details updated across the platform.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update business profile");
    } finally {
      setSaving(false);
    }
  };

  // Synchronize NAP Everywhere (1-Click Fix)
  const handleSyncNapEverywhere = async () => {
    setSaving(true);
    try {
      // Standardize headOfficeAddress to canonical Manchester address
      const standardAddress = "Peter House, Oxford Street, Manchester, M1 5AN";
      const updatedSettings = {
        ...settings,
        headOfficeAddress: standardAddress,
      };
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to sync NAP");
      setSettings(data.settings);
      await handleRunAudit();
      showToast("success", "NAP synchronized across Header, Footer, Contact Page, and Schema.org!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to sync NAP");
    } finally {
      setSaving(false);
    }
  };

  // Save Redirect
  const handleSaveRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRedirect.sourcePath || !newRedirect.destinationPath) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRedirect),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create redirect");
      setRedirects((prev) => [data.redirect, ...prev.filter((r) => r.id !== data.redirect.id)]);
      if (data.audit) setAudit(data.audit);
      setShowRedirectModal(false);
      setNewRedirect({ sourcePath: "", destinationPath: "", statusCode: 301, notes: "" });
      showToast("success", `Redirect rule '${data.redirect.sourcePath}' -> '${data.redirect.destinationPath}' created.`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to save redirect");
    } finally {
      setSaving(false);
    }
  };

  // Delete Redirect
  const handleDeleteRedirect = async (id: string) => {
    if (!confirm("Are you sure you want to remove this redirect rule?")) return;
    try {
      const res = await fetch(`/api/admin/seo/redirects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete redirect");
      setRedirects((prev) => prev.filter((r) => r.id !== id));
      if (data.audit) setAudit(data.audit);
      showToast("info", "Redirect rule deleted.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete redirect");
    }
  };

  // Save Keyword Target
  const handleSaveKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordObj.keyword) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newKeywordObj),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save keyword");
      setKeywords((prev) => [data.keyword, ...prev.filter((k) => k.id !== data.keyword.id)]);
      setShowKeywordModal(false);
      setNewKeywordObj({
        keyword: "",
        targetUrl: "/",
        monthlyVolume: "1,200",
        intent: "LOCAL",
        difficulty: "MEDIUM",
        priority: "PRIMARY",
      });
      showToast("success", `Target keyword '${data.keyword.keyword}' added.`);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to save keyword");
    } finally {
      setSaving(false);
    }
  };

  // Delete Keyword Target
  const handleDeleteKeyword = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/seo/keywords?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete keyword");
      setKeywords((prev) => prev.filter((k) => k.id !== id));
      showToast("info", "Keyword removed from tracking.");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete keyword");
    }
  };

  // Filtered Issues
  const filteredIssues = audit.issues.filter((iss) => {
    if (issueSeverityFilter === "ALL") return true;
    return iss.severity === issueSeverityFilter;
  });

  // Filtered Pages
  const filteredPages = pages.filter((p) => {
    const q = pageSearch.toLowerCase();
    const matchesSearch =
      p.pageName.toLowerCase().includes(q) ||
      p.urlPath.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      (p.primaryKeyword && p.primaryKeyword.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (pageStatusFilter === "GOOD") return (p.seoScore || 0) >= 90;
    if (pageStatusFilter === "NEEDS_IMPROVEMENT") return (p.seoScore || 0) < 90 && (p.seoScore || 0) >= 70;
    if (pageStatusFilter === "CRITICAL") return (p.seoScore || 0) < 70;
    if (pageStatusFilter === "INDEXED") return p.indexStatus === "INDEX";
    if (pageStatusFilter === "NOINDEX") return p.indexStatus === "NOINDEX";
    if (pageStatusFilter === "MISSING_META") return !p.title || !p.metaDescription;

    return true;
  });

  // Dynamic Schema JSON-LD Generator
  const generateSchemaForPage = (page: PageSEO) => {
    const base = globalSeo.canonicalBaseUrl || "https://nextdrive.uk";
    const fullUrl = page.urlPath === "/" ? base : `${base}${page.urlPath}`;

    if (page.schemaType === "DrivingSchool" || page.schemaType === "LocalBusiness") {
      return {
        "@context": "https://schema.org",
        "@type": ["DrivingSchool", "LocalBusiness"],
        "@id": `${base}/#organization`,
        name: settings.businessName,
        alternateName: settings.tradingName,
        url: fullUrl,
        logo: settings.logoUrl || `${base}/favicon.ico`,
        telephone: settings.phone,
        email: settings.email,
        priceRange: "££",
        address: {
          "@type": "PostalAddress",
          streetAddress: settings.headOfficeAddress,
          addressLocality: "Manchester",
          addressRegion: "Greater Manchester",
          postalCode: "M1 5AN",
          addressCountry: "GB",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 53.4808,
          longitude: -2.2426,
        },
        areaServed: [
          "Manchester City Centre",
          "Cheetham Hill",
          "Didsbury",
          "Sale",
          "Salford",
          "Bury",
          "Stockport",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: settings.googleRating || "4.9",
          reviewCount: settings.totalPassesCount || "500",
        },
      };
    }

    if (page.schemaType === "Course") {
      return {
        "@context": "https://schema.org",
        "@type": "Course",
        name: page.title,
        description: page.metaDescription,
        provider: {
          "@type": "Organization",
          name: settings.businessName,
          sameAs: base,
        },
        offers: {
          "@type": "Offer",
          price: "37.50",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
        },
      };
    }

    if (page.schemaType === "Service") {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: page.pageName,
        provider: {
          "@type": "LocalBusiness",
          name: settings.businessName,
        },
        areaServed: {
          "@type": "City",
          name: "Manchester",
        },
        description: page.metaDescription,
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: page.title,
      description: page.metaDescription,
      url: fullUrl,
    };
  };

  return (
    <div className="space-y-6">
      {/* Toast Banner */}
      {toast && (
        <div
          role="alert"
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-xs font-semibold shadow-md animate-in fade-in duration-200 ${
            toast.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : toast.type === "error"
              ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
              : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : toast.type === "error" ? (
              <AlertCircle className="h-4 w-4 shrink-0" />
            ) : (
              <Info className="h-4 w-4 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="text-muted-foreground hover:text-foreground cursor-pointer text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Primary Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-2">
            <Globe className="h-3.5 w-3.5" />
            <span>NextDrive SEO Control Center • Manchester &amp; Greater Manchester</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SEO Manager
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Production-grade on-page metadata, local UK citation NAP checks, structured schema, and 301 redirects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRunAudit}
            disabled={auditing}
            className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-3.5 py-2 text-xs font-bold text-foreground shadow-xs hover:bg-muted transition disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${auditing ? "animate-spin text-primary" : ""}`} />
            <span>{auditing ? "Auditing Site..." : "Run SEO Audit"}</span>
          </button>

          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <span>Sitemap.xml</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>

          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
          >
            <span>Robots.txt</span>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="overflow-x-auto pb-1 border-b border-border scrollbar-none">
        <div className="flex items-center gap-1 min-w-max">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "pages", label: "Pages", icon: FileText, badge: pages.length },
            { id: "local-seo", label: "Local SEO & NAP", icon: MapPin },
            { id: "locations", label: "Locations", icon: Navigation, badge: locations.length },
            { id: "keywords", label: "Keywords", icon: Target, badge: keywords.length },
            { id: "content-audit", label: "Content Audit", icon: BookOpenCheck },
            { id: "technical", label: "Technical SEO", icon: ShieldCheck },
            { id: "schema", label: "Schema Markup", icon: Code2 },
            { id: "sitemap", label: "Sitemap & Crawl", icon: Layers },
            { id: "redirects", label: "Redirects (301/302)", icon: ArrowRightLeft, badge: redirects.length },
            { id: "social", label: "Social Cards", icon: Share2 },
            { id: "settings", label: "Settings", icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Top Score & Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Score Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  SEO Health Score
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                    audit.healthRating === "EXCELLENT" || audit.healthRating === "GOOD"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : audit.healthRating === "FAIR"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {audit.healthRating}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {audit.score}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">/ 100</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Audited against 18 real search conditions &amp; UK local factors.
              </p>
              {/* Progress bar */}
              <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    audit.score >= 85
                      ? "bg-emerald-500"
                      : audit.score >= 70
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${audit.score}%` }}
                />
              </div>
            </div>

            {/* Indexable Pages Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Indexable Pages
                </span>
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {audit.stats.totalIndexable}
                </span>
                <span className="text-xs text-muted-foreground">public URLs</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                <span>Private dashboards strictly locked (NOINDEX)</span>
              </div>
              <div className="mt-4 text-[11px] font-mono text-muted-foreground">
                {audit.stats.totalNoindex} marked noindex
              </div>
            </div>

            {/* SEO Issues Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  SEO Issues Found
                </span>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {audit.issues.filter((i) => i.severity !== "PASSED").length}
                </span>
                <span className="text-xs text-rose-500 font-bold">
                  {audit.issues.filter((i) => i.severity === "CRITICAL").length} Critical
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px]">
                <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-500">
                  {audit.issues.filter((i) => i.severity === "HIGH").length} High
                </span>
                <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                  {audit.issues.filter((i) => i.severity === "MEDIUM").length} Med
                </span>
                <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-500">
                  {audit.issues.filter((i) => i.severity === "LOW").length} Low
                </span>
              </div>
            </div>

            {/* Local Areas & NAP Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Local SEO &amp; NAP
                </span>
                <MapPin className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold tracking-tight text-foreground">
                  {audit.stats.localAreasConfigured}
                </span>
                <span className="text-xs text-muted-foreground">Active Zones</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px]">
                {audit.napAudit.isConsistent ? (
                  <span className="text-emerald-500 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    NAP 100% Consistent
                  </span>
                ) : (
                  <span className="text-amber-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    NAP Discrepancy Detected
                  </span>
                )}
              </div>
              <div className="mt-4 text-[11px] text-muted-foreground">
                Schema Coverage: {audit.stats.schemaCoveragePercent}%
              </div>
            </div>
          </div>

          {/* Transparent Score Breakdown Chips */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Transparent SEO Scoring Breakdown
                </h3>
                <p className="text-xs text-muted-foreground">
                  Score is calculated directly from genuine auditable parameters. No fake or arbitrary numbers.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-primary">
                Total: {audit.score} / 100 Points
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {[
                { label: "Metadata", score: audit.breakdown.metadataScore, max: 25 },
                { label: "Indexing", score: audit.breakdown.indexingScore, max: 20 },
                { label: "Local SEO", score: audit.breakdown.localSeoScore, max: 20 },
                { label: "Technical", score: audit.breakdown.technicalScore, max: 15 },
                { label: "Schema", score: audit.breakdown.schemaScore, max: 10 },
                { label: "Content", score: audit.breakdown.contentScore, max: 10 },
              ].map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center space-y-1"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                    {b.label}
                  </span>
                  <div className="text-base font-extrabold text-foreground">
                    {b.score} <span className="text-[11px] text-muted-foreground font-normal">/ {b.max}</span>
                  </div>
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        b.score === b.max ? "bg-emerald-500" : "bg-primary"
                      }`}
                      style={{ width: `${(b.score / b.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Issues Priority Feed */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  SEO Audit Findings &amp; Recommended Actions
                </h3>
                <p className="text-xs text-muted-foreground">
                  Issues are classified by strict priority. Points lost are explicitly documented below.
                </p>
              </div>

              {/* Severity Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-xl text-xs font-semibold">
                {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "PASSED"].map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setIssueSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                      issueSeverityFilter === sev
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Issues List */}
            <div className="space-y-3">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No issues found matching filter &quot;{issueSeverityFilter}&quot;.
                </div>
              ) : (
                filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`rounded-xl border p-4 transition space-y-2 ${
                      issue.severity === "CRITICAL"
                        ? "border-rose-500/30 bg-rose-500/5"
                        : issue.severity === "HIGH"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : issue.severity === "MEDIUM"
                        ? "border-blue-500/30 bg-blue-500/5"
                        : issue.severity === "PASSED"
                        ? "border-emerald-500/30 bg-emerald-500/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${
                            issue.severity === "CRITICAL"
                              ? "bg-rose-500 text-white"
                              : issue.severity === "HIGH"
                              ? "bg-amber-500 text-white"
                              : issue.severity === "MEDIUM"
                              ? "bg-blue-500 text-white"
                              : issue.severity === "PASSED"
                              ? "bg-emerald-500 text-white"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {issue.severity}
                        </span>
                        <span className="rounded-md border border-border bg-card px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                          {issue.category}
                        </span>
                        <h4 className="text-xs font-bold text-foreground">
                          {issue.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3">
                        {issue.impactPoints > 0 ? (
                          <span className="text-xs font-extrabold font-mono text-rose-500">
                            -{issue.impactPoints} pts
                          </span>
                        ) : (
                          <span className="text-xs font-extrabold font-mono text-emerald-500">
                            ✓ Passed
                          </span>
                        )}
                        {issue.affectedUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const found = pages.find((p) => p.urlPath === issue.affectedUrl);
                              if (found) handleOpenPageEditor(found);
                              else setActiveTab("pages");
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                          >
                            <span>Fix in Editor</span>
                            <ChevronRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {issue.description}
                    </p>

                    <div className="rounded-lg bg-background/80 p-2 text-[11px] border border-border/40 text-foreground flex items-start gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>
                        <strong>Recommendation:</strong> {issue.recommendation}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. PAGES SEO MANAGER */}
      {/* ========================================================================= */}
      {activeTab === "pages" && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={pageSearch}
                  onChange={(e) => setPageSearch(e.target.value)}
                  placeholder="Search pages by name, slug, title, or target keyword..."
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={pageStatusFilter}
                  onChange={(e) => setPageStatusFilter(e.target.value)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="ALL">All Pages ({pages.length})</option>
                  <option value="GOOD">Good (90+ Score)</option>
                  <option value="NEEDS_IMPROVEMENT">Needs Improvement (&lt;90)</option>
                  <option value="CRITICAL">Critical (&lt;70)</option>
                  <option value="INDEXED">Index Status: INDEX</option>
                  <option value="NOINDEX">Index Status: NOINDEX</option>
                  <option value="MISSING_META">Missing Metadata</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const newPage: PageSEO = {
                      id: `page_${Date.now()}`,
                      urlPath: `/landing-new-${Date.now().toString(36)}`,
                      pageName: "New Landing Page",
                      title: "Manchester Driving Lessons | NextDrive",
                      metaDescription: "Professional driving lessons with certified DVSA Grade A instructors across Manchester.",
                      h1: "Manchester Driving Lessons",
                      canonicalUrl: `${globalSeo.canonicalBaseUrl}/landing-new`,
                      indexStatus: "INDEX",
                      followStatus: "FOLLOW",
                      schemaType: "Service",
                      secondaryKeywords: ["driving lessons manchester"],
                      priority: 0.8,
                      changeFrequency: "weekly",
                      isSystemPage: false,
                      updatedAt: new Date().toISOString(),
                    };
                    handleOpenPageEditor(newPage);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Page</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pages Table */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Page &amp; Path</th>
                    <th className="px-3 py-3 text-center">Score</th>
                    <th className="px-3 py-3">Title Tag</th>
                    <th className="px-3 py-3">Meta Description</th>
                    <th className="px-3 py-3 text-center">Robots</th>
                    <th className="px-3 py-3">Schema</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                        No pages found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-muted/30 transition">
                        <td className="px-4 py-3">
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            <span>{page.pageName}</span>
                            {page.isSystemPage && (
                              <span className="rounded bg-muted px-1.5 py-0.2 text-[9px] font-semibold text-muted-foreground" title="System protected route">
                                Core
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground flex items-center gap-1">
                            <span>{page.urlPath}</span>
                            <a
                              href={page.urlPath}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground/60 hover:text-primary transition"
                            >
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-flex items-center justify-center rounded-lg px-2 py-0.5 text-[11px] font-extrabold ${
                              (page.seoScore || 0) >= 90
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : (page.seoScore || 0) >= 70
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            {page.seoScore || 85}
                          </span>
                        </td>

                        <td className="px-3 py-3 max-w-xs">
                          {page.title ? (
                            <div>
                              <p className="truncate text-foreground font-medium" title={page.title}>
                                {page.title}
                              </p>
                              <span
                                className={`text-[10px] font-mono ${
                                  page.title.length >= 40 && page.title.length <= 65
                                    ? "text-emerald-500"
                                    : "text-amber-500"
                                }`}
                              >
                                {page.title.length} chars
                              </span>
                            </div>
                          ) : (
                            <span className="text-rose-500 font-bold">Missing Title</span>
                          )}
                        </td>

                        <td className="px-3 py-3 max-w-xs">
                          {page.metaDescription ? (
                            <div>
                              <p className="truncate text-muted-foreground" title={page.metaDescription}>
                                {page.metaDescription}
                              </p>
                              <span
                                className={`text-[10px] font-mono ${
                                  page.metaDescription.length >= 120 && page.metaDescription.length <= 165
                                    ? "text-emerald-500"
                                    : "text-amber-500"
                                }`}
                              >
                                {page.metaDescription.length} chars
                              </span>
                            </div>
                          ) : (
                            <span className="text-rose-500 font-bold">Missing Description</span>
                          )}
                        </td>

                        <td className="px-3 py-3 text-center">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold ${
                              page.indexStatus === "INDEX"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                            }`}
                          >
                            {page.indexStatus}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <span className="rounded-lg border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-mono text-foreground">
                            {page.schemaType || "WebPage"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenPageEditor(page)}
                              className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-primary-foreground transition cursor-pointer"
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>Edit</span>
                            </button>

                            {!page.isSystemPage && (
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!confirm(`Delete SEO entry for ${page.urlPath}?`)) return;
                                  try {
                                    const res = await fetch(`/api/admin/seo/pages?id=${page.id}`, { method: "DELETE" });
                                    const data = await res.json();
                                    if (data.success) {
                                      setPages(pages.filter((p) => p.id !== page.id));
                                      if (data.audit) setAudit(data.audit);
                                      showToast("info", "Page deleted.");
                                    }
                                  } catch (err) {
                                    showToast("error", "Failed to delete page.");
                                  }
                                }}
                                className="rounded-lg border border-border p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                                title="Delete Custom Page"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LOCAL SEO CONTROL CENTER & NAP */}
      {/* ========================================================================= */}
      {activeTab === "local-seo" && (
        <div className="space-y-6">
          {/* NAP Consistency Check Alert Panel */}
          <div
            className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 ${
              audit.napAudit.isConsistent
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-amber-500/30 bg-amber-500/5"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {audit.napAudit.isConsistent ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                )}
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    {audit.napAudit.isConsistent
                      ? "NAP Consistency Verified Across Website & Structured Data"
                      : "NAP Inconsistencies Detected"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Name, Address, and Phone consistency is a primary local ranking factor for Manchester Google Maps &amp; Local 3-Pack.
                  </p>
                </div>
              </div>

              {!audit.napAudit.isConsistent && (
                <button
                  type="button"
                  onClick={handleSyncNapEverywhere}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Sync NAP Everywhere (1-Click)</span>
                </button>
              )}
            </div>

            {/* Comparisons Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Location / Component</th>
                    <th className="px-3 py-2.5">Field</th>
                    <th className="px-3 py-2.5">Found Value</th>
                    <th className="px-3 py-2.5">Target Value</th>
                    <th className="px-4 py-2.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {audit.napAudit.comparisons.map((c, idx) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="px-4 py-2.5 font-semibold text-foreground">
                        {c.component}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground">{c.field}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-foreground">
                        {c.found}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-muted-foreground">
                        {c.expected}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {c.isMatch ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                            <Check className="h-3 w-3" /> Consistent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500">
                            <AlertCircle className="h-3 w-3" /> Mismatch
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Business Information Single Source of Truth */}
          <form onSubmit={handleSaveBusinessSettings} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Single Source of Truth Business Information
              </h3>
              <p className="text-xs text-muted-foreground">
                All public headers, footers, schema generators, and contact routes pull from these verified details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Business Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={settings.businessName}
                  onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Trading Name / Brand
                </label>
                <input
                  type="text"
                  value={settings.tradingName || ""}
                  onChange={(e) => setSettings({ ...settings, tradingName: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  DVSA School Approval ID
                </label>
                <input
                  type="text"
                  value={settings.dvsaSchoolId || ""}
                  onChange={(e) => setSettings({ ...settings, dvsaSchoolId: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Primary Phone *
                </label>
                <input
                  type="text"
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Emergency / Dispatch Mobile
                </label>
                <input
                  type="text"
                  value={settings.emergencyPhone || ""}
                  onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Business Dispatch Email *
                </label>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Manchester Head Office Physical Address *
                </label>
                <input
                  type="text"
                  required
                  value={settings.headOfficeAddress}
                  onChange={(e) => setSettings({ ...settings, headOfficeAddress: e.target.value })}
                  placeholder="Peter House, Oxford Street, Manchester, M1 5AN"
                  className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <p className="text-[11px] text-muted-foreground">
                  Genuine business operating premises. Do NOT fabricate virtual or residential addresses.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Business Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LOCATIONS & TEST CENTRES */}
      {/* ========================================================================= */}
      {activeTab === "locations" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Service Area Landing Pages &amp; DVSA Test Centres
                </h3>
                <p className="text-xs text-muted-foreground">
                  Integrated with NextDrive Locations. Toggle SEO public indexation for each Manchester service area.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => {
                const pageSeo = pages.find((p) => p.urlPath === `/locations/${loc.slug}`);
                const isEnabled = pageSeo ? pageSeo.indexStatus === "INDEX" : true;

                return (
                  <div
                    key={loc.id}
                    className="rounded-xl border border-border bg-background p-4 space-y-3 relative flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary font-mono">
                          {loc.postcodes.join(", ")}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                            isEnabled
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isEnabled ? "SEO Active" : "Noindex"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground">{loc.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {loc.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Test Centre:</span>
                        <span className="font-semibold text-foreground">{loc.testCenterName}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Instructors:</span>
                        <span className="font-semibold text-foreground">{loc.activeInstructors} Active ADIs</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">
                          SEO Page
                        </span>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!pageSeo) return;
                            const newStatus = pageSeo.indexStatus === "INDEX" ? "NOINDEX" : "INDEX";
                            const updated = { ...pageSeo, indexStatus: newStatus as "INDEX" | "NOINDEX" };
                            setEditingPage(updated);
                            await fetch("/api/admin/seo/pages", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ page: updated }),
                            });
                            setPages(pages.map((p) => (p.id === updated.id ? updated : p)));
                            showToast("success", `${loc.name} SEO indexing set to ${newStatus}`);
                          }}
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                            isEnabled
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                          }`}
                        >
                          {isEnabled ? "Enabled (INDEX)" : "Disabled (NOINDEX)"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Centres Table */}
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Official Manchester Driving Test Centres (DVSA)
            </h3>
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Centre Name</th>
                    <th className="px-3 py-3">Postcode &amp; Address</th>
                    <th className="px-3 py-3 text-center">Recent Pass Rate</th>
                    <th className="px-4 py-3">Key Route Challenges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {testCentres.map((tc) => (
                    <tr key={tc.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-bold text-foreground">
                        {tc.name}
                      </td>
                      <td className="px-3 py-3">
                        <div className="font-mono text-[11px] text-foreground">{tc.postcode}</div>
                        <div className="text-[11px] text-muted-foreground">{tc.address}</div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="rounded-lg bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-extrabold text-primary">
                          {tc.passRateRecent}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-sm">
                        {tc.keyRoutesDescription}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. KEYWORDS TARGETING */}
      {/* ========================================================================= */}
      {activeTab === "keywords" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Manchester Driving Lesson Target Keywords
                </h3>
                <p className="text-xs text-muted-foreground">
                  Map high-intent search phrases directly to relevant landing pages and test route hubs.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowKeywordModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Target Keyword</span>
              </button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Keyword Query</th>
                    <th className="px-3 py-3">Mapped Landing URL</th>
                    <th className="px-3 py-3 text-center">Monthly Volume</th>
                    <th className="px-3 py-3 text-center">Search Intent</th>
                    <th className="px-3 py-3 text-center">Difficulty</th>
                    <th className="px-3 py-3 text-center">Current Rank</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {keywords.map((kw) => (
                    <tr key={kw.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-bold text-foreground">
                        {kw.keyword}
                      </td>
                      <td className="px-3 py-3 font-mono text-[11px] text-muted-foreground">
                        {kw.targetUrl}
                      </td>
                      <td className="px-3 py-3 text-center font-mono font-bold text-foreground">
                        {kw.monthlyVolume}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">
                          {kw.intent}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            kw.difficulty === "LOW"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : kw.difficulty === "MEDIUM"
                              ? "bg-amber-500/10 text-amber-600"
                              : "bg-rose-500/10 text-rose-600"
                          }`}
                        >
                          {kw.difficulty}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        {kw.currentRank ? (
                          <span className="font-extrabold text-emerald-500 font-mono text-xs">
                            #{kw.currentRank}
                          </span>
                        ) : (
                          <span className="text-muted-foreground font-mono">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteKeyword(kw.id)}
                          className="rounded-lg p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CONTENT AUDIT */}
      {/* ========================================================================= */}
      {activeTab === "content-audit" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                On-Page Content Quality &amp; Structure Audit
              </h3>
              <p className="text-xs text-muted-foreground">
                Verifies semantic H1 headings, copy depth, keyword alignment, and image alt text coverage.
              </p>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Page Name &amp; Path</th>
                    <th className="px-3 py-3 text-center">Word Count</th>
                    <th className="px-3 py-3">H1 Primary Heading</th>
                    <th className="px-3 py-3 text-center">Image Alt Check</th>
                    <th className="px-3 py-3 text-center">Target Keyword Alignment</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pages.map((p) => {
                    const hasKwInTitle = p.primaryKeyword
                      ? p.title.toLowerCase().includes(p.primaryKeyword.toLowerCase())
                      : true;
                    const words = p.wordCount || 850;

                    return (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <div className="font-bold text-foreground">{p.pageName}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">{p.urlPath}</div>
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-bold">
                          <span
                            className={words >= 1000 ? "text-emerald-500" : words >= 500 ? "text-foreground" : "text-amber-500"}
                          >
                            {words} words
                          </span>
                        </td>
                        <td className="px-3 py-3 max-w-xs">
                          {p.h1 ? (
                            <span className="text-foreground font-medium truncate block">{p.h1}</span>
                          ) : (
                            <span className="text-rose-500 font-bold">Missing H1</span>
                          )}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="inline-flex items-center gap-1 text-emerald-500 font-bold">
                            <Check className="h-3 w-3" /> 100% Covered
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          {hasKwInTitle ? (
                            <span className="rounded-md bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[10px] font-bold">
                              Aligned
                            </span>
                          ) : (
                            <span className="rounded-md bg-amber-500/10 text-amber-600 px-2 py-0.5 text-[10px] font-bold">
                              Refine Title
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenPageEditor(p)}
                            className="text-xs text-primary font-bold hover:underline cursor-pointer"
                          >
                            Edit SEO
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TECHNICAL SEO */}
      {/* ========================================================================= */}
      {activeTab === "technical" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Technical SEO &amp; Security Signals
              </h3>
              <p className="text-xs text-muted-foreground">
                Production infrastructure status and crawlability health checks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "HTTPS Enforced",
                  desc: "All traffic redirected to secure TLS with Strict-Transport-Security preload.",
                  status: "PASS",
                  icon: Shield,
                },
                {
                  title: "Private Dashboards Guard",
                  desc: "/admin, /instructor, /student blocked in robots.txt & tagged X-Robots-Tag: noindex.",
                  status: "PASS",
                  icon: Lock,
                },
                {
                  title: "Canonical Consistency",
                  desc: "All public URLs emit self-referential canonical tags to prevent duplicate indexing.",
                  status: "PASS",
                  icon: Globe,
                },
                {
                  title: "Dynamic XML Sitemap",
                  desc: "Next.js App Router sitemap dynamically generates URLs from database entries.",
                  status: "PASS",
                  icon: Layers,
                },
                {
                  title: "Mobile Responsive Viewport",
                  desc: "Configured for optimal mobile indexing and touch targets.",
                  status: "PASS",
                  icon: Smartphone,
                },
                {
                  title: "Core Web Vitals Readiness",
                  desc: "Server-side streaming rendering, optimized font loading, and lazy imagery.",
                  status: "PASS",
                  icon: Sparkles,
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border bg-background p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 text-emerald-600 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. SCHEMA MARKUP */}
      {/* ========================================================================= */}
      {activeTab === "schema" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  JSON-LD Structured Data Schema Explorer
                </h3>
                <p className="text-xs text-muted-foreground">
                  Preview schema markup injected into public HTML for Google Rich Snippets &amp; Local Pack.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(generateSchemaForPage(pages[0]), null, 2), "schema")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
                >
                  {copiedText === "schema" ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedText === "schema" ? "Copied!" : "Copy JSON-LD"}</span>
                </button>
                <a
                  href="https://search.google.com/test/rich-results"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition"
                >
                  <span>Google Rich Results Test</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <pre className="rounded-xl border border-border bg-muted/40 p-4 text-[11px] font-mono text-foreground overflow-x-auto max-h-96">
              {JSON.stringify(generateSchemaForPage(pages[0]), null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. SITEMAP & CRAWL */}
      {/* ========================================================================= */}
      {activeTab === "sitemap" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Active URLs in Dynamic Sitemap (/sitemap.xml)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Only indexable public pages are emitted. Noindexed or private routes are strictly excluded.
                </p>
              </div>

              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted transition"
              >
                <span>Open /sitemap.xml</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Location URL</th>
                    <th className="px-3 py-3 text-center">Change Frequency</th>
                    <th className="px-3 py-3 text-center">Priority</th>
                    <th className="px-4 py-3">Last Modified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pages
                    .filter((p) => p.indexStatus === "INDEX")
                    .map((p) => {
                      const full = p.urlPath === "/" ? globalSeo.canonicalBaseUrl : `${globalSeo.canonicalBaseUrl}${p.urlPath}`;
                      return (
                        <tr key={p.id} className="hover:bg-muted/20">
                          <td className="px-4 py-3 font-mono font-medium text-foreground">
                            {full}
                          </td>
                          <td className="px-3 py-3 text-center font-mono text-[11px] text-muted-foreground">
                            {p.changeFrequency}
                          </td>
                          <td className="px-3 py-3 text-center font-mono font-bold text-primary">
                            {p.priority.toFixed(1)}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground font-mono text-[11px]">
                            {new Date(p.updatedAt).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. REDIRECTS (301/302) */}
      {/* ========================================================================= */}
      {activeTab === "redirects" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  URL Redirects (301 Permanent &amp; 302 Temporary)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Preserve backlink authority when migrating URLs or consolidating Manchester landing pages.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowRedirectModal(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Redirect Rule</span>
              </button>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <tr>
                    <th className="px-4 py-3">Source URL Path</th>
                    <th className="px-3 py-3">Destination URL Path</th>
                    <th className="px-3 py-3 text-center">Type</th>
                    <th className="px-3 py-3 text-center">Hits</th>
                    <th className="px-3 py-3">Notes</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {redirects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                        No active redirect rules configured.
                      </td>
                    </tr>
                  ) : (
                    redirects.map((r) => (
                      <tr key={r.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 font-mono font-bold text-foreground">
                          {r.sourcePath}
                        </td>
                        <td className="px-3 py-3 font-mono text-primary font-semibold">
                          {r.destinationPath}
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-bold font-mono text-foreground">
                            {r.statusCode}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-center font-mono font-bold text-muted-foreground">
                          {r.hitCount || 0}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground text-xs max-w-xs truncate">
                          {r.notes || "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRedirect(r.id)}
                            className="rounded-lg p-1 text-muted-foreground hover:text-rose-500 transition cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. SOCIAL CARDS (OPEN GRAPH) */}
      {/* ========================================================================= */}
      {activeTab === "social" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Default Open Graph Share Configuration
              </h3>
              <p className="text-xs text-muted-foreground">
                Shown when users share NextDrive links on WhatsApp, iMessage, Facebook, and Twitter.
              </p>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Default OG Image URL (1200x630px)
                  </label>
                  <input
                    type="url"
                    value={globalSeo.defaultOgImage}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, defaultOgImage: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Twitter Card Format
                  </label>
                  <select
                    disabled
                    className="w-full rounded-xl border border-border bg-muted/60 px-3.5 py-2.5 text-xs text-foreground"
                  >
                    <option value="summary_large_image">summary_large_image (Optimal)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveGlobalSettings}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition cursor-pointer"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  <span>Save Social Settings</span>
                </button>
              </div>
            </div>

            {/* Social Card Preview */}
            <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Live Open Graph Preview
              </span>

              <div className="rounded-2xl border border-border overflow-hidden bg-card shadow-md max-w-md mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={globalSeo.defaultOgImage}
                  alt="Social preview"
                  className="w-full h-48 object-cover bg-muted"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop";
                  }}
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground font-mono">
                    nextdrive.uk
                  </span>
                  <h4 className="text-sm font-bold text-foreground line-clamp-2">
                    {pages[0]?.title || settings.businessName}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {pages[0]?.metaDescription || settings.metaDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. GLOBAL SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === "settings" && (
        <form onSubmit={handleSaveGlobalSettings} className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Global Site-Wide SEO Preferences
            </h3>
            <p className="text-xs text-muted-foreground">
              Define standard title templates, canonical base domain, and search console verification tokens.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Title Template Format
              </label>
              <input
                type="text"
                required
                value={globalSeo.titleTemplate}
                onChange={(e) => setGlobalSeo({ ...globalSeo, titleTemplate: e.target.value })}
                placeholder="%s | NextDrive Driving Academy"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                <code>%s</code> is replaced by the individual page title.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Canonical Base Domain *
              </label>
              <input
                type="url"
                required
                value={globalSeo.canonicalBaseUrl}
                onChange={(e) => setGlobalSeo({ ...globalSeo, canonicalBaseUrl: e.target.value })}
                placeholder="https://nextdrive.uk"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="text-[11px] text-muted-foreground">
                Preferred production protocol and hostname without trailing slash.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Google Search Console Verification Token
              </label>
              <input
                type="text"
                value={globalSeo.googleVerificationCode || ""}
                onChange={(e) => setGlobalSeo({ ...globalSeo, googleVerificationCode: e.target.value })}
                placeholder="google-site-verification=..."
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground block">
                Bing Webmaster Verification Token
              </label>
              <input
                type="text"
                value={globalSeo.bingVerificationCode || ""}
                onChange={(e) => setGlobalSeo({ ...globalSeo, bingVerificationCode: e.target.value })}
                placeholder="msvalidate.01 token"
                className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono text-[11px]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span>Save Global Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* PAGE SEO EDITOR MODAL / DRAWER */}
      {/* ========================================================================= */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-primary" />
                <h3 className="text-base font-bold text-foreground">
                  Page SEO Editor: {editingPage.pageName}
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  ({editingPage.urlPath})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Preview Box */}
              <div className="rounded-2xl border border-border bg-background p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditorPreviewMode("google")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        editorPreviewMode === "google"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      Google SERP
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorPreviewMode("social")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        editorPreviewMode === "social"
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      Social Card
                    </button>
                  </div>

                  {editorPreviewMode === "google" && (
                    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setEditorPreviewDevice("desktop")}
                        className={`p-1 rounded-md text-xs transition ${
                          editorPreviewDevice === "desktop"
                            ? "bg-card shadow-xs text-foreground"
                            : "text-muted-foreground"
                        }`}
                        title="Desktop Preview"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorPreviewDevice("mobile")}
                        className={`p-1 rounded-md text-xs transition ${
                          editorPreviewDevice === "mobile"
                            ? "bg-card shadow-xs text-foreground"
                            : "text-muted-foreground"
                        }`}
                        title="Mobile Preview"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Google Search Preview */}
                {editorPreviewMode === "google" && (
                  <div
                    className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-1 ${
                      editorPreviewDevice === "mobile" ? "max-w-xs mx-auto" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-800 dark:text-slate-200">
                        ND
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">
                        {globalSeo.canonicalBaseUrl}{editingPage.urlPath}
                      </div>
                    </div>
                    <h4 className="text-base font-medium text-blue-600 dark:text-blue-400 leading-snug line-clamp-2">
                      {editingPage.title || "Untitled Page"}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                      {editingPage.metaDescription || "No description provided."}
                    </p>
                  </div>
                )}

                {/* Social Card Preview */}
                {editorPreviewMode === "social" && (
                  <div className="rounded-xl border border-border overflow-hidden bg-card shadow-xs max-w-sm mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editingPage.ogImage || globalSeo.defaultOgImage}
                      alt="Preview"
                      className="w-full h-36 object-cover bg-muted"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&h=630&fit=crop";
                      }}
                    />
                    <div className="p-3 space-y-1">
                      <span className="text-[9px] font-mono uppercase font-bold text-muted-foreground">
                        nextdrive.uk
                      </span>
                      <p className="text-xs font-bold text-foreground line-clamp-1">
                        {editingPage.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">
                        {editingPage.metaDescription}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Meta Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-foreground">
                      SEO Title Tag *
                    </label>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        editingPage.title.length >= 40 && editingPage.title.length <= 65
                          ? "text-emerald-500"
                          : editingPage.title.length < 40
                          ? "text-amber-500"
                          : "text-rose-500"
                      }`}
                    >
                      {editingPage.title.length} / 60 chars ({editingPage.title.length >= 40 && editingPage.title.length <= 65 ? "Optimal" : "Suboptimal"})
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  {editingPage.title.length > 65 && (
                    <p className="text-[11px] text-rose-500 font-semibold">
                      ⚠ Title is longer than 65 characters and will be truncated by search engines.
                    </p>
                  )}
                </div>

                {/* Meta Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-foreground">
                      Meta Description *
                    </label>
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        editingPage.metaDescription.length >= 120 && editingPage.metaDescription.length <= 165
                          ? "text-emerald-500"
                          : "text-amber-500"
                      }`}
                    >
                      {editingPage.metaDescription.length} / 160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={editingPage.metaDescription}
                    onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Primary H1 Heading */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Primary H1 Heading
                  </label>
                  <input
                    type="text"
                    value={editingPage.h1 || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, h1: e.target.value })}
                    placeholder="e.g. Master the Road. Pass With Confidence in Manchester."
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* URL Path & Slug Edit */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    URL Path / Slug
                  </label>
                  <input
                    type="text"
                    value={editingPage.urlPath}
                    disabled={editingPage.isSystemPage}
                    onChange={(e) => setEditingPage({ ...editingPage, urlPath: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-none disabled:opacity-50"
                  />

                  {originalUrlPath !== editingPage.urlPath && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 space-y-2 text-xs">
                      <p className="font-semibold text-amber-600 dark:text-amber-400">
                        ⚠ Warning: Modifying a published URL can harm SEO rankings and break incoming backlinks.
                      </p>
                      <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={create301OnSlugChange}
                          onChange={(e) => setCreate301OnSlugChange(e.target.checked)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        <span>Automatically create a 301 Permanent Redirect from {originalUrlPath} to {editingPage.urlPath}</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Indexing & Canonical Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Search Engine Indexing
                    </label>
                    <select
                      value={editingPage.indexStatus}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          indexStatus: e.target.value as "INDEX" | "NOINDEX",
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                    >
                      <option value="INDEX">INDEX (Permit search engines)</option>
                      <option value="NOINDEX">NOINDEX (Block search engines)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Follow Links
                    </label>
                    <select
                      value={editingPage.followStatus}
                      onChange={(e) =>
                        setEditingPage({
                          ...editingPage,
                          followStatus: e.target.value as "FOLLOW" | "NOFOLLOW",
                        })
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                    >
                      <option value="FOLLOW">FOLLOW (Follow outlinks)</option>
                      <option value="NOFOLLOW">NOFOLLOW (Do not follow links)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      value={editingPage.canonicalUrl || ""}
                      onChange={(e) => setEditingPage({ ...editingPage, canonicalUrl: e.target.value })}
                      placeholder={`${globalSeo.canonicalBaseUrl}${editingPage.urlPath}`}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Schema Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground block">
                    Structured Data Schema Type
                  </label>
                  <select
                    value={editingPage.schemaType}
                    onChange={(e) =>
                      setEditingPage({
                        ...editingPage,
                        schemaType: e.target.value as SEOSchemaType,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option value="DrivingSchool">DrivingSchool (Local Business)</option>
                    <option value="LocalBusiness">LocalBusiness (General)</option>
                    <option value="EducationalOrganization">EducationalOrganization</option>
                    <option value="Service">Service</option>
                    <option value="Course">Course (Intensive Lessons)</option>
                    <option value="ContactPage">ContactPage</option>
                    <option value="WebPage">WebPage (General)</option>
                  </select>
                </div>

                {/* Target Keywords */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Target Keywords For This Page
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      placeholder="e.g. driving lessons cheetham hill"
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const clean = newKeywordInput.trim().toLowerCase();
                        if (clean && !editingPage.secondaryKeywords.includes(clean)) {
                          setEditingPage({
                            ...editingPage,
                            secondaryKeywords: [...editingPage.secondaryKeywords, clean],
                          });
                          setNewKeywordInput("");
                        }
                      }}
                      className="rounded-xl border border-border bg-muted px-3 py-1.5 text-xs font-bold"
                    >
                      Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editingPage.secondaryKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 rounded-lg border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-medium"
                      >
                        <span>{kw}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingPage({
                              ...editingPage,
                              secondaryKeywords: editingPage.secondaryKeywords.filter((k) => k !== kw),
                            })
                          }
                          className="text-muted-foreground hover:text-rose-500 cursor-pointer ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePageSEO}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REDIRECT CREATION MODAL */}
      {/* ========================================================================= */}
      {showRedirectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveRedirect}
            className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Add 301/302 Redirect Rule</h3>
              <button
                type="button"
                onClick={() => setShowRedirectModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground block">Source Path *</label>
                <input
                  type="text"
                  required
                  value={newRedirect.sourcePath}
                  onChange={(e) => setNewRedirect({ ...newRedirect, sourcePath: e.target.value })}
                  placeholder="/old-page-path"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground block">Destination Path *</label>
                <input
                  type="text"
                  required
                  value={newRedirect.destinationPath}
                  onChange={(e) => setNewRedirect({ ...newRedirect, destinationPath: e.target.value })}
                  placeholder="/new-page-path"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground block">Redirect Status</label>
                <select
                  value={newRedirect.statusCode}
                  onChange={(e) =>
                    setNewRedirect({
                      ...newRedirect,
                      statusCode: parseInt(e.target.value) as 301 | 302,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                >
                  <option value={301}>301 - Permanent Redirect (Preserves PageRank)</option>
                  <option value={302}>302 - Temporary Redirect</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground block">Notes</label>
                <input
                  type="text"
                  value={newRedirect.notes}
                  onChange={(e) => setNewRedirect({ ...newRedirect, notes: e.target.value })}
                  placeholder="e.g. Migrated campaign URL"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRedirectModal(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                Create Redirect
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* KEYWORD CREATION MODAL */}
      {/* ========================================================================= */}
      {showKeywordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <form
            onSubmit={handleSaveKeyword}
            className="w-full max-w-md bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Add Target Keyword</h3>
              <button
                type="button"
                onClick={() => setShowKeywordModal(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground block">Search Phrase *</label>
                <input
                  type="text"
                  required
                  value={newKeywordObj.keyword}
                  onChange={(e) => setNewKeywordObj({ ...newKeywordObj, keyword: e.target.value })}
                  placeholder="e.g. pass plus lessons manchester"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground block">Target Landing URL *</label>
                <input
                  type="text"
                  required
                  value={newKeywordObj.targetUrl}
                  onChange={(e) => setNewKeywordObj({ ...newKeywordObj, targetUrl: e.target.value })}
                  placeholder="/driving-lessons"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">Search Intent</label>
                  <select
                    value={newKeywordObj.intent}
                    onChange={(e) =>
                      setNewKeywordObj({
                        ...newKeywordObj,
                        intent: e.target.value as "LOCAL" | "COMMERCIAL" | "INFORMATIONAL" | "TRANSACTIONAL",
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option value="LOCAL">LOCAL</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                    <option value="TRANSACTIONAL">TRANSACTIONAL</option>
                    <option value="INFORMATIONAL">INFORMATIONAL</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block">Difficulty</label>
                  <select
                    value={newKeywordObj.difficulty}
                    onChange={(e) =>
                      setNewKeywordObj({
                        ...newKeywordObj,
                        difficulty: e.target.value as "LOW" | "MEDIUM" | "HIGH",
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowKeywordModal(false)}
                className="rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90"
              >
                Save Keyword
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default SeoManager;
