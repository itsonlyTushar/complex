"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";
import type { Order } from "@/types/order.types";
import { ViewHeader } from "./ViewHeader";

type RailState = "idle" | "aging" | "ready";

// The guest sees the same rail and chip vocabulary the kitchen's order rail uses,
// so "Preparing" means the same thing on both ends of the ticket.
const STATUS: Record<string, { label: string; state: RailState; note: string }> = {
  PENDING: { label: "Received", state: "idle", note: "The stall has your order." },
  PREPARING: { label: "Preparing", state: "aging", note: "It's being made now." },
  READY: { label: "Ready", state: "ready", note: "Your food is ready." },
};

export const orderStatus = (status: string) =>
  STATUS[status?.toUpperCase()] ?? {
    label: status ? status.charAt(0) + status.slice(1).toLowerCase() : "Received",
    state: "idle" as RailState,
    note: "",
  };

const placedAt = (createdAt: Date | string) =>
  new Date(createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

export function OrderStatusStrip({ orders, onOpen }: { orders: Order[]; onOpen: () => void }) {
  const latest = orders[0];
  if (!latest) return null;
  const status = orderStatus(latest.status);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="surface-raise flex w-full items-stretch overflow-hidden rounded-xl text-left transition-transform duration-100 ease-(--ease-out) active:scale-[0.98]"
    >
      <span className="state-rail" data-state={status.state} />
      <span className="flex min-w-0 flex-1 items-center justify-between gap-3 py-2.5 pr-2 pl-3">
        <span className="min-w-0">
          <span className="eyebrow block">Your order</span>
          <span className="block truncate text-body font-medium">
            Order <span data-numeric>#{latest.id}</span>
            {orders.length > 1 && <span className="text-fg-tertiary"> + {orders.length - 1} more</span>}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          <span className="state-chip" data-state={status.state}>
            {status.label}
          </span>
          <ChevronRight className="size-4 text-fg-tertiary" />
        </span>
      </span>
    </button>
  );
}

type OrdersViewProps = {
  orders: Order[];
  currency: string;
  subtitle: string;
  onBack: () => void;
};

export function OrdersView({ orders, currency, subtitle, onBack }: OrdersViewProps) {
  return (
    <div className="min-h-dvh pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <ViewHeader title="Orders at this table" subtitle={subtitle} onBack={onBack} />

      <main className="flex flex-col gap-3 px-4 pt-4">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-lead font-medium">No open orders</p>
            <p className="text-caption text-fg-tertiary">Orders you place here show up with their progress.</p>
          </div>
        ) : (
          <>
            {orders.map((order) => {
              const status = orderStatus(order.status);
              return (
                <article key={order.id} className="surface-raise flex overflow-hidden rounded-2xl">
                  <span className="state-rail" data-state={status.state} />
                  <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-lead font-semibold">
                          Order <span data-numeric>#{order.id}</span>
                        </h2>
                        <p className="truncate text-caption text-fg-tertiary">
                          For {order.customerName} · <time>{placedAt(order.createdAt)}</time>
                        </p>
                      </div>
                      <span className="state-chip shrink-0" data-state={status.state}>
                        {status.label}
                      </span>
                    </div>

                    {status.note && <p className="text-body text-fg-secondary">{status.note}</p>}

                    <ul className="flex flex-col gap-1.5 border-t border-border pt-3">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex items-baseline justify-between gap-3 text-body">
                          <span className="min-w-0 truncate">
                            <span data-numeric className="text-fg-tertiary">{item.quantity}×</span>{" "}
                            {item.menu?.itemName ?? `Item #${item.menuID}`}
                          </span>
                          <span data-numeric className="shrink-0 text-fg-secondary">
                            {formatMoney(item.price * item.quantity, currency, { wholeUnits: true })}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-baseline justify-between border-t border-border pt-3">
                      <span className="text-body text-fg-secondary">Total paid</span>
                      <span data-numeric className="text-body font-semibold">
                        {formatMoney(order.totalAmount, currency, { wholeUnits: true })}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
            <p className="px-1 text-center text-caption text-fg-tertiary">
              This page updates on its own while your food is being made.
            </p>
          </>
        )}

        <Button variant="outline" onClick={onBack} className="mt-3 h-12 rounded-xl text-lead font-semibold">
          Order something else
        </Button>
      </main>
    </div>
  );
}
