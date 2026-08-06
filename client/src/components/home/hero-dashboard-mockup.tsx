"use client";

import React from "react";
import Image from "next/image";
import ipadMockup from "@/assets/cmshimano001v01jhpz00dyyw-4k.png";
import {
  QrCode,
  Store,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

export function HeroDashboardMockup() {
  return (
    <div className="relative w-full max-w-[1300px] mx-auto my-6 text-center flex flex-col justify-center items-center select-none px-2 sm:px-4">
      
      {/* Floating Showcase Badges (Desktop Overlay) */}
      <div className="relative w-full flex flex-col items-center">
        
        {/* Top Floating Badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-[#114236]/15 text-[#114236] text-xs font-bold shadow-lg mb-4 animate-bounce-slow">
          <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>Interactive Table QR Map • Live Vendor Telemetry</span>
        </div>

        {/* iPad Image Wrapper with Ambient Soft Shadow */}
        <div className="relative group w-full max-w-[1100px] flex justify-center items-center">
          
          {/* Ambient Emerald Backdrop Glow */}
          <div className="absolute inset-0 bg-[#114236]/12 blur-3xl rounded-full transform scale-90 group-hover:scale-95 transition-all duration-500 pointer-events-none" />

          {/* Main Transparent 4K iPad Image */}
          <Image
            src={ipadMockup}
            alt="COMPLEX Food Court Operating System Table Map iPad Interface"
            className="relative z-10 w-full h-auto max-h-[750px] object-contain drop-shadow-[0_20px_50px_rgba(17,66,54,0.18)] hover:scale-[1.01] transition-transform duration-300"
            priority
          />

          {/* Floating Pill Highlight 1 (Left - QR Table Scans) */}
          <div className="hidden lg:flex absolute left-2 top-1/3 z-20 items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#114236]/15 shadow-xl text-left transform -translate-x-4 hover:translate-x-0 transition-transform duration-300">
            <div className="w-10 h-10 rounded-xl bg-[#114236] text-white flex items-center justify-center shrink-0">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#114236]">Table QR Ordering</div>
              <div className="text-[10px] text-[#114236]/70 font-mono">Diners scan & order instantly</div>
            </div>
          </div>

          {/* Floating Pill Highlight 2 (Right - Multi-Vendor Routing) */}
          <div className="hidden lg:flex absolute right-2 bottom-1/3 z-20 items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-md border border-[#114236]/15 shadow-xl text-left transform translate-x-4 hover:translate-x-0 transition-transform duration-300">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#114236]">Multi-Vendor Kitchen Sync</div>
              <div className="text-[10px] text-[#114236]/70 font-mono">Isolated order tickets per stall</div>
            </div>
          </div>

        </div>

        {/* Bottom Feature Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-6">
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/80 border border-[#114236]/10 text-[#114236] text-xs font-semibold shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>High-Resolution Retina Display</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/80 border border-[#114236]/10 text-[#114236] text-xs font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Live Food Court Layout Editor</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/80 border border-[#114236]/10 text-[#114236] text-xs font-semibold shadow-sm">
            <Layers className="w-4 h-4 text-[#114236] shrink-0" />
            <span>Real-time Table Telemetry</span>
          </div>
        </div>

      </div>

    </div>
  );
}
