"use client";

import React from "react";
import Navbar from "@/components/ui/navbar";
import { Footer } from "@/components/home/footer";

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#f0ebe3] text-[#114236] font-body light">
      <Navbar />

      <main className="w-full flex-1 py-12 sm:py-16">
        <section className="mx-auto w-full max-w-4xl px-6 lg:px-10 space-y-8">
          <div className="space-y-3">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#114236]/70">LEGAL & COMPLIANCE</p>
            <h1 className="text-4xl font-heading font-extrabold text-[#114236] sm:text-5xl">Privacy Policy</h1>
            <p className="max-w-3xl text-base text-[#114236]/80">
              This Privacy Policy explains how Complex collects, uses, and protects your information when
              you use our court reservation and venue management platform.
            </p>
          </div>

          <article className="rounded-2xl border border-[#114236]/15 bg-white p-6 sm:p-10 shadow-sm space-y-8 text-sm sm:text-base leading-relaxed text-[#114236]/90">
            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">1. Information We Collect</h2>
              <p>
                We collect account details, business information, court booking activity, transaction data via Stripe, and device
                information necessary to operate and optimize the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">2. How We Use Your Information</h2>
              <p>
                We use your information to facilitate online court reservations, process payment settlements, trigger IoT door locks and court lighting timers, provide customer support, and maintain platform security.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">3. Information Sharing</h2>
              <p>
                We share data with trusted infrastructure partners (such as Stripe for payments and AWS/Vercel for cloud hosting) required for core delivery of the software. We do not sell your personal data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">4. Data Security</h2>
              <p>
                We implement enterprise-grade administrative and technical safeguards to protect player information and financial credentials.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-bold text-[#114236]">5. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or your data rights, please contact our support team at <span className="font-mono font-bold text-[#114236]">support@complexvenue.io</span>.
              </p>
            </section>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
