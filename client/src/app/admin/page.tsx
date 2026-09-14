"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useGetVendorDashboard } from "@/hooks/queries/useDashboardQuery";
import { Spinner } from "@/components/ui/spinner";

type TicketState = "idle" | "ready" | "aging" | "late";

function formatAge(seconds: number) {
  const m = Math.floor(seconds / 60);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h > 0) return `${h}h ${mm}m`;
  return `${mm}m`;
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
  const { data, isLoading, isError, error } = useGetVendorDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center py-4">
        <Spinner className="size-6 text-fg-tertiary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div
        role="alert"
        className="mt-4 rounded-xl border border-state-late/30 bg-state-late-bg px-4 py-6 text-center"
      >
        <p className="text-body font-medium text-state-late">
          Couldn&apos;t load dashboard metrics
        </p>
        <p className="mx-auto mt-1 max-w-md text-caption text-fg-secondary">
          {(error as any)?.message || "The service didn't respond."}
        </p>
      </div>
    );
  }

  const serviceQueue: { label: string; count: number; state: TicketState; note: string }[] = [
    { label: "Pending", count: data.queue[0]?.count ?? 0, state: "aging", note: "awaiting accept" },
    { label: "Preparing", count: data.queue[1]?.count ?? 0, state: "idle", note: "on the line" },
    { label: "Ready", count: data.queue[2]?.count ?? 0, state: "ready", note: "waiting on pass" },
  ];

  const coversByHour: { hour: string; covers: number }[] = data.coversByHour ?? [];
  const peakCovers = coversByHour.length ? Math.max(...coversByHour.map((d) => d.covers)) : 0;
  const peakHour = coversByHour.find((d) => d.covers === peakCovers)?.hour;

  const recentOrders: {
    id: number;
    table: number;
    total: number;
    status: string;
    createdAt: string;
  }[] = data.recentOrders ?? [];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-h2">Service overview</h1>
          <p className="mt-0.5 text-caption text-fg-tertiary">{today}</p>
        </div>
        <div className="flex items-center gap-2 text-caption text-fg-tertiary">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-state-ready opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-state-ready" />
          </span>
          Live
        </div>
      </div>

      <section className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-stretch divide-y divide-border sm:divide-y-0 sm:divide-x">
          <div className="flex min-w-[210px] flex-1 flex-col justify-center gap-1 p-4">
            <span className="eyebrow">Open tickets</span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-display leading-none" data-numeric>
                {data.openTickets}
              </span>
              {data.oldestOpenAgeSeconds !== null && (
                <span className="state-chip" data-state="aging">
                  oldest {formatAge(data.oldestOpenAgeSeconds)}
                </span>
              )}
            </div>
          </div>

          {serviceQueue.map((stage) => (
            <div key={stage.label} className="flex min-w-[150px] flex-1 items-stretch gap-3 p-4">
              <span className="state-rail" data-state={stage.state} />
              <div className="flex flex-col justify-center gap-0.5">
                <span className="text-caption font-medium text-fg-secondary">{stage.label}</span>
                <span className="text-h2 leading-none" data-numeric>
                  {stage.count}
                </span>
                <span className="text-micro text-fg-tertiary">{stage.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border bg-card px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Revenue today</span>
          <span className="text-h1 leading-none" data-numeric>
            ${data.revenueToday.toFixed(2)}
          </span>
        </div>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Covers</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            {data.coversToday}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Avg ticket</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            ${data.avgTicket.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Cancelled</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            {data.cancelledToday}
          </span>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.85fr_1fr]">
        <div className="min-w-0 rounded-xl border bg-card">
          <div className="flex items-baseline justify-between gap-4 border-b px-4 py-3">
            <div>
              <h2 className="text-h3">Covers by hour</h2>
              <p className="mt-0.5 text-caption text-fg-tertiary">
                {peakCovers > 0 ? (
                  <>
                    Peak <span data-numeric>{peakCovers}</span> at {peakHour}:00
                  </>
                ) : (
                  "No covers yet today"
                )}
              </p>
            </div>
            <span className="eyebrow">Today</span>
          </div>
          <div className="h-[232px] w-full min-w-0 px-2 py-4">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={40}>
              <BarChart data={coversByHour} margin={{ top: 4, right: 8, bottom: 0, left: 8 }}>
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickMargin={8} />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="covers"
                  maxBarSize={26}
                  isAnimationActive={false}
                  radius={[3, 3, 0, 0]}
                  fill="var(--chart-3)"
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
              {recentOrders.map((order) => {
                const state: TicketState =
                  order.status === "COMPLETED"
                    ? "ready"
                    : order.status === "CANCELLED"
                    ? "late"
                    : order.status === "PREPARING"
                    ? "aging"
                    : "idle";
                return (
                  <li
                    key={order.id}
                    className="flex items-stretch gap-3 px-4 py-2.5 transition-colors duration-[140ms] ease-(--ease-out) hover:bg-accent"
                  >
                    <span className="state-rail" data-state={state} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-body font-medium" data-numeric>
                          #{order.id}
                        </span>
                        <span className="text-body font-medium" data-numeric>
                          ${order.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-caption text-fg-tertiary">
                          Table <span data-numeric>{order.table}</span> · {order.status}
                        </span>
                        <span className="text-caption text-fg-tertiary" data-numeric>
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
