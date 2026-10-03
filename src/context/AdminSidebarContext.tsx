"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AdminSidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapse: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobile: (open?: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

const STORAGE_KEY = "nextdrive_admin_sidebar_collapsed";

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Restore collapsed preference from localStorage without causing hydration mismatch
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setIsCollapsed(saved === "true");
        }
      } catch {
        // Ignore storage errors in restricted contexts
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsed(collapsed);
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {}
  }, []);

  const toggleMobile = useCallback((open?: boolean) => {
    setIsMobileOpen((prev) => (typeof open === "boolean" ? open : !prev));
  }, []);

  // Global keyboard shortcut: Cmd+B or Ctrl+B toggles sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        // Prevent default browser bookmark shortcut if focused inside admin
        e.preventDefault();
        toggleCollapse();
      } else if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapse, isMobileOpen]);

  // Lock/unlock body scroll for mobile drawer
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <AdminSidebarContext.Provider
      value={{
        isCollapsed,
        isMobileOpen,
        toggleCollapse,
        setCollapsed,
        toggleMobile,
      }}
    >
      {children}
    </AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) {
    throw new Error("useAdminSidebar must be used within an AdminSidebarProvider");
  }
  return context;
}
