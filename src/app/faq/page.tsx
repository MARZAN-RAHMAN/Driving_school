import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { HelpCircle, Phone, ArrowRight, MessageSquare, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { db } from "@/lib/db";
import { getPageMetadata, getFaqSchema } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/faq", {
    title: "Driving Lessons FAQ Manchester | NextDrive Academy",
    description:
      "Frequently asked questions about taking driving lessons in Manchester. Learn about lesson prices, DVSA test booking, manual vs automatic, and instructor availability.",
  });
}

export default async function FaqPage() {
  const [settings, faqs, locations, packages] = await Promise.all([
    db.getBusinessSettings(),
    db.getFaqs(undefined, true),
    db.getLocations(true),
    db.getLessonPackages(),
  ]);

  const faqSchema = getFaqSchema(faqs);

  const categories = ["ALL", "General", "Lessons", "Pricing", "Tests", "Courses"];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Frequently Asked Questions", href: "/faq" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span>Learner Driver Advice &amp; Guidance</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              Driving Tuition Frequently Asked Questions
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Find transparent answers to everything you need to know about starting lessons, provisional requirements, pricing, cancellations, and DVSA practical tests in Manchester.
            </p>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="COMMUNITY ANSWERS"
              title="Verified Driving"
              titleHighlight="Tuition Knowledgebase"
              subtitle="All answers curated directly by DVSA Grade A instructors."
            />

            <div className="mt-12">
              <FaqAccordion faqs={faqs} />
            </div>

            {/* Still have questions card */}
            <div className="mt-16 rounded-3xl border border-border bg-surface-secondary/60 p-8 text-center max-w-2xl mx-auto">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-bold text-foreground">Still have questions?</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Our Manchester dispatch team is on hand 7 days a week to assist you with tailored instructor matching.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/contact"
                  className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold shadow-md hover:bg-primary/90 transition"
                >
                  Send an Online Enquiry
                </Link>
                <a
                  href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                  className="rounded-xl border border-border bg-card text-foreground px-5 py-2.5 text-xs font-bold hover:bg-surface-secondary transition"
                >
                  Call {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
