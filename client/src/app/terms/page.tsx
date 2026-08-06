"use client";

import React from "react";
import Navbar from "@/components/ui/navbar";
import { Footer } from "@/components/home/footer";

export default function TermsPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#f0ebe3] text-[#114236] font-body light">
      <Navbar />

      <main className="w-full flex-1 py-12 sm:py-16">
        <section className="mx-auto w-full max-w-4xl px-6 lg:px-10 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#114236]/70">LEGAL & AGREEMENTS</p>
            <h1 className="text-4xl font-heading font-extrabold text-[#114236] sm:text-5xl">Terms and Conditions</h1>
            <p className="max-w-3xl text-base text-[#114236]/80">
              These terms govern your access to and use of the Complex sports facility and court management platform.
            </p>
          </div>

          <article className="rounded-2xl border border-[#114236]/15 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#114236]/90">
            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Complex, you agree to be bound by these Terms and Conditions. If you do not agree, please do not access or use the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">2. Use of Service & Court Reservations</h2>
              <p>
                You may use Complex only for authorized sports venue scheduling and facility administration. Misuse, unbilled slot bypass, or interference with IoT access locks is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">3. Account Responsibilities</h2>
              <p>
                Venue operators and administrators are responsible for maintaining account credential confidentiality and for all booking activity conducted under their venue profile.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">4. Payments & Stripe Settlements</h2>
              <p>
                All online slot fees processed through Complex are subject to Stripe Connect terms. Automated payouts settle directly into venue operating accounts according to configured schedules.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">5. Termination & SLA</h2>
              <p>
                We reserve the right to suspend or terminate accounts that violate operating policies or attempt security breaches. Enterprise accounts are backed by our 99.99% system uptime SLA.
              </p>
            </section>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
