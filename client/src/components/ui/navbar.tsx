"use client";

import React, { useState } from "react";
import Link from "next/link";
import Logo from "./logo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "SOLUTIONS", href: "/#solutions" },
    { label: "PRICING", href: "/pricing" },
    { label: "FEATURES", href: "/#features" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f0ebe3]/90 backdrop-blur-md border-b border-[#114236]/10">
      <nav className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Brand Logo - Crisp Dark Green Image */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Logo className="h-8 md:h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation Links - Deep Forest Green (#114236) */}
        <div className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-[12px] font-bold tracking-[0.18em] text-[#114236] uppercase">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors duration-200 hover:text-[#114236]/70 text-[#114236]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-[11px] font-extrabold tracking-widest uppercase rounded-full bg-[#114236] text-white hover:bg-[#114236]/90 transition-all duration-200 shadow-sm"
          >
            LOGIN
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#114236] p-2 focus:outline-none rounded-md hover:bg-[#114236]/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[70px] bg-[#f0ebe3] border-b border-[#114236]/10 z-50 px-6 py-8 shadow-xl">
          <ul className="flex flex-col gap-6 text-xs font-bold tracking-widest text-[#114236] uppercase">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-1 hover:text-[#114236]/70 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-[#114236]/10 flex items-center justify-between">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold tracking-wider uppercase rounded-full bg-[#114236] text-white hover:bg-[#114236]/90 transition-colors"
            >
              LOGIN
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;