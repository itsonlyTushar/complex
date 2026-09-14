"use client";

import { Button } from "@/components/ui/button";
import {
  useCancelOrder,
  useUpdateOrderStatus,
} from "@/hooks/mutations/useOrderMutation";
import { useGetOrders } from "@/hooks/queries/useOrderQuery";
import { Check, X } from "lucide-react";
import { toast } from "@/lib/toast";
import { useEffect, useState } from "react";
import { PunchOrderSheet } from "@/components/admin/PunchOrderSheet";

const FLOW = ["PENDING", "PREPARING", "READY", "COMPLETED"] as const;

const LANES = [
  { status: "PENDING", label: "Pending", note: "Accept to start the ticket" },
  { status: "PREPARING", label: "Preparing", note: "On the line" },
  { status: "READY", label: "Ready", note: "Waiting on the pass" },
] as const;

/* A ticket's age is the number that actually runs a service line, so it drives
   the visual pressure rather than sitting in a corner as metadata. */
function ticketState(minutes: number) {
  if (minutes >= 12) return "late" as const;
  if (minutes >= 6) return "aging" as const;
  return "idle" as const;
}

function formatAge(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getNextStatus(currentStatus: string): string | null {
  const idx = FLOW.indexOf(currentStatus?.toUpperCase() as (typeof FLOW)[number]);
  if (idx !== -1 && idx < FLOW.length - 1) return FLOW[idx + 1];
  return null;
}

function TicketSkeleton() {
  return (
    <div className="flex items-stretch gap-3 rounded-xl border bg-card p-3">
      <div className="w-[3px] shrink-0 rounded-none bg-border" />
      <div className="flex-1 space-y-2.5">
        <div className="h-3.5 w-24 rounded-sm bg-muted" />
        <div className="h-3 w-full rounded-sm bg-muted" />
        <div className="h-3 w-2/3 rounded-sm bg-muted" />
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const {
    data,
    isLoading: isOrderLoading,
    isError,
    refetch,
    isRefetching,
  } = useGetOrders();
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  /* Ages are only useful if they keep moving while the screen sits open. */
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  const orders = data?.orders || [];
  const liveOrders = orders.filter((order) =>
    ["PENDING", "PREPARING", "READY"].includes(order.status?.toUpperCase()),
  );

  return (
    <div className="flex flex-col gap-5 py-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h2">Orders</h1>
          <p className="mt-0.5 text-caption text-fg-tertiary">
            {isOrderLoading ? (
              "Loading the rail…"
            ) : (
              <>
                <span data-numeric>{liveOrders.length}</span> open{" "}
                {liveOrders.length === 1 ? "ticket" : "tickets"} on the rail
              </>
            )}
          </p>
        </div>
        <PunchOrderSheet />
      </div>

      {/* An empty rail and an unreachable rail look identical to a vendor mid
          service, so a failed fetch has to say so rather than read as "quiet". */}
      {isError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-state-late/30 bg-state-late-bg px-4 py-3"
        >
          <div>
            <p className="text-body font-medium text-state-late">
              Can&apos;t reach the order service
            </p>
            <p className="mt-0.5 text-caption text-fg-secondary">
              Tickets below may be out of date. Check the connection and retry.
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

      <div className="grid gap-4 lg:grid-cols-3">
        {LANES.map((lane) => {
          const laneOrders = orders.filter(
            (order) => order.status?.toUpperCase() === lane.status,
          );

          return (
            <section key={lane.status} className="flex min-w-0 flex-col gap-2.5">
              <div className="flex items-baseline justify-between gap-2 border-b pb-2">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-body font-medium">{lane.label}</h2>
                  <span
                    className="text-caption text-fg-tertiary"
                    data-numeric
                  >
                    {laneOrders.length}
                  </span>
                </div>
                <span className="eyebrow">{lane.note}</span>
              </div>

              {isOrderLoading ? (
                <div className="flex animate-pulse flex-col gap-2.5">
                  <TicketSkeleton />
                  <TicketSkeleton />
                </div>
              ) : laneOrders.length === 0 ? (
                <div className="rounded-xl border border-dashed px-3 py-8 text-center">
                  <p className="text-caption text-fg-tertiary">
                    {isError
                      ? "Unavailable"
                      : `Nothing ${lane.label.toLowerCase()}`}
                  </p>
                </div>
              ) : (
                laneOrders.map((order) => {
                  const createdAt = new Date(order.createdAt).getTime();
                  const elapsed = now - createdAt;
                  const state = ticketState(elapsed / 60000);
                  const nextStatus = getNextStatus(order.status);

                  return (
                    <article
                      key={order.id}
                      className="flex items-stretch gap-3 rounded-xl border bg-card p-3 transition-colors duration-[140ms] ease-(--ease-out) hover:border-border-strong"
                    >
                      <span className="state-rail" data-state={state} />

                      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-body font-medium" data-numeric>
                            #{order.id}
                          </span>
                          <span className="state-chip" data-state={state}>
                            {formatAge(elapsed)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-caption text-fg-tertiary">
                          <span>
                            Table <span data-numeric>{order.tableNumber}</span>
                          </span>
                          {order.customerName ? (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="truncate">
                                {order.customerName}
                              </span>
                            </>
                          ) : null}
                        </div>

                        <ul className="flex flex-col gap-1 border-t pt-2.5">
                          {order.items?.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-baseline justify-between gap-2 text-caption"
                            >
                              <span className="min-w-0 truncate text-fg-secondary">
                                <span data-numeric>{item.quantity}</span>
                                {"× "}
                                {item.menu?.itemName || `Item #${item.menuID}`}
                              </span>
                              <span data-numeric className="text-fg-tertiary">
                                {(item.price * item.quantity).toFixed(2)}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <div className="flex items-baseline justify-between gap-2 border-t pt-2.5">
                          <span className="eyebrow">Total</span>
                          <span className="text-body font-medium" data-numeric>
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 hover:border-state-late/40 hover:bg-state-late-bg hover:text-state-late"
                            disabled={isCancelling}
                            onClick={() =>
                              cancelOrder(order.id, {
                                onSuccess: () =>
                                  toast.success("Order cancelled."),
                                onError: (error: any) =>
                                  toast.error(
                                    error.message || "Failed to cancel order.",
                                  ),
                              })
                            }
                          >
                            <X className="size-4" />
                            Cancel
                          </Button>

                          <Button
                            size="sm"
                            className="flex-1"
                            disabled={isCancelling || isUpdating || !nextStatus}
                            onClick={() => {
                              if (!nextStatus) return;
                              updateStatus(
                                { orderId: order.id, status: nextStatus },
                                {
                                  onSuccess: () =>
                                    toast.success(
                                      `Moved to ${nextStatus.toLowerCase()}.`,
                                    ),
                                  onError: (error: any) =>
                                    toast.error(
                                      error.message ||
                                        "Failed to update order status.",
                                    ),
                                },
                              );
                            }}
                          >
                            <Check className="size-4" />
                            {nextStatus
                              ? nextStatus.charAt(0) +
                                nextStatus.slice(1).toLowerCase()
                              : "Done"}
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
