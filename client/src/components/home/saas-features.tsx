"use client";

import React from "react";
import {
  QrCode,
  Store,
  CreditCard,
  BellRing,
  ChevronRight,
  Zap,
} from "lucide-react";

export function SaasFeatures() {
  const features = [
    {
      icon: <QrCode className="w-6 h-6 text-[#114236]" />,
      badge: "TABLE QR ENGINE",
      title: "Instant Table Menu Scanning",
      description:
        "Diners scan unique QR codes placed on shared tables to immediately browse digital menus from every restaurant operating in the food court.",
    },
    {
      icon: <Store className="w-6 h-6 text-[#114236]" />,
      badge: "VENDOR PRIVACY",
      title: "Isolated Kitchen Kiosks",
      description:
        "Each restaurant vendor receives a dedicated order management terminal showing only their own kitchen orders—never competitor tickets.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#114236]" />,
      badge: "UNIFIED CHECKOUT",
      title: "Single-Cart Payment Split",
      description:
        "Diners combine food items from multiple vendors into one cart and pay instantly online with automated Stripe payout splits.",
    },
    {
      icon: <BellRing className="w-6 h-6 text-[#114236]" />,
      badge: "REAL-TIME TRACKING",
      title: "Live Food Status Alerts",
      description:
        "Eliminate counter queue crowding with real-time web & SMS notifications that alert diners when their order is ready for pickup.",
    },
  ];

  return (
    <section className="relative w-full py-16 sm:py-24 bg-[#f0ebe3] text-[#114236] border-b border-[#114236]/10">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#114236] uppercase mb-3">
              <Zap className="w-4 h-4 text-[#114236]" /> Platform Capabilities
            </div>
            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#114236] tracking-tight">
              Engineered for Maximum Table Turnover & Vendor Scale
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#114236]/80 leading-relaxed">
            Everything food court operators, mall managers, and restaurant vendors need to streamline shared dining operations.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group relative p-6 sm:p-7 rounded-2xl bg-white border border-[#114236]/15 hover:border-[#114236] shadow-sm transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-[#f0ebe3] border border-[#114236]/10">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-[#f0ebe3] text-[#114236] border border-[#114236]/10">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#114236] mb-3 group-hover:text-[#114236]/80 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#114236]/75 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-[#114236]/10 flex items-center text-xs font-mono font-bold text-[#114236] group-hover:translate-x-1 transition-transform">
                <span>EXPLORE WORKFLOW</span>
                <ChevronRight className="w-4 h-4 ml-1 text-[#114236]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
