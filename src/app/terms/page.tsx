import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FileCheck, AlertCircle, Clock, CheckCircle2, Car, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | NextDrive Driving Academy",
  description:
    "Terms and Conditions for NextDrive Driving Academy. Clear booking rules, 48-hour cancellation policy, pupil requirements, and practical test day terms.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 bg-background text-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="space-y-4 border-b border-border pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <FileCheck className="h-3.5 w-3.5" />
              <span>Tuition Agreement & Terms of Service</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: October 2026 • Applies to all driving tuition and package bookings
            </p>
          </div>

          {/* Terms content */}
          <div className="prose dark:prose-invert max-w-none space-y-8 text-sm sm:text-base leading-relaxed text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                1. Driving Licence &amp; Pupil Fitness
              </h2>
              <p>
                Before receiving tuition in any NextDrive vehicle, the pupil must satisfy the following legal requirements:
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong className="text-foreground">Valid Provisional Licence:</strong> You must hold a valid UK provisional driving licence entitlement for Category B vehicles and present it for verification on or prior to your first lesson.
                </li>
                <li>
                  <strong className="text-foreground">Eyesight Standard:</strong> You must be able to read a standard UK vehicle number plate from a distance of 20.5 meters (approximately 67 feet) with corrective glasses or contact lenses if prescribed.
                </li>
                <li>
                  <strong className="text-foreground">Fit to Drive:</strong> You must not be under the influence of alcohol, drugs, or prescription medications that cause drowsiness or impair motor control. If an instructor suspects impairment, the lesson will be immediately terminated with full fee forfeited.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                2. Lesson Bookings &amp; 48-Hour Cancellation Policy
              </h2>
              <p>
                To respect instructor schedules and ensure equitable availability for all learners across Manchester:
              </p>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  Mandatory 48-Hour Cancellation Rule
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  A minimum of <strong className="text-foreground">48 hours notice</strong> is required to cancel or reschedule any booked lesson without fee. Lessons cancelled with less than 48 hours notice will be charged at 100% of the scheduled lesson fee.
                </p>
              </div>
              <p>
                In the rare event that an instructor needs to postpone a lesson due to mechanical failure, adverse weather (such as severe ice or snow), or illness, the lesson will be rescheduled at the earliest mutually convenient date with zero penalty to the pupil.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                3. Block Bookings &amp; Expiry
              </h2>
              <p>
                Discounted prepaid block packages (e.g., 10, 20, or 30-hour packages) must be utilized within <strong className="text-foreground">6 months</strong> from the date of purchase. Prepaid hours are non-transferable between different individuals unless agreed in writing by NextDrive management.
              </p>
              <p>
                Refunds on unused prepaid block hours are subject to an administrative fee of £25, and previously completed hours will be recalculated at the standard single hourly rate rather than the discounted block rate.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                4. Practical Driving Test Day
              </h2>
              <p>
                Our driving instructors reserve the professional right to withhold the use of their dual-control tuition car for the DVSA practical test if, in the instructor&apos;s professional opinion, the pupil has not attained a safe standard of driving or poses a danger to public road users.
              </p>
              <p>
                Test Day vehicle hire includes 1 hour of pre-test warm-up instruction, car hire for the practical exam, full dual-control insurance coverage, and return transit home.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">
                5. Vehicle Safety &amp; Dual Controls
              </h2>
              <p>
                All NextDrive academy vehicles are equipped with He-Man dual controls and are fully insured for professional driving tuition by DVSA Approved Driving Instructors. While instructors will take all reasonable precautions to prevent incidents, pupils are expected to heed safety commands promptly.
              </p>
            </section>

            <section className="space-y-3 border-t border-border pt-6">
              <h2 className="text-xl font-bold text-foreground">
                6. Contact &amp; Enquiries
              </h2>
              <p>
                If you have questions regarding our tuition terms or need help with a booking dispute, please reach out to our customer care team:
              </p>
              <div className="rounded-xl border border-border bg-card p-4 text-xs sm:text-sm space-y-1">
                <p className="font-semibold text-foreground">NextDrive Academy Student Operations</p>
                <p>Email: <a href="mailto:support@nextdrive.uk" className="text-primary hover:underline font-mono">support@nextdrive.uk</a></p>
                <p>Telephone: <span className="font-mono text-foreground">0161 555 0192</span></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
