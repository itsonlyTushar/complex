"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

type TicketState = "idle" | "ready" | "aging" | "late";

const serviceQueue: {
  label: string;
  count: number;
  state: TicketState;
  note: string;
}[] = [
  { label: "Pending", count: 6, state: "aging", note: "awaiting accept" },
  { label: "Preparing", count: 11, state: "idle", note: "on the line" },
  { label: "Ready", count: 3, state: "ready", note: "waiting on pass" },
];

const coversByHour = [
  { hour: "09", covers: 4 },
  { hour: "10", covers: 9 },
  { hour: "11", covers: 22 },
  { hour: "12", covers: 48 },
  { hour: "13", covers: 41 },
  { hour: "14", covers: 17 },
  { hour: "15", covers: 8 },
  { hour: "16", covers: 11 },
  { hour: "17", covers: 19 },
  { hour: "18", covers: 37 },
  { hour: "19", covers: 44 },
  { hour: "20", covers: 26 },
];

const recentOrders: {
  id: string;
  table: string;
  total: string;
  age: string;
  state: TicketState;
  status: string;
}[] = [
  { id: "4182", table: "14", total: "43.50", age: "08:12", state: "aging", status: "Preparing" },
  { id: "4181", table: "07", total: "18.00", age: "03:40", state: "idle", status: "Preparing" },
  { id: "4180", table: "22", total: "61.25", age: "01:55", state: "ready", status: "Ready" },
  { id: "4179", table: "03", total: "27.80", age: "00:48", state: "idle", status: "Pending" },
];

const peakCovers = Math.max(...coversByHour.map((d) => d.covers));

/* The busiest hour is the one an operator is actually looking for, so it is the
   only bar that gets full-strength colour; the rest recede to a quiet ramp. */
function CoverBar(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  payload?: { covers: number };
}) {
  const { x = 0, y = 0, width = 0, height = 0, payload } = props;
  const isPeak = payload?.covers === peakCovers;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={3}
      style={{
        fill: isPeak ? "var(--chart-1)" : "var(--chart-3)",
        fillOpacity: isPeak ? 1 : 0.4,
      }}
    />
  );
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-overlay rounded-md px-2.5 py-1.5">
      <div className="text-micro text-fg-tertiary">{label}:00</div>
      <div className="text-body font-medium" data-numeric>
        {payload[0].value} covers
      </div>
    </div>
  );
}

export default function AdminPage() {
  const openTickets = serviceQueue.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-h2">Service overview</h1>
          <p className="mt-0.5 text-caption text-fg-tertiary">
            Tuesday, 14 September · lunch service
          </p>
        </div>
        <div className="flex items-center gap-2 text-caption text-fg-tertiary">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-state-ready opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-state-ready" />
          </span>
          Live
        </div>
      </div>

      {/*
        The focal element. A vendor opening this mid-service needs one answer
        first (is anything waiting on me), so the open queue and the oldest
        ticket age lead the page and everything else is demoted below them.
      */}
      <section className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-stretch divide-y divide-border sm:divide-y-0 sm:divide-x">
          <div className="flex min-w-[210px] flex-1 flex-col justify-center gap-1 p-4">
            <span className="eyebrow">Open tickets</span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-display leading-none" data-numeric>
                {openTickets}
              </span>
              <span className="state-chip" data-state="aging">
                oldest 08:12
              </span>
            </div>
          </div>

          {serviceQueue.map((stage) => (
            <div
              key={stage.label}
              className="flex min-w-[150px] flex-1 items-stretch gap-3 p-4"
            >
              <span className="state-rail" data-state={stage.state} />
              <div className="flex flex-col justify-center gap-0.5">
                <span className="text-caption font-medium text-fg-secondary">
                  {stage.label}
                </span>
                <span className="text-h2 leading-none" data-numeric>
                  {stage.count}
                </span>
                <span className="text-micro text-fg-tertiary">{stage.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/*
        Supporting numbers ride in one dense strip rather than four equal cards,
        so they read as context for the queue above instead of competing with it.
      */}
      <section className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border bg-card px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Revenue today</span>
          <div className="flex items-baseline gap-2">
            <span className="text-h1 leading-none" data-numeric>
              $5,239.69
            </span>
            <span className="inline-flex items-center gap-0.5 text-caption font-medium text-state-ready">
              <ArrowUpRight className="size-3.5" />
              <span data-numeric>5.2%</span>
            </span>
          </div>
        </div>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Covers</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            286
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Avg ticket</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            $18.32
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Avg prep</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            6m 40s
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Cancelled</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lead font-medium leading-none" data-numeric>
              2
            </span>
            <span className="inline-flex items-center gap-0.5 text-caption font-medium text-state-late">
              <ArrowDownRight className="size-3.5" />
              <span data-numeric>1</span>
            </span>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.85fr_1fr]">
        <div className="min-w-0 rounded-xl border bg-card">
          <div className="flex items-baseline justify-between gap-4 border-b px-4 py-3">
            <div>
              <h2 className="text-h3">Covers by hour</h2>
              <p className="mt-0.5 text-caption text-fg-tertiary">
                Peak <span data-numeric>{peakCovers}</span> at 12:00
              </p>
            </div>
            <span className="eyebrow">Today</span>
          </div>
          <div className="h-[232px] w-full min-w-0 px-2 py-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={40}>
              <BarChart data={coversByHour} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11 }}
                  tickMargin={8}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="covers"
                  maxBarSize={26}
                  isAnimationActive={false}
                  shape={<CoverBar />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border bg-card">
          <div className="flex items-baseline justify-between gap-4 border-b px-4 py-3">
            <h2 className="text-h3">Recent orders</h2>
            <a
              href="/admin/orders"
              className="text-caption font-medium text-primary underline-offset-4 hover:underline"
            >
              View all
            </a>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 px-4 py-10 text-center">
              <p className="text-body font-medium">No orders yet</p>
              <p className="text-caption text-fg-tertiary">
                Tickets appear here the moment a table checks out.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-stretch gap-3 px-4 py-2.5 transition-colors duration-[140ms] ease-(--ease-out) hover:bg-accent"
                >
                  <span className="state-rail" data-state={order.state} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-body font-medium" data-numeric>
                        #{order.id}
                      </span>
                      <span className="text-body font-medium" data-numeric>
                        ${order.total}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-caption text-fg-tertiary">
                        Table <span data-numeric>{order.table}</span> ·{" "}
                        {order.status}
                      </span>
                      <span
                        className="text-caption text-fg-tertiary"
                        data-numeric
                      >
                        {order.age}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
