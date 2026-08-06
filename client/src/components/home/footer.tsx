"use client";

import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#f0ebe3] text-[#114236] pt-16 border-t border-[#114236]/10">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-[#114236]/10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <Logo className="h-8 w-auto object-contain" />
            </Link>
            <p className="text-xs sm:text-sm text-[#114236]/80 max-w-sm leading-relaxed">
              The high-performance operating system for food courts, shared dining halls, table QR code ordering, isolated vendor kitchen terminals, and automated payout splits.
            </p>
            <div className="pt-2 space-y-2 text-xs text-[#114236]/80 font-mono">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#114236]" />
                <span>support@complexfoodcourt.io</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#114236]" />
                <span>+1 (800) 482-0194</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#114236]" />
                <span>San Francisco, CA • London, UK</span>
              </div>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#114236] uppercase">PLATFORM</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#114236]/80">
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Table QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Isolated Vendor Kitchen Kiosk
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Multi-Vendor Single Cart POS
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Stripe Payout Split Engine
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#114236] transition-colors">
                  SaaS Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#114236] uppercase">SOLUTIONS</h4>
            <ul className="space-y-2 text-xs font-semibold text-[#114236]/80">
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Shopping Mall Food Courts
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Artisanal Food Halls
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  University Dining Parks
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Food Truck Beer Gardens
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#114236] transition-colors">
                  Restaurant Vendor Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-widest text-[#114236] uppercase">STAY UPDATED</h4>
            <p className="text-xs text-[#114236]/80">
              Subscribe for monthly food court table turnover & yield optimization tips.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder="manager@foodcourt.com"
                className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#114236]/20 text-[#114236] focus:outline-none focus:border-[#114236]"
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#114236] text-white text-xs font-mono font-bold tracking-widest uppercase rounded-lg hover:bg-[#114236]/90 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>SUBSCRIBE</span>
                <ArrowRight className="w-3.5 h-3.5 text-white" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#114236]/70 font-mono gap-4">
          <div>
            © {new Date().getFullYear()} COMPLEX Food Court Inc. All rights reserved. Built for high table yield.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[#114236] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#114236] transition-colors">
              Terms of Service
            </Link>
            <Link href="/terms" className="hover:text-[#114236] transition-colors">
              Security & Compliance
            </Link>
          </div>
        </div>

      </div>

      {/* Signature Full-Bleed COMPLEX Bottom Emblem Banner */}
      <div className="w-full bg-[#114236] text-white pt-6 pb-4 sm:pt-10 sm:pb-6 md:pt-14 md:pb-8 lg:pt-16 lg:pb-10 shadow-2xl">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 flex items-baseline justify-between">
          <span className="font-heading font-extrabold uppercase text-white tracking-tighter text-[11vw] sm:text-[12.5vw] md:text-[13.5vw] lg:text-[14vw] leading-none select-none whitespace-nowrap transition-all">
            COMPLEX
          </span>
          <span className="font-bold text-white text-[4vw] sm:text-[3.2vw] md:text-[2.8vw] lg:text-[2.5vw] border-2 sm:border-3 lg:border-4 border-white rounded-full w-[1.2em] h-[1.2em] flex items-center justify-center leading-none transform -translate-y-[25%] shrink-0 ml-2">
            R
          </span>
        </div>
      </div>
    </footer>
  );
}
