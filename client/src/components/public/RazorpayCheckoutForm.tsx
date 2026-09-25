"use client";

import React, { useState } from "react";
import { useCreateRazorpayOrder, useVerifyRazorpayPayment } from "@/hooks/mutations/usePaymentMutation";
import { useCartStore } from "@/stores/useCartStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { formatMoney } from "@/lib/utils";
import { CheckoutFormProps } from "@/types/payment.types";

type RazorpaySuccess = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: { error: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

let checkoutScript: Promise<void> | null = null;

const loadRazorpayCheckout = () => {
  if (window.Razorpay) return Promise.resolve();
  checkoutScript ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => {
      checkoutScript = null;
      reject(new Error("Couldn't load Razorpay. Check your connection and try again."));
    };
    document.body.appendChild(script);
  });
  return checkoutScript;
};

export function RazorpayCheckoutForm({ restaurantId, cartItems, cartTotal, onSuccess, tableIdFromUrl, currency = "INR" }: CheckoutFormProps) {
  const [tableNumber, setTableNumber] = useState(tableIdFromUrl || "");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createOrder } = useCreateRazorpayOrder();
  const { mutateAsync: verifyPayment } = useVerifyRazorpayPayment();
  const clearCart = useCartStore((state) => state.clearCart);

  React.useEffect(() => {
    if (tableIdFromUrl) {
      setTableNumber(tableIdFromUrl);
    }
  }, [tableIdFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    const parsedTableNum = parseInt(tableNumber, 10);
    if (isNaN(parsedTableNum) || parsedTableNum <= 0) {
      toast.error("Please enter a valid table number.");
      return;
    }

    setIsProcessing(true);

    const checkout = {
      restaurantId,
      customerName: customerName.trim(),
      tableNumber: parsedTableNum,
      items: cartItems.map((item) => ({ menuID: item.id, quantity: item.cartQuantity })),
    };

    try {
      await loadRazorpayCheckout();
      const order = await createOrder(checkout);

      const razorpay = new window.Razorpay!({
        key: order.keyId,
        order_id: order.razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        name: order.restaurantName,
        description: `Table ${parsedTableNum}`,
        prefill: { name: checkout.customerName },
        handler: async (response: RazorpaySuccess) => {
          try {
            await verifyPayment({
              ...checkout,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Payment succeeded and order placed successfully!");
            clearCart();
            onSuccess();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "We couldn't confirm your payment.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });

      razorpay.on("payment.failed", (response) => {
        toast.error(response.error.description || "Payment failed.");
      });

      razorpay.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="customer-name" className="text-sm font-semibold text-foreground">
          Your Name
        </label>
        <Input
          id="customer-name"
          type="text"
          required
          placeholder="e.g. John Doe"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          disabled={isProcessing}
          className="rounded-xl border border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="table-number" className="text-sm font-semibold text-foreground">
          Table Number
        </label>
        <Input
          id="table-number"
          type="number"
          min="1"
          required
          placeholder="e.g. 5"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          disabled={isProcessing || !!tableIdFromUrl}
          className="rounded-xl border border-border/40 focus-visible:ring-1 focus-visible:ring-primary"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Pay with UPI, cards, netbanking or wallets through Razorpay.
      </p>

      <Button
        type="submit"
        disabled={isProcessing}
        className="w-full rounded-xl py-3 font-semibold transition-all"
      >
        {isProcessing ? "Processing..." : `Pay ${formatMoney(cartTotal, currency)} & Order`}
      </Button>
    </form>
  );
}
