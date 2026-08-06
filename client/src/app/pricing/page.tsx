"use client";

import React from "react";
import Navbar from "@/components/ui/navbar";
import { PricingSection } from "@/components/home/pricing-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

export default function PricingPage() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#f0ebe3] text-[#114236] font-body light">
        <Navbar />

        <main className="w-full flex-1">
          <div className="pt-8 sm:pt-14 pb-4 text-center max-w-4xl mx-auto px-4">
            <span className="text-xs font-mono font-bold tracking-widest text-[#114236] uppercase">
              FLEXIBLE PLANS
            </span>
            <h1 className="text-4xl sm:text-6xl font-heading font-extrabold text-[#114236] mt-2">
              Pricing Built for Venue Scale
            </h1>
            <p className="text-base sm:text-lg text-[#114236]/70 mt-3 max-w-xl mx-auto">
              Choose the plan that fits your sports facility. Every plan includes a 14-day free trial with zero setup fees.
            </p>
          </div>

          <PricingSection />
          <FaqSection />
          <CtaSection />
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  );
}