import React from "react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-background text-foreground">
      <SiteNav />

      <main className="w-full flex-1 py-12 sm:py-16">
        <section className="mx-auto w-full max-w-4xl px-6 lg:px-10 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-fg-secondary">LEGAL & AGREEMENTS</p>
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Terms and Conditions</h1>
            <p className="max-w-3xl text-base text-fg-secondary">
              These terms govern your access to and use of the Complex sports facility and court management platform.
            </p>
          </div>

          <article className="rounded-2xl border border-border bg-card p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-foreground">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Complex, you agree to be bound by these Terms and Conditions. If you do not agree, please do not access or use the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">2. Use of Service & Court Reservations</h2>
              <p>
                You may use Complex only for authorized sports venue scheduling and facility administration. Misuse, unbilled slot bypass, or interference with IoT access locks is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">3. Account Responsibilities</h2>
              <p>
                Venue operators and administrators are responsible for maintaining account credential confidentiality and for all booking activity conducted under their venue profile.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">4. Payments & Stripe Settlements</h2>
              <p>
                All online slot fees processed through Complex are subject to Stripe Connect terms. Automated payouts settle directly into venue operating accounts according to configured schedules.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">5. Termination & SLA</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate operating policies or attempt security breaches. Enterprise accounts are backed by our 99.99% system uptime SLA.
              </p>
            </section>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
