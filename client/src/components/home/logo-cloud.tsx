"use client";

import React from "react";
import { Shield } from "lucide-react";

export function LogoCloud() {
  const partners = [
    "GRAND CENTRAL PLAZA",
    "METRO DINING HALL",
    "APEX FOOD COURT",
    "MARKET HALL COLLECTIVE",
    "URBAN EATS PLAZA",
    "HARBOR DINING HUB",
  ];

  return (
    <section className="w-full bg-[#f0ebe3] text-[#114236] py-12 border-b border-[#114236]/10">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 text-center">
        <p className="text-xs font-mono font-bold tracking-widest text-[#114236]/70 uppercase mb-8">
          TRUSTED BY LEADING FOOD COURTS, DINING HALLS & SHOPPING MALL PLAZAS WORLDWIDE
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-[#114236]/15 flex items-center justify-center text-xs font-mono font-bold text-[#114236] shadow-sm hover:border-[#114236] transition-all duration-200"
            >
              <Shield className="w-3.5 h-3.5 mr-2 text-[#114236]" />
              <span>{partner}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
