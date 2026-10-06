import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | NextDrive Driving Academy",
  description:
    "NextDrive Driving Academy Privacy Policy. Learn how we handle your personal data, DVSA driving licence records, and lesson progress in compliance with UK GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>UK GDPR & Data Protection Act 2018</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: October 2026 • Effective immediately
            </p>
          </div>

          {/* Content sections */}
          <div className="prose dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. Overview & Data Controller
              </h2>
              <p>
                NextDrive Driving Academy (&ldquo;NextDrive&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates driving school tuition across Manchester and surrounding boroughs. We are committed to protecting and respecting your personal privacy in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>
              <p>
                The designated Data Controller for all student, instructor, and website user information is NextDrive Academy Ltd, registered in England & Wales.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                2. Information We Collect
              </h2>
              <p>
                To provide professional driving instruction and prepare you for your DVSA practical driving test, we collect the following categories of information:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong className="text-foreground">Identity & Contact Data:</strong> Full legal name, date of birth, residential address, telephone number, and email address.
                </li>
                <li>
                  <strong className="text-foreground">DVSA Driving Licence Data:</strong> UK provisional driving licence number and DVSA licence check verification codes.
                </li>
                <li>
                  <strong className="text-foreground">Tuition & Lesson Progress:</strong> Syllabus competencies completed, mock test results, instructor notes, lesson schedules, and test center selections.
                </li>
                <li>
                  <strong className="text-foreground">Payment Data:</strong> Transaction references, package bookings, and payment status (processed securely via regulated third-party processors like Stripe; we never store raw card details).
                </li>
                <li>
                  <strong className="text-foreground">Technical & Usage Data:</strong> IP address, device specifications, browser type, and cookie identifiers when using our online booking platform.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                3. How We Use Your Data
              </h2>
              <p>We process your data under legitimate interest and contractual necessity to:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Driving Lesson Delivery
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assigning your DVSA-approved Grade A instructor, coordinating lesson pickups, and logging curriculum progress.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    DVSA Test Coordination
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Validating your provisional driving entitlement and coordinating dual-control vehicle hire for test day.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Safety & Legal Compliance
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ensuring all drivers comply with UK road traffic acts and maintaining dual-control vehicle insurance policies.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-3.5 space-y-1">
                  <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    Service Communications
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Sending lesson reminders, reschedule notifications, invoice receipts, and progress updates via SMS/Email.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                4. Data Sharing & Third Parties
              </h2>
              <p>
                We do NOT sell, rent, or trade your personal information. We only share information with:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Your designated NextDrive Approved Driving Instructor (ADI).</li>
                <li>The Driver and Vehicle Standards Agency (DVSA) when booking or verifying driving tests.</li>
                <li>Encrypted cloud infrastructure providers (Vercel, AWS) compliant with UK GDPR safeguards.</li>
                <li>Our payment gateway partners for secure transaction settlement.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                5. Data Retention & Your Legal Rights
              </h2>
              <p>
                We retain your student training records for a period of up to 6 years following course completion for insurance and tax accounting requirements.
              </p>
              <p>Under UK GDPR, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Request access to your personal records via a Subject Access Request (SAR).</li>
                <li>Request rectification of inaccurate details.</li>
                <li>Request erasure of your records where retention is no longer legally mandated.</li>
                <li>Object to or restrict specific processing operations.</li>
              </ul>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">
                6. Contact Our Data Protection Team
              </h2>
              <p>
                For any questions regarding your data privacy or to exercise your rights, contact our Data Protection Officer:
              </p>
              <div className="rounded-xl border border-border bg-card p-4 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground">NextDrive Academy Data Protection Office</p>
                <p>Email: <a href="mailto:privacy@nextdrive.uk" className="text-primary hover:underline font-mono">privacy@nextdrive.uk</a></p>
                <p>Phone: <span className="font-mono text-foreground">0161 555 0192</span></p>
                <p>Address: 1 Hardman Square, Spinningfields, Manchester M3 3EB</p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
