"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useGetPaymentDetails } from "@/hooks/queries/useOrderQuery";

export default function AdminPaymentsPage() {
  const { data, isLoading, isError } = useGetPaymentDetails();

  const payments = data?.payments || [];

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
