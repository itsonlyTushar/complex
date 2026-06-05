"use client";

import { ColumnDef } from "@tanstack/react-table";

export interface PaymentRow {
  orderId: number;
  createdAt: string;
  customerName: string;
  status: string;
  tableNumber: number;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number;
  costOfGoods: number;
  realProfit: number;
}

const currencyFmt = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

export const columns: ColumnDef<PaymentRow>[] = [
  {
    accessorKey: "orderId",
    header: "Order",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold">
        #{row.getValue("orderId")}
      </span>
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
        PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        PREPARING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        READY: "bg-violet-500/10 text-violet-500 border-violet-500/20",
        COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      };
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${colors[status] || "bg-gray-500/10 text-gray-500 border-gray-500/20"}`}
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
      <span className="font-bold text-sm">
        {currencyFmt(row.getValue("totalAmount"))}
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
        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
          {currencyFmt(row.getValue("netAmount"))}
        </span>
        <p className="text-[10px] text-muted-foreground">
          -{currencyFmt(row.original.commissionAmount)} ({row.original.commissionRate}%)
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
          <span className={`font-bold text-sm ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {currencyFmt(profit)}
          </span>
          <p className="text-[10px] text-muted-foreground">
            Cost: {currencyFmt(row.original.costOfGoods)}
          </p>
        </div>
      );
    },
  },
];
