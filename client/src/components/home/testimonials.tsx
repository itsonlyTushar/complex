"use client";

import React from "react";
import { Quote, CheckCircle, Store } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Operations Director",
      venue: "Grand Central Food Plaza (14 Vendors, 80 Tables)",
      quote:
        "Before COMPLEX, our lunch rush was absolute chaos with 50-person lines spilling out into the hallways. Now, 85% of diners sit down first, scan the table QR code, and order. Our table turnover rate increased by 42%.",
      metric: "+42% Table Turnover",
    },
    {
      name: "Elena Rostova",
      role: "Founder & Head Chef",
      venue: "Burger Hub @ Market Hall Collective",
      quote:
        "As an individual restaurant vendor, I love that COMPLEX gives us our own isolated kitchen screen. I see only my kitchen tickets, my kitchen prep staff never gets confused with neighboring vendors, and orders flow automatically.",
      metric: "Zero Kitchen Ticket Confusion",
    },
    {
      name: "David Sterling",
      role: "General Manager",
      venue: "Metro Dining Hall & Beer Garden",
      quote:
        "Single-cart multi-vendor checkout is a game changer. A family sits at Table 12: dad orders pizza, mom orders sushi, kids get tacos—one payment on their phone, and each kitchen receives its ticket instantly.",
      metric: "Single-Cart Multi-Vendor",
    },
  ];

  return (
    <section className="w-full bg-[#f0ebe3] text-[#114236] py-16 sm:py-24 border-b border-[#114236]/10">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#114236] uppercase mb-3">
            <Store className="w-4 h-4 text-[#114236]" /> Customer Stories
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#114236] tracking-tight">
            Trusted by Food Court Operators & Restaurant Vendors
          </h2>
          <p className="text-sm sm:text-base text-[#114236]/80 mt-4">
            Hear how food hall directors and restaurant vendors transformed shared dining with COMPLEX.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-[#114236]/15 shadow-sm flex flex-col justify-between hover:border-[#114236] transition-all duration-200"
            >
              <div className="space-y-4">
                <Quote className="w-8 h-8 text-[#114236]" />
                <p className="text-sm text-[#114236]/90 leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-[#114236]/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#114236] flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle className="w-3.5 h-3.5 text-[#114236]" />
                  </h4>
                  <p className="text-xs text-[#114236]/70">{rev.role}</p>
                  <p className="text-[11px] font-mono text-[#114236]/60 mt-0.5">{rev.venue}</p>
                </div>

                <div className="px-2.5 py-1 rounded bg-[#f0ebe3] border border-[#114236]/10 text-[10px] font-mono font-bold text-[#114236] shrink-0">
                  {rev.metric}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
