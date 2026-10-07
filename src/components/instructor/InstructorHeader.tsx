"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Car,
  ExternalLink,
  Menu,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { User, Instructor } from "@/types";
import { UserAccountMenu } from "@/components/navigation/UserAccountMenu";
import { NextDriveLogo } from "@/components/ui/NextDriveLogo";

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

          <Link href="/instructor" className="flex items-center gap-2.5">
            <NextDriveLogo size={36} className="shrink-0" />
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

          {/* Instructor Interactive Account Menu */}
          <div className="border-l border-border pl-2 sm:pl-2.5">
            <UserAccountMenu
              user={{
                ...user,
                avatar: instructor.avatar || user.avatar,
                name: instructor.name || user.name,
              }}
              role="INSTRUCTOR"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
