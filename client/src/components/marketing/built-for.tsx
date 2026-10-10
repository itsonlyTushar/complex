"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Building2,
  Tent,
  ShoppingBag,
  Gamepad2,
  Trees,
  Check,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCw,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

interface VenueItem {
  id: string;
  number: string;
  icon: LucideIcon;
  tag: string;
  title: string;
  shortLabel: string;
  description: string;
  highlight: string;
  specs: { label: string; value: string }[];
}

const VENUES: VenueItem[] = [
  {
    id: "food-courts",
    number: "01",
    icon: UtensilsCrossed,
    tag: "Communal Seating",
    title: "Food Courts",
    shortLabel: "Food Court",
    description:
      "Eliminate the 15-minute queue at four different stalls. Guests sit down once, order from any vendor on the floor, and get pinged when their tickets are ready for collection.",
    highlight: "Central table QR stickers & zero counter crush",
    specs: [
      { label: "Scan to Paid", value: "38s avg" },
      { label: "Stalls per Tray", value: "3.2 stalls" },
      { label: "Queue Reduction", value: "-74%" },
    ],
  },
  {
    id: "food-halls",
    number: "02",
    icon: Building2,
    tag: "Unified Checkout",
    title: "Food Halls",
    shortLabel: "Food Hall",
    description:
      "Curated artisan kitchens, dessert counters, and craft cocktail bars on one bill. Guests mix gourmet tacos, ramen, and drinks in a single basket without splitting bills manually.",
    highlight: "Single-cart ordering & automated Stripe Connect payouts",
    specs: [
      { label: "Cart Experience", value: "Unified 1-cart" },
      { label: "Payout Route", value: "Stripe Connect" },
      { label: "Split Latency", value: "Real-time" },
    ],
  },
  {
    id: "open-markets",
    number: "03",
    icon: Tent,
    tag: "Pop-ups & Night Markets",
    title: "Open Food Markets",
    shortLabel: "Food Market",
    description:
      "High vendor turnover with zero permanent infrastructure. Onboard pop-up stalls in minutes and run high-volume weekend night crowds without running Ethernet or POS cables.",
    highlight: "100% browser-based with instant stall setup",
    specs: [
      { label: "Stall Setup", value: "Under 5 mins" },
      { label: "Hardware Needed", value: "Zero (BYO Phone)" },
      { label: "Offline Buffer", value: "Supported" },
    ],
  },
  {
    id: "malls",
    number: "04",
    icon: ShoppingBag,
    tag: "Multi-Zone Dining",
    title: "Malls & Shopping Centers",
    shortLabel: "Mall Dining",
    description:
      "Cover expansive dining terraces, multi-level retail concourses, and anchor food wings. Shoppers relax at their seats instead of hovering around congested counter collection screens.",
    highlight: "Wide-radius table zones & instant SMS notifications",
    specs: [
      { label: "Floor Range", value: "Multi-level" },
      { label: "Alert Method", value: "SMS + Web Hook" },
      { label: "Turnover Boost", value: "+22% speed" },
    ],
  },
  {
    id: "gaming-arcades",
    number: "05",
    icon: Gamepad2,
    tag: "Stations & Lanes",
    title: "Gaming Arcades & Arenas",
    shortLabel: "Arcades & VR",
    description:
      "Keep players fully immersed at consoles, bowling lanes, VR bays, and arcade cabinets. Order snacks and draft beers directly to their station without losing match momentum.",
    highlight: "Booth and seat delivery without leaving the game",
    specs: [
      { label: "Seat Routing", value: "Booth / Lane ID" },
      { label: "Runner Alert", value: "Runner Display" },
      { label: "Game Time Lost", value: "0 minutes" },
    ],
  },
  {
    id: "parks",
    number: "06",
    icon: Trees,
    tag: "Open-Air & Beer Gardens",
    title: "Parks & Beer Gardens",
    shortLabel: "Outdoor Parks",
    description:
      "Food truck yards, festival plazas, and outdoor dining parks. Weatherproof table codes on picnic benches let guests order across sprawling grounds with mobile battery-friendly rails.",
    highlight: "Weatherproof QR tags & mobile battery-friendly rails",
    specs: [
      { label: "Coverage", value: "Sprawling grounds" },
      { label: "Weather Resilient", value: "Outdoor Vinyl" },
      { label: "Ticket Rail", value: "Battery-saver KDS" },
    ],
  },
];

const TOTAL_VENUES = VENUES.length;
const STEP_ANGLE = 360 / TOTAL_VENUES; // 60 deg each
const AUTOPLAY_INTERVAL = 4800; // ms per step

export function BuiltForSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextVenue = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL_VENUES);
  }, []);

  const prevVenue = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL_VENUES) % TOTAL_VENUES);
  }, []);

  // Autoplay loop that pauses when hovered or toggled off
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextVenue();
    }, AUTOPLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, nextVenue]);

  const activeVenue = VENUES[activeIndex];
  const Icon = activeVenue.icon;

  // Rotation offset: item 0 starts at top (270 deg or 0), spinning dial turns opposite to align active at pointer
  const dialRotation = -activeIndex * STEP_ANGLE;

  return (
    <section
      id="built-for"
      className="relative scroll-mt-20 border-t bg-background px-4 py-20 sm:px-6 sm:py-28 overflow-hidden"
    >
      <span id="how-it-works" className="absolute -top-20" aria-hidden="true" />

      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <Reveal>
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-micro font-medium uppercase tracking-[0.15em] text-primary">
              Built For
            </div>
            <h2 className="mt-4 text-balance text-h1 font-semibold tracking-[-0.026em]">
              Engineered for every space where vendors share the floor
            </h2>
            <p className="mt-4 text-lead text-fg-secondary">
              Spin through the floor plans. Whether your venue is indoor,
              outdoor, or entertainment-driven, Complex unifies orders into one
              rail.
            </p>
          </div>
        </Reveal>

        {/* Main Rotary Dial Stage */}
        <div
          className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Left Column: Rotary Dial Wheel with Mechanical Phone Dial Styling */}
          <div className="flex flex-col items-center justify-center lg:col-span-5">
            <div className="relative flex size-[320px] items-center justify-center sm:size-[380px]">
              {/* Subtle ambient backglow */}
              <div className="pointer-events-none absolute inset-8 rounded-full bg-primary/5 blur-3xl" />

              {/* Outer stationary guide track with tick marks */}
              <div className="absolute inset-0 rounded-full border border-border/80" />
              <div className="absolute inset-4 rounded-full border border-dashed border-border/60" />

              {/* Rotary Stopper / Finger stop bracket at the top (classic rotary dial stop) */}
              <div className="absolute -top-1.5 z-30 flex flex-col items-center">
                <div className="flex h-6 w-3 items-center justify-center rounded-sm border border-primary bg-primary text-primary-foreground shadow-sm">
                  <div className="h-2 w-0.5 rounded-full bg-white" />
                </div>
                <div className="h-2 w-0.5 bg-primary" />
              </div>

              {/* Rotating Dial Disc */}
              <div
                className="relative size-[280px] sm:size-[330px] rounded-full border border-border bg-card/60 backdrop-blur-xs transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                style={{
                  transform: `rotate(${dialRotation}deg)`,
                }}
              >
                {/* Center Core Hub */}
                <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 flex size-20 sm:size-24 flex-col items-center justify-center rounded-full border border-border bg-surface-sunken shadow-inner">
                  <RotateCw
                    className={cn(
                      "size-5 text-fg-tertiary transition-transform duration-700",
                      isPlaying &&
                        !isHovered &&
                        "animate-spin [animation-duration:9s]",
                    )}
                  />
                  <span className="mt-1 font-mono text-micro font-medium text-fg-secondary">
                    {activeVenue.number}/06
                  </span>
                </div>

                {/* 6 Rotary Finger Holes / Numbered Dial Nodes */}
                {VENUES.map((venue, index) => {
                  const angle = index * STEP_ANGLE;
                  // Radius from center of dial to node center
                  const radius = 108; // px for small, scaled via transform in %
                  // Position on the circle perimeter
                  const rad = ((angle - 90) * Math.PI) / 180;
                  const x = 50 + 38 * Math.cos(rad); // percent
                  const y = 50 + 38 * Math.sin(rad); // percent
                  const isCurrent = index === activeIndex;

                  return (
                    <button
                      key={venue.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Select ${venue.title}`}
                      className={cn(
                        "group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer outline-none transition-all duration-300",
                        "size-12 sm:size-14 rounded-full border flex items-center justify-center shadow-xs",
                        isCurrent
                          ? "border-primary bg-primary text-primary-foreground scale-110 shadow-md shadow-primary/25 z-20"
                          : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-accent/80",
                      )}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                      }}
                    >
                      {/* Counter-rotate label so numbers and icons stay upright like a rotary dial */}
                      <div
                        className="flex flex-col items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
                        style={{
                          transform: `rotate(${-dialRotation}deg)`,
                        }}
                      >
                        <span className="font-mono text-xs font-semibold">
                          {venue.number}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Venue Showcase Card */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 shadow-sm">
              {/* Dial slot indicator pill */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                    <Icon className="size-5.5" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">
                      {activeVenue.title}
                    </h3>
                  </div>
                </div>

                <span className="rounded-full border border-border bg-surface-sunken px-3 py-1 text-micro font-medium uppercase tracking-wider text-fg-secondary">
                  {activeVenue.tag}
                </span>
              </div>

              {/* Description */}
              <div className="mt-5">
                <p className="text-body leading-relaxed text-fg-secondary min-h-[72px]">
                  {activeVenue.description}
                </p>
              </div>

              {/* Blueprint Specs Grid */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-border/70 bg-accent/25 p-3.5">
                {activeVenue.specs.map((spec) => (
                  <div key={spec.label} className="text-left">
                    <div className="text-micro text-fg-tertiary">
                      {spec.label}
                    </div>
                    <div className="mt-0.5 font-mono text-caption font-semibold text-foreground">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border/80 pt-5">
                <div className="flex items-center gap-2">
                  {VENUES.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-300",
                        idx === activeIndex
                          ? "w-7 bg-primary"
                          : "w-2 bg-border hover:bg-fg-tertiary",
                      )}
                      aria-label={`Jump to ${v.title}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Button asChild size="sm" className="gap-1.5 rounded-full">
                    <Link href="/login">
                      Try on this venue <ArrowUpRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
