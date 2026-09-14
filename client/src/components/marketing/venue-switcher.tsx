"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const VENUES = [
  {
    key: "halls",
    label: "Mall food halls",
    headline: "Thirty stalls, one seating floor",
    body: "Shared seating means nobody owns the guest. Put a code on every table and one person can order from three stalls without getting up, while each kitchen still only sees its own line.",
    stats: [
      { label: "Stalls per hall", value: "12–35" },
      { label: "Peak window", value: "11:30–14:00" },
    ],
  },
  {
    key: "campus",
    label: "University dining",
    headline: "Semester peaks, same staff",
    body: "Lecture gaps turn into twenty-minute stampedes. Table ordering soaks up the spike without you hiring more counter staff, and campus card splits settle themselves.",
    stats: [
      { label: "Rush length", value: "20 min" },
      { label: "Card types", value: "Campus + wallet" },
    ],
  },
  {
    key: "stadium",
    label: "Stadiums & arenas",
    headline: "Queues that never form",
    body: "Half time is the entire business. People order from their seat or a concourse table and collect when their ticket gets called, so the queue never blocks the concourse.",
    stats: [
      { label: "Order spike", value: "Half-time" },
      { label: "Collection", value: "Ticket called" },
    ],
  },
  {
    key: "markets",
    label: "Street markets",
    headline: "Vendors rotate, tables don't",
    body: "Traders change every week. Your tables don't. Add or drop a vendor in a click and the same printed codes keep working, so nothing gets reprinted and nothing goes down.",
    stats: [
      { label: "Vendor setup", value: "Under 5 min" },
      { label: "Reprints needed", value: "None" },
    ],
  },
];

export function VenueSwitcher() {
  const [active, setActive] = useState(VENUES[0].key);
  const reduceMotion = useReducedMotion();
  const venue = VENUES.find((v) => v.key === active) ?? VENUES[0];

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Venue types"
        className="flex gap-1.5 overflow-x-auto pb-1"
      >
        {VENUES.map((item) => {
          const isActive = item.key === active;
          return (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(item.key)}
              className={cn(
                "shrink-0 rounded-md border px-3 py-2 text-caption whitespace-nowrap transition-colors duration-[140ms] ease-(--ease-out) outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                isActive
                  ? "border-primary/45 bg-accent font-medium text-accent-foreground"
                  : "border-border text-fg-secondary hover:border-border-strong hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-5 sm:p-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={venue.key}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-10"
          >
            <div className="max-w-xl">
              <h3 className="text-h3 text-balance">{venue.headline}</h3>
              <p className="mt-2 text-body text-fg-secondary">{venue.body}</p>
            </div>

            <dl className="flex shrink-0 gap-8 lg:flex-col lg:gap-4">
              {venue.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="eyebrow">{stat.label}</dt>
                  <dd className="mt-1 text-lead font-medium" data-numeric>
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
