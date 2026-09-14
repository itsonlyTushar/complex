"use client";

import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetRestaurants } from "@/hooks/queries/useCourtQuery";
import { useGetCourtDashboard } from "@/hooks/queries/useDashboardQuery";
import type { Restaurants } from "@/types/restaurant.types";

function RosterSkeleton() {
  return (
    <li className="flex items-stretch gap-3 px-4 py-3">
      <div className="w-[3px] shrink-0 bg-border" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-40 rounded-sm bg-muted" />
        <div className="h-3 w-56 rounded-sm bg-muted" />
      </div>
    </li>
  );
}

function formatJoined(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  /* Fixed parts, because locale-dependent output differs between server and
     client and breaks hydration. */
  return parsed.toISOString().slice(0, 10);
}

export default function CourtPage() {
  const { data, isLoading, isError, refetch, isRefetching } =
    useGetRestaurants();
  const { data: metrics, isLoading: isMetricsLoading } = useGetCourtDashboard();

  const vendors: Restaurants[] = Array.isArray(data) ? data : [];
  const trading = vendors.filter((v) => v.status).length;
  const offline = vendors.length - trading;

  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2">Food court overview</h1>
          <p className="mt-0.5 text-caption text-fg-tertiary">
            Every stall trading under your roof
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/court/restaurants">
            <Plus className="size-4" />
            Onboard restaurant
          </Link>
        </Button>
      </div>

      {isError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-state-late/30 bg-state-late-bg px-4 py-3"
        >
          <div>
            <p className="text-body font-medium text-state-late">
              Can&apos;t load your restaurants
            </p>
            <p className="mt-0.5 text-caption text-fg-secondary">
              The roster below may be incomplete.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            {isRefetching ? "Retrying…" : "Retry"}
          </Button>
        </div>
      )}

      {/*
        An operator's first question is which stalls are actually trading, so the
        split between trading and dark units leads and the roster follows.
      */}
      <section className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-stretch divide-y divide-border sm:divide-y-0 sm:divide-x">
          <div className="flex min-w-[190px] flex-1 flex-col justify-center gap-1 p-4">
            <span className="eyebrow">Stalls trading</span>
            <div className="flex items-baseline gap-2">
              <span className="text-display leading-none" data-numeric>
                {isLoading ? "—" : trading}
              </span>
              <span className="text-lead text-fg-tertiary" data-numeric>
                / {isLoading ? "—" : vendors.length}
              </span>
            </div>
          </div>

          <div className="flex min-w-[150px] flex-1 items-stretch gap-3 p-4">
            <span className="state-rail" data-state="ready" />
            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-caption font-medium text-fg-secondary">
                Live
              </span>
              <span className="text-h2 leading-none" data-numeric>
                {isLoading ? "—" : trading}
              </span>
              <span className="text-micro text-fg-tertiary">taking orders</span>
            </div>
          </div>

          <div className="flex min-w-[150px] flex-1 items-stretch gap-3 p-4">
            <span className="state-rail" data-state="idle" />
            <div className="flex flex-col justify-center gap-0.5">
              <span className="text-caption font-medium text-fg-secondary">
                Dark
              </span>
              <span className="text-h2 leading-none" data-numeric>
                {isLoading ? "—" : offline}
              </span>
              <span className="text-micro text-fg-tertiary">not trading</span>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border bg-card px-4 py-3.5">
        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Revenue today</span>
          <span className="text-h1 leading-none" data-numeric>
            {isMetricsLoading ? "—" : `$${(metrics?.revenueToday ?? 0).toFixed(2)}`}
          </span>
        </div>

        <div className="hidden h-8 w-px bg-border sm:block" />

        <div className="flex flex-col gap-0.5">
          <span className="eyebrow">Orders today</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            {isMetricsLoading ? "—" : metrics?.ordersToday ?? 0}
          </span>
        </div>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="flex items-baseline justify-between gap-4 border-b px-4 py-3">
          <h2 className="text-h3">Restaurants</h2>
          <Link
            href="/court/restaurants"
            className="inline-flex items-center gap-1 text-caption font-medium text-primary underline-offset-4 hover:underline"
          >
            Manage
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <ul className="animate-pulse divide-y divide-border">
            <RosterSkeleton />
            <RosterSkeleton />
            <RosterSkeleton />
          </ul>
        ) : vendors.length === 0 ? (
          <div className="flex flex-col items-center gap-1 px-4 py-12 text-center">
            <p className="text-body font-medium">
              {isError ? "Roster unavailable" : "No restaurants yet"}
            </p>
            <p className="max-w-sm text-caption text-fg-tertiary">
              {isError
                ? "We couldn't reach the service, so we can't show your stalls."
                : "Onboard your first stall and it will start receiving table orders straight away."}
            </p>
            {!isError && (
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link href="/court/restaurants">
                  <Plus className="size-4" />
                  Onboard restaurant
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {vendors.map((vendor) => {
              const joined = formatJoined(vendor.date);

              return (
                <li
                  key={vendor.id}
                  className="flex items-stretch gap-3 px-4 py-3 transition-colors duration-[140ms] ease-(--ease-out) hover:bg-accent"
                >
                  <span
                    className="state-rail"
                    data-state={vendor.status ? "ready" : "idle"}
                  />
                  <div className="flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <div className="min-w-0">
                      <p className="truncate text-body font-medium">
                        {vendor.owner || "Unnamed stall"}
                      </p>
                      <p className="truncate text-caption text-fg-tertiary">
                        {vendor.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {joined && (
                        <span
                          className="text-caption text-fg-tertiary"
                          data-numeric
                        >
                          {joined}
                        </span>
                      )}
                      <span
                        className="state-chip"
                        data-state={vendor.status ? "ready" : "idle"}
                      >
                        {vendor.status ? "Trading" : "Dark"}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
