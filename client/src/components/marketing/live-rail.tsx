"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const LANES = [
  { label: "Pending", note: "awaiting accept", count: 4 },
  { label: "Preparing", note: "on the line", count: 9 },
  { label: "Ready", note: "on the pass", count: 3 },
];

const ROWS = [
  { id: "4188", stall: "Ramen Lab", table: "22", seconds: 688 },
  { id: "4186", stall: "Taqueria", table: "07", seconds: 341 },
  { id: "4184", stall: "Wood Oven", table: "15", seconds: 126 },
  { id: "4183", stall: "Taproom", table: "03", seconds: 38 },
];

function ticketState(seconds: number) {
  if (seconds >= 720) return "late" as const;
  if (seconds >= 360) return "aging" as const;
  return "idle" as const;
}

function formatAge(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function LiveRail() {
  const reduceMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="flex flex-wrap divide-y divide-border border-b sm:divide-y-0 sm:divide-x">
        {LANES.map((lane) => (
          <div key={lane.label} className="flex-1 px-4 py-3">
            <span className="eyebrow">{lane.label}</span>
            <p className="mt-1 text-h3 leading-none" data-numeric>
              {lane.count}
            </p>
            <p className="mt-1 text-micro text-fg-tertiary">{lane.note}</p>
          </div>
        ))}
      </div>

      <ul className="divide-y divide-border">
        {ROWS.map((row, index) => {
          const seconds = row.seconds + elapsed;
          const state = ticketState(seconds);

          return (
            <motion.li
              key={row.id}
              initial={reduceMotion ? false : { opacity: 0, x: -6 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="flex items-stretch gap-3 px-4 py-2.5"
            >
              <span className="state-rail" data-state={state} />
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-caption font-medium">
                    {row.stall}
                  </p>
                  <p className="truncate text-micro text-fg-tertiary">
                    <span data-numeric>#{row.id}</span> · Table{" "}
                    <span data-numeric>{row.table}</span>
                  </p>
                </div>
                <span className="state-chip shrink-0" data-state={state}>
                  {formatAge(seconds)}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
