"use client";

import React, { useState } from "react";
import { Check, Layers3 } from "lucide-react";

export function SolutionsTabbed() {
  const [activeTab, setActiveTab] = useState<"mall" | "market" | "campus" | "garden">("mall");

  const solutions = {
    mall: {
      title: "Shopping Mall Food Courts",
      desc: "Eliminate long standing queues during peak lunch hours. Diners find a table, scan the QR code, and order from 10+ mall vendors in a single checkout.",
      highlights: [
        "Table QR map generation for 100+ shared seating tables",
        "Multi-vendor revenue share & automated daily bank payouts",
        "Real-time kitchen order queue monitoring for hall directors",
        "Peak-hour table turnover velocity analytics",
      ],
      statTitle: "Table Turnover",
      statVal: "+42%",
    },
    market: {
      title: "Multi-Vendor Food Halls & Markets",
      desc: "Empower artisanal food stalls and pop-up kitchens with simple digital menus and isolated order terminals without expensive POS hardware.",
      highlights: [
        "Instant vendor onboarding in under 5 minutes",
        "Vendor-isolated kitchen display screen (KDS) access",
        "Custom item modifiers, combos & daily specials",
        "Contactless Apple Pay & Google Pay single-cart checkout",
      ],
      statTitle: "Queue Time Saved",
      statVal: "18 mins",
    },
    campus: {
      title: "University & Corporate Dining Parks",
      desc: "Manage high-volume rush hours effortlessly. Students and employees order from their desks or tables and receive SMS alerts when food is ready.",
      highlights: [
        "Campus card & digital wallet payment integration",
        "Scheduled pickup times to prevent cafeteria crowding",
        "Vendor sales telemetry & inventory alerts",
        "Multi-building dining hall floor plan mapping",
      ],
      statTitle: "Diner Satisfaction",
      statVal: "99.4%",
    },
    garden: {
      title: "Shared Table Food Parks & Beer Gardens",
      desc: "Serve large outdoor dining spaces seamlessly. Diners order drinks from the bar and food from food trucks without leaving their seats.",
      highlights: [
        "Outdoor weatherproof QR table sticker support",
        "Bar & food truck split ordering in one payment",
        "Live SMS notification when order is ready for pickup",
        "Zero unbilled orders & automated refund handling",
      ],
      statTitle: "Gross Order Boost",
      statVal: "+35%",
    },
  };

  const current = solutions[activeTab];

  return (
    <section className="w-full bg-[#f0ebe3] text-[#114236] py-16 sm:py-24 border-b border-[#114236]/10">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#114236] uppercase mb-3">
            <Layers3 className="w-4 h-4 text-[#114236]" /> Tailored Industry Workflows
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#114236] tracking-tight">
            Custom Built for Every Shared Dining Venue
          </h2>
          <p className="text-sm sm:text-base text-[#114236]/80 mt-4">
            Whether you manage a shopping mall food court, an artisanal food hall, or an outdoor food truck park, COMPLEX adapts to your dining layout.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {[
            { id: "mall", label: "Mall Food Courts" },
            { id: "market", label: "Multi-Vendor Halls" },
            { id: "campus", label: "Campus Dining" },
            { id: "garden", label: "Food Parks & Gardens" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all ${
                activeTab === tab.id
                  ? "bg-[#114236] text-white shadow-sm"
                  : "bg-white text-[#114236] hover:bg-[#114236]/5 border border-[#114236]/15"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Box */}
        <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#114236]/15 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-6">
            <span className="text-xs font-mono font-bold text-[#114236] uppercase tracking-wider">
              INDUSTRY SOLUTION
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-[#114236]">
              {current.title}
            </h3>
            <p className="text-sm sm:text-base text-[#114236]/80 leading-relaxed">
              {current.desc}
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {current.highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#114236]">
                  <div className="p-1 rounded bg-[#f0ebe3] border border-[#114236]/10 text-[#114236] shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Metrics Card */}
          <div className="lg:col-span-4 p-8 rounded-xl bg-[#f0ebe3] border border-[#114236]/15 text-center space-y-3">
            <div className="text-xs font-mono text-[#114236]/70 uppercase tracking-widest">
              AVERAGE IMPACT
            </div>
            <div className="text-5xl sm:text-6xl font-extrabold text-[#114236] tracking-tight">
              {current.statVal}
            </div>
            <div className="text-xs font-mono text-[#114236] uppercase font-bold">
              {current.statTitle}
            </div>
            <p className="text-xs text-[#114236]/70 pt-3 border-t border-[#114236]/10">
              Verified metric across 120+ active COMPLEX food court installations.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
