"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";

const CART = {
  table: "14",
  paid: "43.50",
  items: [
    { stall: "Taqueria", name: "Birria tacos", qty: 2, price: "16.00" },
    { stall: "Ramen Lab", name: "Tonkotsu", qty: 1, price: "18.50" },
    { stall: "Taproom", name: "Hazy IPA", qty: 1, price: "9.00" },
  ],
};

/* Seeded so the server and client agree, then ticked up on the client. The first
   ticket deliberately starts just under the six-minute mark so the escalation
   happens while the page is being read. */
const TICKETS = [
  { id: "301", stall: "Taqueria", line: "2× Birria tacos", seconds: 352 },
  { id: "302", stall: "Ramen Lab", line: "1× Tonkotsu", seconds: 143 },
  { id: "303", stall: "Taproom", line: "1× Hazy IPA", seconds: 47 },
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

export function SplitTicket() {
  const reduceMotion = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  /* This sits above the fold, so the whole sequence stays under ~400ms, long
     enough to read as assembly, short enough never to look like an empty box. */
  const enter = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.28, delay, ease: [0.23, 1, 0.32, 1] as const },
        };

  return (
    <div className="rounded-xl border bg-card p-3 sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.15fr)] lg:items-center lg:gap-4">
        <motion.div
          {...enter(0.02)}
          className="rounded-lg border bg-background p-3"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="eyebrow">Guest cart</span>
            <span className="text-caption text-fg-tertiary">
              Table <span data-numeric>{CART.table}</span>
            </span>
          </div>

          <ul className="mt-2.5 flex flex-col gap-1.5">
            {CART.items.map((item) => (
              <li
                key={item.name}
                className="flex items-baseline justify-between gap-3 text-caption"
              >
                <span className="min-w-0 truncate">
                  <span data-numeric>{item.qty}</span>
                  {"× "}
                  <span className="text-fg-secondary">{item.name}</span>
                </span>
                <span className="shrink-0 text-fg-tertiary" data-numeric>
                  {item.price}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-2.5 flex items-baseline justify-between gap-2 border-t pt-2.5">
            <span className="text-caption font-medium">One payment</span>
            <span className="text-body font-medium" data-numeric>
              ${CART.paid}
            </span>
          </div>
        </motion.div>

        <motion.div
          {...enter(0.1)}
          className="flex items-center justify-center gap-2 lg:flex-col"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-border lg:h-8 lg:w-px lg:flex-none" />
          <span className="grid size-7 shrink-0 place-items-center rounded-full border bg-background text-fg-tertiary">
            <ArrowRight className="size-3.5 lg:rotate-90" />
          </span>
          <span className="h-px flex-1 bg-border lg:h-8 lg:w-px lg:flex-none" />
        </motion.div>

        <div className="flex flex-col gap-2">
          {TICKETS.map((ticket, index) => {
            const seconds = ticket.seconds + elapsed;
            const state = ticketState(seconds);

            return (
              <motion.div
                key={ticket.id}
                {...enter(0.14 + index * 0.06)}
                className="flex items-stretch gap-3 rounded-lg border bg-background p-3"
              >
                <span className="state-rail" data-state={state} />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-caption font-medium">
                      {ticket.stall}
                    </span>
                    <span className="state-chip shrink-0" data-state={state}>
                      {formatAge(seconds)}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-caption text-fg-tertiary">
                      {ticket.line}
                    </span>
                    <span
                      className="shrink-0 text-micro text-fg-tertiary"
                      data-numeric
                    >
                      #{ticket.id}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <p className="mt-3 border-t pt-3 text-caption text-fg-tertiary">
        One cart, three kitchens. Each stall only sees its own line, and the
        clock starts the second the guest pays.
      </p>
    </div>
  );
}
