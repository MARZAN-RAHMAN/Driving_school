"use client";

import React, { useState } from "react";
import { MessageSquare, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { BusinessSettings } from "@/types";

interface ContactInquiryFormProps {
  settings: BusinessSettings;
}

export function ContactInquiryForm({ settings }: ContactInquiryFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    postcode: "",
    transmission: "MANUAL",
    targetPackage: "intro",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("nextdrive:new-query"));
      }
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-xs text-card-foreground">
      <div className="max-w-lg">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <MessageSquare className="h-4 w-4" />
          Online Inquiry &amp; Fast Booking
        </div>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-card-foreground sm:text-3xl">
          Start Your Journey with {settings.businessName}
        </h2>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Fill out your details below and our senior ADI dispatch manager will match you with a certified instructor in your Manchester postcode.
        </p>
      </div>

      {submitted ? (
        <div className="mt-8 rounded-2xl bg-success/10 border border-success/20 p-6 text-center space-y-3">
          <div className="flex justify-center">
            <div className="rounded-full bg-success/20 p-3 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-sm font-bold text-success">Inquiry Received Successfully!</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
            Thank you, {form.name || "Learner"}! Our senior instructor team will contact you at {form.phone || "your mobile"} within 2 hours to confirm your first lesson schedule.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover underline"
          >
            Send another inquiry
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Jordan Rivera"
                className="mt-1.5 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="e.g. jordan.rivera@gmail.com"
                className="mt-1.5 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Mobile Phone
              </label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 07700 900123"
                className="mt-1.5 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Pickup Postcode
              </label>
              <input
                type="text"
                required
                value={form.postcode}
                onChange={(e) => setForm({ ...form, postcode: e.target.value })}
                placeholder="e.g. M1, M14, M20, SK4, WA14"
                className="mt-1.5 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none uppercase transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Transmission Preference
              </label>
              <select
                value={form.transmission}
                onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
              >
                <option value="MANUAL" className="bg-card text-card-foreground">
                  Manual Transmission (£{settings.hourlyRateManual}/hr)
                </option>
                <option value="AUTOMATIC" className="bg-card text-card-foreground">
                  Automatic Transmission (£{settings.hourlyRateAutomatic}/hr)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Target Package
              </label>
              <select
                value={form.targetPackage}
                onChange={(e) => setForm({ ...form, targetPackage: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-xs text-foreground focus:border-primary focus:outline-none transition-colors"
              >
                <option value="intro" className="bg-card text-card-foreground">
                  2-Hour Assessment Lesson (£{Math.round(settings.hourlyRateManual * 2)})
                </option>
                <option value="starter" className="bg-card text-card-foreground">
                  10-Hour Starter Block
                </option>
                <option value="intensive" className="bg-card text-card-foreground">
                  20-Hour Intensive Fast-Pass
                </option>
                <option value="complete" className="bg-card text-card-foreground">
                  30-Hour Complete Zero-to-Test
                </option>
                <option value="passplus" className="bg-card text-card-foreground">
                  Pass Plus &amp; Motorway
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
              Additional Notes / Previous Experience
            </label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Tell us if you have passed your theory test, have any previous driving experience, or have a preferred practical test date..."
              className="mt-1.5 w-full rounded-xl border border-input-border bg-input px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 py-4 text-xs font-semibold text-primary-foreground shadow-xs transition hover:bg-primary-hover sm:w-auto disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {loading ? "Transmitting..." : `Submit Inquiry to ${settings.businessName}`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
