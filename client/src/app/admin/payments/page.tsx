"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useGetPaymentDetails } from "@/hooks/queries/useOrderQuery";
import { DollarSign, TrendingUp, Receipt, Wallet } from "lucide-react";

const currencyFmt = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export default function AdminPaymentsPage() {
  const { data, isLoading, isError } = useGetPaymentDetails();

  const payments = data?.payments || [];
  const summary = data?.summary;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-muted-foreground animate-pulse">Loading payment details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-destructive">Failed to load payment details. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      <section>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">
          Complete breakdown of your restaurant&apos;s revenue, costs, and profit.
        </p>
      </section>

      {/* Summary Cards */}
      {summary && (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={<Receipt className="size-5" />}
            label="Total Revenue"
            value={currencyFmt(summary.totalRevenue)}
            subtitle={`${summary.orderCount} order${summary.orderCount !== 1 ? "s" : ""}`}
            color="text-blue-500"
            bg="bg-blue-500/10"
          />
          <SummaryCard
            icon={<DollarSign className="size-5" />}
            label="Commission Paid"
            value={currencyFmt(summary.totalCommission)}
            subtitle="Platform fees"
            color="text-amber-500"
            bg="bg-amber-500/10"
          />
          <SummaryCard
            icon={<Wallet className="size-5" />}
            label="Net Received"
            value={currencyFmt(summary.totalNet)}
            subtitle="After commission"
            color="text-emerald-500"
            bg="bg-emerald-500/10"
          />
          <SummaryCard
            icon={<TrendingUp className="size-5" />}
            label="Real Profit"
            value={currencyFmt(summary.totalProfit)}
            subtitle={`Cost of goods: ${currencyFmt(summary.totalCost)}`}
            color={summary.totalProfit >= 0 ? "text-emerald-500" : "text-rose-500"}
            bg={summary.totalProfit >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}
          />
        </section>
      )}

      <section>
        <DataTable columns={columns} data={payments} />
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  subtitle,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl border bg-card shadow-sm">
      <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold tracking-tight mt-0.5">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
