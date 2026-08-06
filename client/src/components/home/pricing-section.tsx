"use client";

import React, { useState } from "react";
import { Check, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const plans = [
    {
      name: "Starter",
      desc: "Perfect for boutique food courts, small dining halls, and mini pop-up markets.",
      priceMonthly: 49,
      priceAnnual: 39,
      popular: false,
      features: [
        "Up to 5 restaurant vendors registered",
        "Up to 25 shared table QR codes",
        "Single-cart multi-vendor payment checkout",
        "Real-time customer SMS order alerts",
        "Basic food court sales reporting",
        "Standard email support",
      ],
    },
    {
      name: "Pro",
      desc: "Designed for multi-vendor food halls, shopping mall plazas, and busy dining centers.",
      priceMonthly: 149,
      priceAnnual: 119,
      popular: true,
      features: [
        "Up to 20 restaurant vendors registered",
        "Unlimited shared table QR code maps",
        "Isolated vendor kitchen display screen (KDS)",
        "Stripe automated vendor payout splits",
        "Custom item modifiers & daily vendor specials",
        "Advanced table turnover & sales analytics",
        "Priority 24/7 manager support",
      ],
    },
    {
      name: "Enterprise",
      desc: "Built for shopping mall chains, university dining networks, and stadiums.",
      priceMonthly: 399,
      priceAnnual: 319,
      popular: false,
      features: [
        "Unlimited vendors & multi-hall locations",
        "Custom POS & hardware KDS integration",
        "Dedicated Account Director & SLA",
        "Campus card & custom wallet payment splits",
        "White-label mobile dining app options",
        "99.99% Kitchen Uptime SLA Guarantee",
        "On-site vendor onboarding & staff training",
      ],
    },
  ];

  return (
    <section className="w-full bg-[#f0ebe3] text-[#114236] py-16 sm:py-24 border-b border-[#114236]/10" id="pricing">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#114236] uppercase mb-3">
            <Zap className="w-4 h-4 text-[#114236]" /> Transparent Pricing
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#114236] tracking-tight">
            Simple Plans for Food Courts of Any Size
          </h2>
          <p className="text-sm sm:text-base text-[#114236]/80 mt-4">
            No hidden setup fees. Upgrade, downgrade, or cancel anytime with our 14-day money-back guarantee.
          </p>

          {/* Monthly / Annual Toggle */}
          <div className="inline-flex items-center gap-3 p-1.5 rounded-xl bg-white border border-[#114236]/15 mt-8 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#114236] text-white font-bold"
                  : "text-[#114236]/70 hover:text-[#114236]"
              }`}
            >
              MONTHLY BILLING
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                billingCycle === "annual"
                  ? "bg-[#114236] text-white font-bold"
                  : "text-[#114236]/70 hover:text-[#114236]"
              }`}
            >
              <span>ANNUAL BILLING</span>
              <span className="px-2 py-0.5 text-[9px] rounded bg-[#f0ebe3] text-[#114236] font-extrabold">SAVE 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = billingCycle === "annual" ? plan.priceAnnual : plan.priceMonthly;

            return (
              <div
                key={idx}
                className={`relative p-8 rounded-2xl bg-white border flex flex-col justify-between transition-all duration-200 ${
                  plan.popular
                    ? "border-[#114236] shadow-xl"
                    : "border-[#114236]/15 hover:border-[#114236]/40"
                }`}
              >
                {/* Popular Tag */}
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#114236] text-white text-[10px] font-mono font-extrabold uppercase tracking-widest shadow-md">
                    MOST POPULAR FOR FOOD HALLS
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#114236] mb-2">{plan.name}</h3>
                    <p className="text-xs text-[#114236]/75 leading-relaxed">{plan.desc}</p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-8 pb-6 border-b border-[#114236]/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-extrabold text-[#114236]">${price}</span>
                      <span className="text-xs font-mono text-[#114236]/70">/ month</span>
                    </div>
                    <div className="text-[10px] font-mono text-[#114236]/60 mt-1">
                      {billingCycle === "annual" ? "Billed annually" : "Billed monthly"}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <div className="text-xs font-mono text-[#114236]/70 font-bold uppercase mb-2">INCLUDED FEATURES</div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#114236]">
                        <Check className="w-4 h-4 text-[#114236] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/login"
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold tracking-widest uppercase text-center transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? "bg-[#114236] text-white hover:bg-[#114236]/90 font-bold shadow-md"
                      : "bg-[#f0ebe3] text-[#114236] hover:bg-[#114236]/10 border border-[#114236]/15"
                  }`}
                >
                  <span>START FREE TRIAL</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
