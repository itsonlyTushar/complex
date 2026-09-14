import React from "react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-background text-foreground">
      <SiteNav />

      <main className="w-full flex-1 py-12 sm:py-16">
        <section className="mx-auto w-full max-w-4xl px-6 lg:px-10 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-mono font-semibold uppercase tracking-[0.18em] text-fg-secondary">LEGAL & COMPLIANCE</p>
            <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Privacy Policy</h1>
            <p className="max-w-3xl text-base text-fg-secondary">
              This Privacy Policy explains how Complex collects, uses, and protects your information when
              you use our court reservation and venue management platform.
            </p>
          </div>

          <article className="rounded-2xl border border-border bg-card p-6 sm:p-10 space-y-8 text-sm sm:text-base leading-relaxed text-foreground">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p>
                We collect account details, business information, court booking activity, transaction data via Stripe, and device
                information necessary to operate and optimize the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p>
                We use your information to facilitate online court reservations, process payment settlements, trigger IoT door locks and court lighting timers, provide customer support, and maintain platform security.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
              <p>
                We share data with trusted infrastructure partners (such as Stripe for payments and AWS/Vercel for cloud hosting) required for core delivery of the software. We do not sell your personal data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
              <p>
                We implement enterprise-grade administrative and technical safeguards to protect player information and financial credentials.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">5. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your data rights, please contact our support team at <span className="font-mono font-semibold text-foreground">support@complexvenue.io</span>.
              </p>
            </section>
          </article>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
