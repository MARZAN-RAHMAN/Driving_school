import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, Calendar, Clock, ArrowRight, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { db } from "@/lib/db";
import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/blog", {
    title: "Driving Guides & Learner Advice | NextDrive Manchester",
    description:
      "Expert driving guides, test centre preparation tips, manual vs automatic comparisons, and learner driver advice for Manchester motorists.",
  });
}

export default async function BlogHubPage() {
  const [settings, articles, locations, packages] = await Promise.all([
    db.getBusinessSettings(),
    db.getContent("PUBLISHED"),
    db.getLocations(true),
    db.getLessonPackages(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs items={[{ label: "Blog & Driving Guides", href: "/blog" }]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-surface-secondary/40">
          <AmbientHalo position="center" variant="dual" size="xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>Manchester Driving School Knowledge Hub</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl max-w-4xl mx-auto leading-tight">
              Driving Guides &amp; Practical Test Advice
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Actionable advice written by DVSA Grade A driving instructors. Learn how to pass your driving test first time on Greater Manchester roads.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-16 lg:py-24 bg-background border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              eyebrow="LATEST ARTICLES"
              title="Featured Guides"
              titleHighlight="&amp; Tutorials"
              subtitle="Explore our topic clusters: Learning to Drive, Test Preparation, Vehicle Types, and Intensive Courses."
            />

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {articles.map((item) => (
                <article
                  key={item.id}
                  className="rounded-3xl border border-border bg-card p-8 shadow-xs hover:border-primary/50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.readTime || "5 min read"}</span>
                      </div>
                    </div>

                    <h3 className="mt-4 text-xl font-bold text-card-foreground leading-snug">
                      <Link href={`/blog/${item.slug}`} className="hover:text-primary transition-colors">
                        {item.title}
                      </Link>
                    </h3>

                    <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{item.authorName}</span>
                    </div>

                    <Link
                      href={`/blog/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
