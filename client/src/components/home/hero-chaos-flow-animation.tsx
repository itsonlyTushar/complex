"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";

export function HeroChaosFlowAnimation() {
  const pulseDotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    // Continuous GSAP pulse traveling smoothly along the right flow line
    if (pulseDotRef.current) {
      gsap.to(pulseDotRef.current, {
        cx: 1380,
        cy: 70,
        duration: 3.2,
        repeat: -1,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div className="relative w-full max-w-[1400px] mx-auto my-6 sm:my-10 select-none">
      <div className="w-full flex items-center justify-center relative min-h-[140px] sm:min-h-[160px]">
        
        {/* SVG Canvas - Screen Responsive Full-Width (viewBox 0 0 1400 140) */}
        <svg
          viewBox="0 0 1400 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto overflow-visible"
        >
          {/* LEFT SIDE: Continuous Organic Tangled Scribble (Manual Counter Queues & Order Confusion) */}
          <motion.path
            d="M -20 70 
               C 30 15, 55 125, 95 55 
               C 135 -5, 85 145, 155 75 
               C 205 15, 165 125, 225 50 
               C 275 -10, 235 145, 295 70 
               C 345 5, 305 135, 365 45 
               C 415 -15, 375 145, 435 65 
               C 485 10, 445 135, 505 55 
               C 555 -5, 525 135, 575 70 
               C 615 25, 605 115, 635 70 
               L 645 70"
            stroke="#114236"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
            animate={{
              d: [
                "M -20 70 C 30 15, 55 125, 95 55 C 135 -5, 85 145, 155 75 C 205 15, 165 125, 225 50 C 275 -10, 235 145, 295 70 C 345 5, 305 135, 365 45 C 415 -15, 375 145, 435 65 C 485 10, 445 135, 505 55 C 555 -5, 525 135, 575 70 C 615 25, 605 115, 635 70 L 645 70",
                "M -20 70 C 45 125, 65 15, 105 105 C 145 145, 95 5, 165 95 C 215 135, 175 15, 235 100 C 285 145, 245 -5, 305 90 C 355 135, 315 15, 375 105 C 425 145, 385 5, 445 85 C 495 135, 455 15, 515 95 C 565 145, 535 15, 585 80 C 615 115, 605 25, 635 70 L 645 70",
                "M -20 70 C 30 15, 55 125, 95 55 C 135 -5, 85 145, 155 75 C 205 15, 165 125, 225 50 C 275 -10, 235 145, 295 70 C 345 5, 305 135, 365 45 C 415 -15, 375 145, 435 65 C 485 10, 445 135, 505 55 C 555 -5, 525 135, 575 70 C 615 25, 605 115, 635 70 L 645 70",
              ],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* SECONDARY OVERLAY TANGLED SWIRL */}
          <motion.path
            d="M -10 65 
               C 45 135, 75 5, 125 115 
               C 175 25, 225 125, 275 45 
               C 325 135, 375 15, 425 115 
               C 475 25, 525 125, 575 55 
               C 615 115, 625 35, 645 70"
            stroke="#114236"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.5"
            animate={{
              d: [
                "M -10 65 C 45 135, 75 5, 125 115 C 175 25, 225 125, 275 45 C 325 135, 375 15, 425 115 C 475 25, 525 125, 575 55 C 615 115, 625 35, 645 70",
                "M -10 75 C 35 5, 85 135, 135 35 C 185 125, 235 15, 285 115 C 335 25, 385 135, 435 45 C 485 125, 535 15, 585 105 C 615 25, 625 115, 645 70",
                "M -10 65 C 45 135, 75 5, 125 115 C 175 25, 225 125, 275 45 C 325 135, 375 15, 425 115 C 475 25, 525 125, 575 55 C 615 115, 625 35, 645 70",
              ],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* RIGHT SIDE: Smooth Horizontal Line (Instant Table QR Orders & Multi-Kitchen Routing) */}
          <path
            d="M 755 70 Q 1050 68, 1420 70"
            stroke="#114236"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Traveling Pulse Dot on Right Line */}
          <circle
            ref={pulseDotRef}
            cx="755"
            cy="70"
            r="5.5"
            fill="#114236"
          />
        </svg>

        {/* CENTER CAPSULE: [ Enable COMPLEX ] */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="px-6 py-3 rounded-2xl bg-white border-2 border-[#114236] text-[#114236] font-mono font-bold text-sm sm:text-base tracking-wide shadow-md flex items-center gap-3 cursor-pointer">
            <span className="w-2.5 h-2.5 rounded-full bg-[#114236] animate-pulse"></span>
            <span>Enable COMPLEX</span>
            <ArrowRight className="w-4 h-4 text-[#114236]" />
          </div>
        </motion.div>
      </div>

      {/* Subtext Labels */}
      <div className="w-full flex items-center justify-between text-[11px] sm:text-xs font-mono font-bold text-[#114236]/75 px-4 sm:px-6 -mt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#114236]/40"></span>
          Manual Counter Queues & Order Confusion
        </span>
        <span className="flex items-center gap-1.5">
          Instant Table QR Orders & Multi-Kitchen Routing
          <span className="w-2 h-2 rounded-full bg-[#114236]"></span>
        </span>
      </div>
    </div>
  );
}
