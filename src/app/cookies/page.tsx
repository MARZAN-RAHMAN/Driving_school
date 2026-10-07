import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Cookie, ShieldCheck, Settings2, CheckCircle2 } from "lucide-react";

import { getPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/cookies", {
    title: "Cookie Policy | NextDrive Driving Academy",
    description:
      "Learn how NextDrive Driving Academy uses cookies and local storage to keep your session secure, remember preferences, and analyze site performance.",
  });
}

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Cookie className="h-3.5 w-3.5" />
              <span>PECR &amp; UK GDPR Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Cookie Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: October 2026 • Clear and transparent cookie usage
            </p>
          </div>

          {/* Content sections */}
          <div className="prose dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                1. What Are Cookies?
              </h2>
              <p>
                Cookies are small text files placed on your computer or mobile device when you browse websites. They are widely used to make websites work efficiently, remember your preferences, and provide diagnostic performance insights to site owners.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                2. The Cookies We Use
              </h2>
              <p>
                NextDrive uses cookies and browser local storage strictly categorized under the following purposes:
              </p>

              <div className="space-y-3">
                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Strictly Necessary Cookies (Always Active)
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      Essential
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Essential for the security and operation of NextDrive. They power authentication tokens (<code className="text-xs text-primary bg-primary/10 px-1 py-0.5 rounded font-mono">nexus_session_token</code>), CSRF protections, and load-balancing. Without these cookies, services like student dashboard access and secure payments cannot function.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      Preference &amp; Functional Cookies
                    </span>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                      Preferences
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Remember choices you make, such as Dark/Light mode theme state (<code className="text-xs text-primary bg-primary/10 px-1 py-0.5 rounded font-mono">localStorage.getItem(&apos;theme&apos;)</code>), driving transmission filter preferences (Manual vs. Automatic), and dismissible notice states.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-purple-500" />
                      Anonymous Analytics &amp; Performance
                    </span>
                    <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                      Analytics
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Allow us to monitor aggregate visitor traffic and identify high-friction points in the booking process. All analytical telemetry is anonymized and IP addresses are truncated.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" />
                3. Managing &amp; Disabling Cookies
              </h2>
              <p>
                Most modern web browsers allow you to control cookies through their browser settings. You can configure your browser to block cookies or notify you before a cookie is stored:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong className="text-foreground">Google Chrome:</strong> Settings → Privacy and Security → Third-party cookies</li>
                <li><strong className="text-foreground">Apple Safari:</strong> Preferences → Privacy → Block all cookies</li>
                <li><strong className="text-foreground">Mozilla Firefox:</strong> Settings → Privacy &amp; Security → Cookies and Site Data</li>
                <li><strong className="text-foreground">Microsoft Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>
              <p className="text-xs text-muted-foreground">
                Please note that disabling strictly necessary cookies will prevent you from signing in to the student portal or booking driving packages online.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">
                4. Questions Regarding Cookies
              </h2>
              <p>
                If you have questions regarding our cookie practices, please contact us at <a href="mailto:privacy@nextdrive.uk" className="text-primary hover:underline font-mono">privacy@nextdrive.uk</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
