import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactInquiryForm } from "@/components/contact/ContactInquiryForm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const [settings, packages, locations] = await Promise.all([
    db.getBusinessSettings(),
    db.getLessonPackages(),
    db.getLocations(),
  ]);

  const phoneHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;
  const emergencyPhoneHref = `tel:${settings.emergencyPhone.replace(/[^\d+]/g, "")}`;
  const emailHref = `mailto:${settings.email}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200 selection:bg-indigo-500 selection:text-white font-sans">
      <Navbar initialSettings={settings} />

      <main className="flex-1">
        {/* Header section */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-border bg-surface-secondary/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-xs mb-6">
              <span className="flex h-2 w-2 rounded-full bg-success animate-pulse" />
              <span>Direct Dispatch &amp; Learner Support</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-primary font-bold">{settings.dvsaSchoolId}</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Get in Touch with {settings.businessName}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg max-w-2xl mx-auto">
              Have questions about driving lessons, instructor availability, or practical test car hire? Our dispatch team is here to help.
            </p>
          </div>
        </section>

        {/* Contact details & Enquiry form grid */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Left Column: Direct Contact Channels */}
              <div className="space-y-6 lg:col-span-1">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Direct Contact Channels
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Live updates configured by Academy administration
                  </p>
                </div>

                {/* Primary Hotline Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:border-primary/50 text-card-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Lesson Bookings &amp; Inquiries
                      </span>
                      <a
                        href={phoneHref}
                        className="mt-0.5 block text-base font-bold text-foreground hover:text-primary transition"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Lines open daily during operating hours for booking assessments, instructor queries, and theory support.
                  </p>
                </div>

                {/* Emergency Hotline Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:border-error/50 text-card-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-error/10 text-error">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Test Day / Urgent Line
                      </span>
                      <a
                        href={emergencyPhoneHref}
                        className="mt-0.5 block text-base font-bold text-foreground hover:text-error transition"
                      >
                        {settings.emergencyPhone}
                      </a>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    For active students taking practical driving tests today or requiring emergency dispatch assistance.
                  </p>
                </div>

                {/* Email Support Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs transition hover:border-primary/50 text-card-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Official Student Support
                      </span>
                      <a
                        href={emailHref}
                        className="mt-0.5 block text-base font-bold text-foreground hover:text-primary transition"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Send enquiries, proof of provisional license, or voucher confirmations. Typical response in 2 hours.
                  </p>
                </div>

                {/* Head Office Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-foreground shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        Registered Academy Headquarters
                      </span>
                      <p className="mt-1 text-xs font-semibold text-foreground leading-relaxed">
                        {settings.headOfficeAddress}
                      </p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                        Company #{settings.companyRegistrationNumber} • {settings.tradingName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Operating Hours Card */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-xs text-card-foreground">
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <span className="text-xs font-bold text-foreground">Operating Hours</span>
                      <p className="text-[10px] text-muted-foreground">Manchester Instructor Dispatch</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Monday – Friday:</span>
                      <span className="font-semibold text-foreground">
                        {settings.weekdayOpeningTime} – {settings.weekdayClosingTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span>Saturday – Sunday:</span>
                      <span className="font-semibold text-foreground">
                        {settings.weekendOpeningTime} – {settings.weekendClosingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive Send Inquiry & Rapid Booking */}
              <div className="lg:col-span-2">
                <ContactInquiryForm settings={settings} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer settings={settings} packages={packages} locations={locations} />
    </div>
  );
}
