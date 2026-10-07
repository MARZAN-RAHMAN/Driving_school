import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  BookOpen,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AmbientHalo } from "@/components/ui/AmbientHalo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { db } from "@/lib/db";
import { getPageMetadata, BASE_PRODUCTION_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = await db.getContent();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return { title: "Article Not Found | NextDrive" };
  }

  return getPageMetadata(`/blog/${slug}`, {
    title: `${article.title} | NextDrive Guide`,
    description: article.excerpt,
  });
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const { slug } = await params;
  const [articles, settings, locations, packages] = await Promise.all([
    db.getContent(),
    db.getBusinessSettings(),
    db.getLocations(true),
    db.getLessonPackages(),
  ]);

  const article = articles.find((a) => a.slug === slug && a.status === "PUBLISHED");
  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.status === "PUBLISHED")
    .slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "author": {
      "@type": "Person",
      "name": article.authorName,
      "worksFor": {
        "@type": "DrivingSchool",
        "name": settings.businessName,
      },
    },
    "publisher": {
      "@type": "Organization",
      "name": settings.businessName,
      "logo": {
        "@type": "ImageObject",
        "url": settings.logoUrl || "https://nextdrive.uk/favicon.ico",
      },
    },
    "datePublished": `${article.updatedAt}T09:00:00Z`,
    "dateModified": `${article.updatedAt}T09:00:00Z`,
    "mainEntityOfPage": `${BASE_PRODUCTION_URL}/blog/${article.slug}`,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-border bg-surface-secondary/20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              items={[
                { label: "Blog & Guides", href: "/blog" },
                { label: article.title, href: `/blog/${article.slug}` },
              ]}
            />
          </div>
        </div>

        {/* Article Header */}
        <header className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-20 border-b border-border bg-surface-secondary/30">
          <AmbientHalo position="center" variant="primary" size="lg" />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-4">
              <span>{article.category}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {article.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span className="font-semibold text-foreground">{article.authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{article.updatedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{article.readTime || "5 min read"}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <section className="py-16 bg-background">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-foreground/90 space-y-6">
              <p className="text-lg font-medium text-foreground leading-relaxed">
                {article.content}
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-8">
                Practical Advice for Manchester Learner Drivers
              </h2>
              <p>
                When learning to drive in Greater Manchester, navigating busy multi-lane arteries like the Mancunian Way (A57M), Kingsway (A34), and complex gyratories around Cheetham Hill requires anticipation, clear mirror routines, and confident lane positioning.
              </p>

              <div className="my-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 not-prose">
                <div className="flex items-center gap-2 text-primary font-bold text-sm mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>NextDrive Instructor Insight</span>
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed">
                  Over 40% of driving test faults in Manchester happen at multi-lane roundabouts due to poor lane discipline or hesitation. Rehearsing test centre approaches with your Grade A instructor eliminates hesitation and builds instinctual confidence.
                </p>
              </div>

              <h3 className="text-xl font-bold text-foreground mt-6">
                Next Steps on Your Driving Journey
              </h3>
              <p>
                Whether you prefer manual gear control or the smooth ease of automatic tuition, having a dedicated DVSA-approved instructor ensures your driving habits adhere to current examiner standards.
              </p>
            </div>

            {/* Bottom In-Content CTA Box */}
            <div className="mt-12 rounded-3xl border border-border bg-card p-8 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <h4 className="text-lg font-bold text-foreground">
                    Ready to book your assessment lesson?
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Door-to-door driving tuition across Manchester with DVSA Grade A instructors.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-xs font-bold shadow-md hover:bg-primary/90 transition shrink-0"
                >
                  Book Assessment Lesson →
                </Link>
              </div>
            </div>

            {/* Related Guides */}
            {relatedArticles.length > 0 && (
              <div className="mt-16 pt-10 border-t border-border">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
                  Related Driving Guides:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/blog/${rel.slug}`}
                      className="group rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 transition flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase">
                          {rel.category}
                        </span>
                        <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors mt-1">
                          {rel.title}
                        </h5>
                      </div>
                      <span className="mt-4 text-xs font-semibold text-primary inline-flex items-center gap-1">
                        <span>Read article</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
