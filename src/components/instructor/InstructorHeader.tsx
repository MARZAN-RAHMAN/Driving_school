"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Car,
  ExternalLink,
  Menu,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { InstructorLogoutButton } from "./InstructorLogoutButton";
import { User, Instructor } from "@/types";

interface InstructorHeaderProps {
  user: User;
  instructor: Instructor;
  onToggleMobileMenu?: () => void;
}

export function InstructorHeader({
  user,
  instructor,
  onToggleMobileMenu,
}: InstructorHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6 lg:px-8 text-card-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        {/* Left Side: Brand, Mobile Menu Button, and Portal Badge */}
        <div className="flex items-center gap-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              title="Open Navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link href="/instructor" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Next<span className="text-primary">Drive</span>
            </span>
          </Link>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary ring-1 ring-inset ring-secondary/20">
            <Car className="h-3.5 w-3.5 text-secondary" />
            Instructor Portal
          </span>
        </div>

        {/* Right Side: Quick Links, Theme Toggle, Profile Pill & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary transition"
          >
            Public Site
            <ExternalLink className="h-3 w-3" />
          </Link>

          <ThemeToggle />

          {/* Instructor Profile Pill */}
          <div className="flex items-center gap-2.5 border-l border-border pl-2.5 sm:pl-3">
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-bold shadow-xs overflow-hidden">
                {instructor.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                )}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-card" />
            </div>

            <div className="hidden md:block text-left">
              <span className="block text-xs font-semibold text-foreground leading-tight">
                {instructor.name}
              </span>
              <span className="block text-[10px] font-mono text-secondary">
                {instructor.badgeNumber}
              </span>
            </div>
          </div>

          <InstructorLogoutButton />
        </div>
      </div>
    </header>
  );
}
