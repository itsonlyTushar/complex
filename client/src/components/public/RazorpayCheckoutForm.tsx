"use client";

import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useCreateRazorpayOrder, useVerifyRazorpayPayment } from "@/hooks/mutations/usePaymentMutation";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "@/lib/toast";
import { formatMoney } from "@/lib/utils";
import { CheckoutFormProps } from "@/types/payment.types";
import { CheckoutDetails, parseCheckoutDetails } from "@/components/public/order/CheckoutDetails";
import { PayBar } from "@/components/public/order/PayBar";

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

type Stage = "idle" | "opening" | "confirming";

const stageLabels: Record<Stage, string | null> = {
  idle: null,
  opening: "Opening Razorpay…",
  confirming: "Confirming payment…",
};

// This form must never be rendered inside a Radix Dialog/Sheet/Drawer: Razorpay mounts its
// checkout iframe on <body>, outside the dialog, and the dialog's focus trap and pointer
// lock then make the payment window impossible to tap on a phone.
export function RazorpayCheckoutForm({ restaurantId, cartItems, cartTotal, onSuccess, tableIdFromUrl, currency = "INR" }: CheckoutFormProps) {
  const [tableNumber, setTableNumber] = useState(tableIdFromUrl || "");
  const [customerName, setCustomerName] = useState("");
  const [stage, setStage] = useState<Stage>("idle");

  const { mutateAsync: createOrder } = useCreateRazorpayOrder();
  const { mutateAsync: verifyPayment } = useVerifyRazorpayPayment();
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const details = parseCheckoutDetails(customerName, tableNumber);
    if (!details) return;

    setStage("opening");

    const checkout = {
      restaurantId,
      ...details,
      items: cartItems.map((item) => ({ menuID: item.id, quantity: item.cartQuantity })),
    };

    try {
      await loadRazorpayCheckout();
      const order = await createOrder(checkout);
      const brandColor = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim();

      const razorpay = new window.Razorpay!({
        key: order.keyId,
        order_id: order.razorpayOrderId,
        amount: order.amount,
        currency: order.currency,
        name: order.restaurantName,
        description: `Table ${details.tableNumber}`,
        prefill: { name: details.customerName },
        theme: { color: brandColor || "#2f62e8" },
        handler: async (response: RazorpaySuccess) => {
          setStage("confirming");
          try {
            await verifyPayment({
              ...checkout,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Paid. Your order is with the kitchen.");
            clearCart();
            onSuccess();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "We couldn't confirm your payment.");
          } finally {
            setStage("idle");
          }
        },
        modal: {
          ondismiss: () => setStage("idle"),
        },
      });

      razorpay.on("payment.failed", (response) => {
        toast.error(response.error.description || "Payment failed.");
      });

      razorpay.open();
      // Razorpay's window covers the page while it's open, so the button doesn't need to stay
      // locked; if Razorpay fails to appear (bad keys, network), the guest can simply tap again.
      setStage("idle");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setStage("idle");
    }
  };

  const isBusy = stage !== "idle";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <CheckoutDetails
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        tableNumber={tableNumber}
        onTableNumberChange={setTableNumber}
        tableLocked={!!tableIdFromUrl}
        disabled={isBusy}
      />

      <section className="flex flex-col gap-2">
        <h2 className="eyebrow px-1">Payment</h2>
        <div className="surface-raise flex items-start gap-3 rounded-2xl p-4">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-fg-tertiary" />
          <div>
            <p className="text-body font-medium">UPI, cards, netbanking or wallets</p>
            <p className="text-caption text-fg-tertiary">
              You&apos;ll pay the stall directly through Razorpay. Your UPI app opens if you choose UPI.
            </p>
          </div>
        </div>
      </section>

      <PayBar label={`Pay ${formatMoney(cartTotal, currency, { wholeUnits: true })}`} busyLabel={stageLabels[stage]} />
    </form>
  );
}
