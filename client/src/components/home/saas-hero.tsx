"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Play,
  X,
} from "lucide-react";
import { HeroDashboardMockup } from "./hero-dashboard-mockup";
import { HeroChaosFlowAnimation } from "./hero-chaos-flow-animation";

export function SaasHero() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  return (
    <section className="relative w-full bg-[#f0ebe3] text-[#114236] pt-8 sm:pt-14 pb-16 lg:pb-24 border-b border-[#114236]/10">
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center text-center">
        
        {/* Main Hero Display Headline */}
        <h1 className="max-w-5xl text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-[#114236] tracking-tight leading-[1.05] mb-6">
          From Long Counter Queues to{" "}
          <span className="text-[#114236] underline decoration-[#114236] underline-offset-8">
            Instant Table Orders.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-[#114236]/80 font-normal leading-relaxed mb-8">
          Place QR codes on every table. Diners scan, browse all food court restaurants, order, and pay directly from their phones while each restaurant vendor sees and fulfills only their own kitchen orders.
        </p>

        {/* High-Converting CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-6">
          {/* Primary CTA */}
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#114236] text-white font-bold text-sm tracking-widest uppercase rounded-xl hover:bg-[#114236]/90 transition-all duration-200 shadow-md group"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-white" />
          </Link>

          {/* Secondary CTA */}
          <button
            type="button"
            onClick={() => setShowDemoModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-white text-[#114236] font-semibold text-sm rounded-xl border border-[#114236]/20 hover:bg-[#114236]/5 transition-all duration-200 shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#114236]/10 flex items-center justify-center">
              <Play className="w-3 h-3 text-[#114236] fill-[#114236] ml-0.5" />
            </div>
            <span>Watch 2-Min Demo</span>
          </button>
        </div>

        {/* Dynamic Full-Width Animated Banner Block (Replaces old white metrics card) */}
        <div className="w-full my-4">
          <HeroChaosFlowAnimation />
        </div>

        {/* Product Media Showcase Component */}
        <div className="w-full mt-4">
          <HeroDashboardMockup />
        </div>

      </div>

      {/* Demo Video Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-[#114236]/20 p-6 shadow-2xl space-y-4 text-[#114236]">
            <div className="flex items-center justify-between pb-3 border-b border-[#114236]/10">
              <h3 className="text-base font-bold text-[#114236] flex items-center gap-2">
                <Play className="w-4 h-4 text-[#114236]" /> COMPLEX Food Court SaaS Overview
              </h3>
              <button
                onClick={() => setShowDemoModal(false)}
                className="p-1 rounded-md text-[#114236]/70 hover:text-[#114236] hover:bg-[#114236]/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-xl bg-[#f0ebe3] border border-[#114236]/10 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-14 h-14 rounded-full bg-white border border-[#114236] flex items-center justify-center mb-4 shadow-sm">
                <Play className="w-6 h-6 text-[#114236] fill-[#114236] ml-1" />
              </div>
              <h4 className="text-lg font-bold text-[#114236]">Interactive Platform Walkthrough</h4>
              <p className="text-sm text-[#114236]/80 max-w-md mt-2">
                Discover how food court operators and restaurant vendors use COMPLEX to enable table QR ordering, eliminate counter queues, and route kitchen orders automatically.
              </p>
              <button
                onClick={() => setShowDemoModal(false)}
                className="mt-6 px-6 py-2.5 bg-[#114236] text-white font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-[#114236]/90 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
