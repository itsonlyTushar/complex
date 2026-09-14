"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useGetSuperAdminDashboard } from "@/hooks/queries/useDashboardQuery";
import { Spinner } from "@/components/ui/spinner";

export default function SuperAdmin() {
  const { data, isLoading, isError, error } = useGetSuperAdminDashboard();

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

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-h2">Platform overview</h1>
        <p className="mt-0.5 text-caption text-fg-tertiary">
          Every food court, restaurant and vendor across Complex
        </p>
      </div>

      <section className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-stretch divide-y divide-border sm:divide-y-0 sm:divide-x">
          <div className="flex min-w-[180px] flex-1 flex-col justify-center gap-1 p-4">
            <span className="eyebrow">Food courts</span>
            <span className="text-display leading-none" data-numeric>
              {data.foodCourtsTotal}
            </span>
          </div>
          <div className="flex min-w-[180px] flex-1 flex-col justify-center gap-1 p-4">
            <span className="eyebrow">Restaurants</span>
            <span className="text-display leading-none" data-numeric>
              {data.restaurantsTotal}
            </span>
          </div>
          <div className="flex min-w-[180px] flex-1 flex-col justify-center gap-1 p-4">
            <span className="eyebrow">Vendors</span>
            <span className="text-display leading-none" data-numeric>
              {data.vendorsTotal}
            </span>
          </div>
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
          <span className="eyebrow">Orders today</span>
          <span className="text-lead font-medium leading-none" data-numeric>
            {data.ordersToday}
          </span>
        </div>
      </section>

      <section className="rounded-xl border bg-card">
        <div className="flex items-baseline justify-between gap-4 border-b px-4 py-3">
          <h2 className="text-h3">Manage</h2>
        </div>
        <ul className="divide-y divide-border">
          <li>
            <Link
              href="/sp/activity"
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-[140ms] ease-(--ease-out) hover:bg-accent"
            >
              <div>
                <p className="text-body font-medium">Food courts</p>
                <p className="text-caption text-fg-tertiary">
                  View and manage food courts on the platform
                </p>
              </div>
              <ArrowUpRight className="size-4 text-fg-tertiary" />
            </Link>
          </li>
          <li>
            <Link
              href="/sp/new-court"
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-[140ms] ease-(--ease-out) hover:bg-accent"
            >
              <div>
                <p className="text-body font-medium">Onboard a food court</p>
                <p className="text-caption text-fg-tertiary">
                  Add a new food court to the platform
                </p>
              </div>
              <ArrowUpRight className="size-4 text-fg-tertiary" />
            </Link>
          </li>
          <li>
            <Link
              href="/sp/payments"
              className="flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-[140ms] ease-(--ease-out) hover:bg-accent"
            >
              <div>
                <p className="text-body font-medium">Payments</p>
                <p className="text-caption text-fg-tertiary">
                  Restaurant commissions and payouts
                </p>
              </div>
              <ArrowUpRight className="size-4 text-fg-tertiary" />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
