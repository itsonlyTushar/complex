"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatMoney } from "@/lib/utils";

export interface PaymentRow {
  orderId: number;
  createdAt: string;
  customerName: string;
  status: string;
  tableNumber: number;
  paymentProvider: "stripe" | "razorpay" | "cash";
  paymentReference: string | null;
  currency: string;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  costOfGoods: number;
  realProfit: number;
}

const providerLabels: Record<PaymentRow["paymentProvider"], string> = {
  stripe: "Stripe",
  razorpay: "Razorpay",
  cash: "Cash / manual",
};

export const columns: ColumnDef<PaymentRow>[] = [
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => (
      <div>
        <span className="font-mono text-xs font-semibold">
          #{row.getValue("orderId")}
        </span>
        <p className="text-[10px] text-muted-foreground" title={row.original.paymentReference ?? undefined}>
          {providerLabels[row.original.paymentProvider]}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-sm">
          <p className="font-medium">
            {date.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground">
            {date.toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.getValue("customerName")}</p>
        <p className="text-xs text-muted-foreground">Table {row.original.tableNumber}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = String(row.getValue("status") || "PENDING");
      const colors: Record<string, string> = {
        PENDING: "bg-state-aging-bg text-state-aging border-state-aging/30",
        PREPARING: "bg-primary/10 text-primary border-primary/20",
        READY: "bg-primary/10 text-primary border-primary/20",
        COMPLETED: "bg-state-ready-bg text-state-ready border-state-ready/30",
      };
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${colors[status] || "bg-foreground text-fg-secondary border-border-strong"}`}
        >
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </span>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => (
      <span className="font-semibold text-sm">
        {formatMoney(row.getValue("totalAmount"), row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "netAmount",
    header: () => (
      <div>
        <span>Net Received</span>
        <p className="text-[10px] font-normal text-muted-foreground">After commission</p>
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <span className="font-semibold text-sm text-state-ready">
          {formatMoney(row.getValue("netAmount"), row.original.currency)}
        </span>
        <p className="text-[10px] text-muted-foreground">
          -{formatMoney(row.original.commissionAmount, row.original.currency)} ({row.original.commissionRate}%)
        </p>
      </div>
    ),
  },
  {
    accessorKey: "realProfit",
    header: () => (
      <div>
        <span>Real Profit</span>
        <p className="text-[10px] font-normal text-muted-foreground">After costs & commission</p>
      </div>
    ),
    cell: ({ row }) => {
      const profit = row.getValue("realProfit") as number;
      const isPositive = profit >= 0;
      return (
        <div>
          <span className={`font-semibold text-sm ${isPositive ? "text-state-ready" : "text-state-late"}`}>
            {formatMoney(profit, row.original.currency)}
          </span>
          <p className="text-[10px] text-muted-foreground">
            Cost: {formatMoney(row.original.costOfGoods, row.original.currency)}
          </p>
        </div>
      );
    },
  },
];
