"use client";

import React from "react";
import Navbar from "@/components/ui/navbar";
import { SaasHero } from "@/components/home/saas-hero";
import { LogoCloud } from "@/components/home/logo-cloud";
import { SaasFeatures } from "@/components/home/saas-features";
import { SolutionsTabbed } from "@/components/home/solutions-tabbed";
import { RoiCalculator } from "@/components/home/roi-calculator";
import { PricingSection } from "@/components/home/pricing-section";
import { Testimonials } from "@/components/home/testimonials";
import { FaqSection } from "@/components/home/faq-section";
import { CtaSection } from "@/components/home/cta-section";
import { Footer } from "@/components/home/footer";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

export default function Home() {
  return (
    <SmoothScroll>
      <div className="relative min-h-screen w-full flex flex-col justify-between bg-[#f0ebe3] text-[#114236] selection:bg-[#114236] selection:text-white font-body light">
        {/* Element 2: Single Header & Navbar */}
        <Navbar />

        {/* Main Public Content Stream */}
        <main className="w-full flex-1">
          {/* Elements 3-6: SaaS Hero Section & Interactive Media */}
          <SaasHero />

          {/* Logo Cloud: Social Proof Brands */}
          <LogoCloud />

          {/* Element 7: Core Benefits & Features Grid */}
          <SaasFeatures />

          {/* Venue Industry Workflows (About Section Anchor) */}
          <div id="about">
            <SolutionsTabbed />
          </div>

          {/* Interactive ROI & Revenue Boost Calculator */}
          <RoiCalculator />

          {/* SaaS Pricing Tiers */}
          <PricingSection />

          {/* Element 8: Customer Success Stories */}
          <Testimonials />

          {/* Element 9: FAQ Accordion */}
          <FaqSection />

          {/* Element 10: Final Conversion CTA */}
          <CtaSection />
        </main>

        {/* Element 11: Multi-Column Footer & Brand Emblem */}
        <Footer />
      </div>
    </SmoothScroll>
  );
}

