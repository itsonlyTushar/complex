"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCancelOrder, useUpdateOrderStatus } from "@/hooks/mutations/useOrderMutation";
import { useGetOrders } from "@/hooks/queries/useOrderQuery";
import { Check, X } from "lucide-react";
import { toast } from "@/lib/toast";
import { useState } from "react";
import { PunchOrderSheet } from "@/components/admin/PunchOrderSheet";

export default function OrdersPage() {
  const { data, isLoading: isOrderLoading } = useGetOrders();

  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateOrderStatus();

  const orders = data?.orders || [];

  const statuses = ["PENDING", "PREPARING", "READY", "COMPLETED"];

  const [status, setStatus] = useState("PENDING");

  const handleChangeStatus = () => {
    const currantIndex = statuses.indexOf(status);

    if (currantIndex < statuses.length - 1) {
      setStatus(statuses[currantIndex + 1]);
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const idx = statuses.indexOf(currentStatus.toUpperCase());
    if (idx !== -1 && idx < statuses.length - 1) {
      return statuses[idx + 1];
    }
    return null;
  };

  if (isOrderLoading) {
    return (
      <div className="flex items-center justify-center min-h-50">
        <p className="text-muted-foreground animate-pulse">Loading orders...</p>
      </div>
    );
  }

  return (
    <>
      <section className="my-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl">Orders</h1>
          <p className="text-sm mt-2 text-left">
            Orders for your restaurant will appear here
          </p>
        </div>
        <PunchOrderSheet />
      </section>

      {/* Map the orders cards here (only on-goings)  */}

      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {orders.length === 0 ? (
          <p className="text-muted-foreground col-span-full">
            No orders found.
          </p>
        ) : (
          orders.map((order) => (
            <Card
              key={order.id}
              className="max-w-xs flex flex-col justify-between"
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    <span className="font-extrabold">#</span>
                    {order.id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    Table {order.tableNumber}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Customer
                    </p>
                    <p className="text-sm font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Items
                    </p>
                    <ul className="text-xs space-y-1 mt-1">
                      {order.items?.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between text-muted-foreground"
                        >
                          <span className="">
                            {item.menu?.itemName || `Item #${item.menuID}`}
                          </span>
                          <span className="italic font-extrabold gap-2">
                            x {item.quantity}
                          </span>
                          <span className="underline">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 py-2 bg-muted/20 border-t flex justify-between items-center text-sm">
                <span className="font-medium">Total</span>
                <span className="font-bold">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-center items-center">
                <p className="text-center font-extrabold border border-emerald-500/20 max-w-sm w-[90px] rounded-xl text-[11px] bg-emerald-500/10 text-emerald-500">
                  {order?.status.slice(0, 1)}
                  <span className="lowercase">{order?.status.slice(1)}</span>
                </p>
              </div>
              {order?.status === "CANCELLED" ? (
                <div> </div>
              ) : (
                <CardFooter className="flex gap-2 pt-2">
                  <Button
                    onClick={() => {
                      cancelOrder(order.id, {
                        onSuccess: () => {
                          toast.success("Order cancelled successfully!");
                        },
                        onError: (error: any) => {
                          toast.error(
                            error.message || "Failed to cancel order.",
                          );
                        },
                      });
                    }}
                    disabled={isCancelling || order.status === "COMPLETED"}
                    variant="outline"
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  >
                    <X className="size-4 mr-1" />
                  </Button>
                  <Button 
                    onClick={() => {
                      const nextStatus = getNextStatus(order.status);
                      if (nextStatus) {
                        updateStatus({ orderId: order.id, status: nextStatus }, {
                          onSuccess: () => {
                            toast.success(`Order status updated to ${nextStatus}!`);
                          },
                          onError: (error: any) => {
                            toast.error(error.message || "Failed to update order status.");
                          }
                        });
                      }
                    }}
                    className="flex-1" disabled={isCancelling || isUpdating || !getNextStatus(order.status)}>
                    <Check className="size-4 mr-1" />
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </section>
    </>
  );
}
