"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Check } from "lucide-react";

export function CtaSection() {
  return (
    <section className="w-full bg-[#114236] text-white py-16 sm:py-24 shadow-xl">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12 text-center space-y-8">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-mono font-bold tracking-widest uppercase border border-white/20">
          <ShieldCheck className="w-4 h-4 text-white" /> 14-DAY RISK-FREE TRIAL
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          Ready to Eliminate Counter Queues in Your Food Court?
        </h2>

        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">
          Join 120+ food courts, dining halls, and shopping plazas using COMPLEX to accelerate table turnover and route orders automatically to isolated vendor kitchens.
        </p>

        {/* Benefits Checklist Bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-semibold text-white/90 pt-2">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-white" /> No Credit Card Required
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-white" /> Setup Table QR Maps in 15 Mins
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-white" /> Free Vendor Onboarding
          </span>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#f0ebe3] text-[#114236] font-extrabold text-sm tracking-widest uppercase rounded-xl hover:bg-white transition-all duration-200 shadow-2xl group border border-white/20"
          >
            <span>START YOUR FREE TRIAL NOW</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#114236]" />
          </Link>
        </div>

      </div>
    </section>
  );
}
