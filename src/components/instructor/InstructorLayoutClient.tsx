"use client";

import React, { useState } from "react";
import { InstructorHeader } from "./InstructorHeader";
import { InstructorSidebar } from "./InstructorSidebar";
import { User, Instructor } from "@/types";

interface InstructorLayoutClientProps {
  user: User;
  instructor: Instructor;
  children: React.ReactNode;
}

export function InstructorLayoutClient({
  user,
  instructor,
  children,
}: InstructorLayoutClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <InstructorHeader
        user={user}
        instructor={instructor}
        onToggleMobileMenu={() => setMobileNavOpen((prev) => !prev)}
      />

      <div className="mx-auto flex max-w-7xl">
        <InstructorSidebar
          instructor={instructor}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
        />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
