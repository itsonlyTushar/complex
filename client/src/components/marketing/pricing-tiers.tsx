"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type BillingCycle = "monthly" | "annual";

export const PLANS = [
  {
    name: "Starter",
    audience: "Boutique courts",
    blurb: "Small halls, market stalls and pop-ups still figuring it out.",
    monthly: 49,
    annual: 39,
    featured: false,
    features: [
      "Up to 5 restaurant vendors",
      "Up to 25 table QR codes",
      "Single-cart multi-vendor checkout",
      "Real-time SMS order alerts",
      "Basic sales reporting",
      "Email support",
    ],
  },
  {
    name: "Pro",
    audience: "Busy food halls",
    blurb: "Multi-vendor halls and mall plazas with a proper lunch rush.",
    monthly: 149,
    annual: 119,
    featured: true,
    features: [
      "Up to 20 restaurant vendors",
      "Unlimited table QR maps",
      "Isolated kitchen display per stall",
      "Automated Stripe payout splits",
      "Modifiers and daily specials",
      "Table turnover analytics",
      "Priority 24/7 support",
    ],
  },
  {
    name: "Enterprise",
    audience: "Networks and stadiums",
    blurb: "Mall chains, university dining and arena concourses.",
    monthly: 399,
    annual: 319,
    featured: false,
    features: [
      "Unlimited vendors and halls",
      "Custom POS and KDS integration",
      "Dedicated account director",
      "Campus card and wallet splits",
      "White-label diner app",
      "99.99% uptime guarantee",
      "On-site onboarding and training",
    ],
  },
];

export function BillingToggle({
  value,
  onChange,
}: {
  value: BillingCycle;
  onChange: (next: BillingCycle) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Billing cycle"
      className="inline-flex items-center rounded-lg border bg-card p-1"
    >
      {(["monthly", "annual"] as const).map((cycle) => {
        const isActive = value === cycle;
        return (
          <button
            key={cycle}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(cycle)}
            className={cn(
              "rounded-md px-3 py-1.5 text-caption transition-colors duration-[140ms] ease-(--ease-out) outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
              isActive
                ? "bg-accent font-medium text-accent-foreground"
                : "text-fg-secondary hover:text-foreground",
            )}
          >
            {cycle === "monthly" ? "Monthly" : "Annual"}
            {cycle === "annual" && (
              <span className="ml-1.5 text-micro text-state-ready">−20%</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Price({ value, cycle }: { value: number; cycle: BillingCycle }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="flex items-baseline gap-1.5">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={`${value}-${cycle}`}
          className="text-display leading-none"
          data-numeric
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
        >
          ${value}
        </motion.span>
      </AnimatePresence>
      <span className="text-caption text-fg-tertiary">/ month</span>
    </span>
  );
}

export function PricingTiers({
  compact = false,
  cycle,
  onCycleChange,
}: {
  compact?: boolean;
  cycle: BillingCycle;
  onCycleChange: (next: BillingCycle) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <BillingToggle value={cycle} onChange={onCycleChange} />

      <div className="grid w-full gap-4 md:grid-cols-3 md:items-start">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-xl border bg-card p-5 transition-colors duration-[140ms] ease-(--ease-out)",
              plan.featured
                ? "border-primary/45 md:-mt-2 md:pb-7"
                : "hover:border-border-strong",
            )}
          >
            {plan.featured && (
              <span className="absolute -top-2.5 left-5 rounded-sm bg-primary px-2 py-0.5 text-micro font-medium text-primary-foreground">
                Most popular
              </span>
            )}

            <span className="eyebrow">{plan.audience}</span>
            <h3 className="mt-1.5 text-h3">{plan.name}</h3>
            <p className="mt-1 text-caption text-fg-tertiary">{plan.blurb}</p>

            <div className="mt-4 border-t pt-4">
              <Price
                value={cycle === "annual" ? plan.annual : plan.monthly}
                cycle={cycle}
              />
              <p className="mt-1 text-micro text-fg-tertiary">
                {cycle === "annual" ? "Billed annually" : "Billed monthly"} · 14-day
                trial
              </p>
            </div>

            {!compact && (
              <ul className="mt-4 flex flex-1 flex-col gap-2 border-t pt-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-caption">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-state-ready" />
                    <span className="text-fg-secondary">{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            <Button
              asChild
              variant={plan.featured ? "default" : "outline"}
              className={cn("w-full", compact ? "mt-4" : "mt-5")}
            >
              <Link href="/login">
                {plan.name === "Enterprise" ? "Talk to sales" : "Start free trial"}
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PricingTeaser() {
  const [cycle, setCycle] = useState<BillingCycle>("annual");
  return <PricingTiers compact cycle={cycle} onCycleChange={setCycle} />;
}
