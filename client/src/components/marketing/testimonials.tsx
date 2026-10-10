"use client";

import Link from "next/link";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/marketing/reveal";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  venue: string;
  initials: string;
  avatarBg?: string;
}

const TESTIMONIALS_COL_1: Testimonial[] = [
  {
    quote:
      "We were drowning in tablets and POS hardware across 14 stalls. Switching to Complex meant printing QR stickers for our 80 tables and letting guests order from everywhere at once. Average ticket size jumped 28% in our first month.",
    name: "Marcus Vance",
    role: "Managing Director",
    venue: "Union Market Hall",
    initials: "MV",
    avatarBg: "bg-blue-500/15 text-blue-400",
  },
  {
    quote:
      "As an individual vendor in a 20-stall venue, I was skeptical about sharing a cart. But our kitchen rail only sees our tickets, ticket clocks keep my team on time, and my payouts land in my account without dealing with the venue office.",
    name: "Chef Vikram Patel",
    role: "Stall Owner",
    venue: "Spice & Smoke",
    initials: "VP",
    avatarBg: "bg-amber-500/15 text-amber-400",
  },
  {
    quote:
      "Zero terminals to purchase or maintain. We onboarded 9 new food stalls in two days because all vendors need is a phone or iPad browser to run their tickets. It paid for itself during week one.",
    name: "Chloe Davenport",
    role: "Operations Lead",
    venue: "Quarterdeck Pier Market",
    initials: "CD",
    avatarBg: "bg-emerald-500/15 text-emerald-400",
  },
  {
    quote:
      "The kitchen rail ticket escalation changed our floor dynamic. Supervisors can instantly spot a stall whose ticket clock is turning orange or red from across the dining area before guests get frustrated.",
    name: "Ryan O'Connor",
    role: "Floor Director",
    venue: "Beacon Yard Food Co.",
    initials: "RO",
    avatarBg: "bg-sky-500/15 text-sky-400",
  },
  {
    quote:
      "Our food court operates with zero hardware overhead. Guests sit, order from multiple Asian street food vendors simultaneously, and get instant text updates. Service friction is completely gone.",
    name: "Tara Chen",
    role: "General Manager",
    venue: "Eastside Hawker Center",
    initials: "TC",
    avatarBg: "bg-indigo-500/15 text-indigo-400",
  },
];

const TESTIMONIALS_COL_2: Testimonial[] = [
  {
    quote:
      "Our biggest bottleneck on Friday nights was guests waiting in three different lines for drinks, tacos, and dessert. Complex lets them sit down once, order from all three, and pay in a single Stripe transaction. The split payouts happen automatically.",
    name: "Elena Rostova",
    role: "General Manager",
    venue: "The Foundry Food Yard",
    initials: "ER",
    avatarBg: "bg-purple-500/15 text-purple-400",
  },
  {
    quote:
      "Complex solved the multi-vendor payout headache. Commission splits, sales tax, and Stripe Connect payouts are handled instantly without reconciling spreadsheets every Sunday.",
    name: "Julian Rossi",
    role: "Co-Founder & COO",
    venue: "Artisan Food Quarter",
    initials: "JR",
    avatarBg: "bg-teal-500/15 text-teal-400",
  },
  {
    quote:
      "Drink sales doubled because guests no longer have to leave their table or wait in a 20-minute line at the taproom just to order a second round while waiting for their food.",
    name: "Amina Diallo",
    role: "Beverage Director",
    venue: "Harbor Collective",
    initials: "AD",
    avatarBg: "bg-rose-500/15 text-rose-400",
  },
  {
    quote:
      "Vendor onboarding used to take two weeks of IT setup. Now we send vendors a link, they upload their menu, connect their Stripe account, and start receiving orders that evening.",
    name: "Mateo Morales",
    role: "Venue Owner",
    venue: "Mercado Central",
    initials: "MM",
    avatarBg: "bg-orange-500/15 text-orange-400",
  },
  {
    quote:
      "Replacing individual counter queues with QR table ordering increased our floor capacity by 35%. People stay longer, reorder drinks effortlessly, and spend significantly more.",
    name: "Sophie Laurent",
    role: "Operations Manager",
    venue: "The Millhouse Collective",
    initials: "SL",
    avatarBg: "bg-cyan-500/15 text-cyan-400",
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-colors duration-200 hover:border-border-strong hover:bg-surface-raised/40 select-none">
      {/* Giant Stylized Quote Mark */}
      <div className="mb-3 flex items-center justify-between">
        <svg
          className="size-7 text-primary/40"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>

        <span className="flex size-6 items-center justify-center rounded-full bg-surface-sunken text-fg-tertiary transition-colors hover:text-primary">
          <Linkedin className="size-3.5" />
        </span>
      </div>

      {/* Quote Body */}
      <p className="text-body leading-relaxed text-fg-secondary">
        &ldquo;{item.quote}&rdquo;
      </p>

      {/* Author Footer */}
      <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full font-medium text-caption",
            item.avatarBg || "bg-accent text-accent-foreground",
          )}
        >
          {item.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-body text-foreground">
            {item.name}
          </div>
          <div className="truncate text-caption text-fg-tertiary">
            {item.role} <span className="mx-1 opacity-40">|</span>{" "}
            <span className="text-fg-secondary">{item.venue}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  // Duplicated arrays for seamless infinite vertical loop
  const col1Stream = [...TESTIMONIALS_COL_1, ...TESTIMONIALS_COL_1];
  const col2Stream = [...TESTIMONIALS_COL_2, ...TESTIMONIALS_COL_2];

  return (
    <section
      id="venues"
      className="scroll-mt-20 border-t bg-background px-4 py-20 sm:px-6 sm:py-28 overflow-hidden"
    >
      <style jsx global>{`
        @keyframes scroll-stream-up {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scroll-stream-down {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .marquee-col-up {
          animation: scroll-stream-up 42s linear infinite;
          will-change: transform;
        }

        .marquee-col-down {
          animation: scroll-stream-down 48s linear infinite;
          will-change: transform;
        }

        /* Smooth pause when user hovers to read a review */
        .marquee-container:hover .marquee-col-up,
        .marquee-container:hover .marquee-col-down {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-col-up,
          .marquee-col-down {
            animation: none !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-16">
          {/* Left Column: Heading & CTA */}
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-micro font-medium uppercase tracking-[0.15em] text-primary">
                Testimonials
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <h2 className="mt-4 text-balance text-h1 font-semibold tracking-[-0.026em]">
                Trusted by Food Courts and Multi-Vendor Spaces
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-4 text-lead text-fg-secondary">
                Hear from venue operators, general managers, and stall kitchens
                who tossed out clunky terminal hardware and unified their floor
                under one rail.
              </p>
            </Reveal>

            <Reveal
              delay={0.12}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg" className="rounded-full gap-2">
                <Link href="/login">
                  Operator Stories <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full"
              >
                <Link href="#pricing">See Pricing</Link>
              </Button>
            </Reveal>

            {/* Social proof footnote */}
            <Reveal delay={0.16}>
              <div className="mt-10 flex items-center gap-4 text-caption text-fg-tertiary">
                <div className="flex -space-x-2">
                  <span className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-blue-500/20 text-micro font-medium text-blue-400">
                    MV
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-purple-500/20 text-micro font-medium text-purple-400">
                    ER
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-emerald-500/20 text-micro font-medium text-emerald-400">
                    CD
                  </span>
                </div>
                <span>Over 120,000+ guest orders served</span>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Continuous Vertical Auto-Scrolling Trail */}
          <div className="marquee-container relative h-[560px] sm:h-[640px] overflow-hidden">
            {/* Top & Bottom Ambient Fade Masks for the trail effect */}
            <div className="pointer-events-none absolute -inset-x-2 top-0 z-20 h-24 bg-gradient-to-b from-background via-background/80 to-transparent" />
            <div className="pointer-events-none absolute -inset-x-2 bottom-0 z-20 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />

            <div className="grid h-full grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Column 1 (Scrolls Upwards) */}
              <div className="marquee-col-up flex flex-col gap-5">
                {col1Stream.map((item, i) => (
                  <TestimonialCard key={`col1-${item.name}-${i}`} item={item} />
                ))}
              </div>

              {/* Column 2 (Scrolls Downwards in Parallax Counter-Flow) */}
              <div className="marquee-col-down hidden sm:flex flex-col gap-5">
                {col2Stream.map((item, i) => (
                  <TestimonialCard key={`col2-${item.name}-${i}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
