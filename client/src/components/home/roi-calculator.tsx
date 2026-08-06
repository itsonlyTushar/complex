"use client";

import React, { useState } from "react";
import { Calculator, ArrowRight } from "lucide-react";
import Link from "next/link";

export function RoiCalculator() {
  const [tablesCount, setTablesCount] = useState<number>(35);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(28);

  // Dynamic Calculation for Food Court Turnover Surge:
  // Baseline: 4 orders per table/day * 30 days
  // Revenue Boost with COMPLEX Table QR ordering: +35% faster turnover & zero counter queue drop-off
  const monthlyOrdersPerTable = 120;
  const currentMonthlyEst = tablesCount * monthlyOrdersPerTable * avgOrderValue;
  const projectedBoostMonthly = Math.round(currentMonthlyEst * 0.35);
  const projectedBoostAnnual = projectedBoostMonthly * 12;

  return (
    <section className="w-full bg-[#f0ebe3] text-[#114236] py-16 sm:py-24 border-b border-[#114236]/10">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#114236] uppercase mb-3">
            <Calculator className="w-4 h-4 text-[#114236]" /> Food Court Yield Projection
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#114236] tracking-tight">
            Calculate Your Table Order Revenue Surge
          </h2>
          <p className="text-sm sm:text-base text-[#114236]/80 mt-4">
            See how much additional gross turnover your food court can process by eliminating long counter queues and enabling table QR mobile ordering.
          </p>
        </div>

        {/* Calculator Body */}
        <div className="max-w-4xl mx-auto p-8 sm:p-12 rounded-2xl bg-white border border-[#114236]/15 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Controls Sliders */}
          <div className="md:col-span-7 space-y-8">
            {/* Slider 1: Number of Shared Tables */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-mono font-bold text-[#114236]">
                <span className="text-[#114236]/70 uppercase">NUMBER OF TABLES</span>
                <span className="text-xl text-[#114236]">{tablesCount} TABLES</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={tablesCount}
                onChange={(e) => setTablesCount(parseInt(e.target.value))}
                className="w-full h-2 bg-[#f0ebe3] rounded-lg appearance-none cursor-pointer accent-[#114236]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#114236]/60">
                <span>10 Tables</span>
                <span>60 Tables</span>
                <span>120 Tables</span>
              </div>
            </div>

            {/* Slider 2: Average Order Value */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-mono font-bold text-[#114236]">
                <span className="text-[#114236]/70 uppercase">AVG ORDER VALUE ($)</span>
                <span className="text-xl text-[#114236]">${avgOrderValue} / ORDER</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                step="1"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(parseInt(e.target.value))}
                className="w-full h-2 bg-[#f0ebe3] rounded-lg appearance-none cursor-pointer accent-[#114236]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#114236]/60">
                <span>$15</span>
                <span>$45</span>
                <span>$75</span>
              </div>
            </div>
          </div>

          {/* Results Output Box */}
          <div className="md:col-span-5 p-8 rounded-xl bg-[#f0ebe3] border border-[#114236]/15 space-y-6 text-center">
            <div>
              <div className="text-xs font-mono text-[#114236]/70 uppercase tracking-widest">
                ESTIMATED ANNUAL GROSS BOOST
              </div>
              <div className="text-4xl sm:text-5xl font-extrabold text-[#114236] tracking-tight mt-2">
                +${projectedBoostAnnual.toLocaleString()}
              </div>
              <div className="text-xs font-mono text-[#114236] mt-1 font-bold">
                +${projectedBoostMonthly.toLocaleString()} / month boost
              </div>
            </div>

            <div className="pt-4 border-t border-[#114236]/10 text-left space-y-2 text-xs text-[#114236]/80">
              <div className="flex justify-between">
                <span>Baseline Food Court Sales:</span>
                <span className="font-mono text-[#114236]">${currentMonthlyEst.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between">
                <span>QR Table Order Surge:</span>
                <span className="font-mono text-[#114236] font-bold">+35%</span>
              </div>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#114236] text-white text-xs font-mono font-bold tracking-widest uppercase rounded-xl hover:bg-[#114236]/90 transition-opacity shadow-sm"
            >
              <span>CLAIM YOUR BOOST</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
