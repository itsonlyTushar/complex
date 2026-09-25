"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "@/hooks/mutations/usePaymentMutation";
import { useAddOrder } from "@/hooks/mutations/useOrderMutation";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "@/lib/toast";
import { formatMoney } from "@/lib/utils";
import { CheckoutFormProps } from "@/types/payment.types";
import { CheckoutDetails, parseCheckoutDetails } from "@/components/public/order/CheckoutDetails";
import { PayBar } from "@/components/public/order/PayBar";

export function CheckoutForm({ restaurantId, cartItems, cartTotal, onSuccess, tableIdFromUrl, currency = "USD" }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [tableNumber, setTableNumber] = useState(tableIdFromUrl || "");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
  const { mutateAsync: addOrder } = useAddOrder();
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet.");
      return;
    }

    const details = parseCheckoutDetails(customerName, tableNumber);
    if (!details) return;

    setIsProcessing(true);

    try {
      const amountInCents = Math.round(cartTotal * 100);
      const commissionInCents = Math.round(amountInCents * 0.05);

      const paymentIntentResponse = await createPaymentIntent({
        amount: amountInCents,
        currency: "usd",
        application_fee_amount: commissionInCents,
        commissionAmount: commissionInCents.toString(),
        restaurantId,
      });

      const clientSecret = paymentIntentResponse?.paymentIntent?.client_secret;
      const paymentIntentId = paymentIntentResponse?.paymentIntent?.id;

      if (!clientSecret) {
        throw new Error("Failed to initialize payment process.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error("Card input field not found.");
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message || "Payment failed.");
      }

      if (paymentIntent?.status === "succeeded") {
        await addOrder({
          restaurantId,
          totalAmount: Math.round(cartTotal),
          tableNumber: details.tableNumber,
          paymentIntentId,
          customerName: details.customerName,
          items: cartItems.map((item) => ({
            menuID: item.id,
            quantity: item.cartQuantity,
            price: Math.round(item.price),
          })),
        });

        toast.success("Paid. Your order is with the kitchen.");
        clearCart();
        onSuccess();
      } else {
        throw new Error("Payment status verification failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <CheckoutDetails
        customerName={customerName}
        onCustomerNameChange={setCustomerName}
        tableNumber={tableNumber}
        onTableNumberChange={setTableNumber}
        tableLocked={!!tableIdFromUrl}
        disabled={isProcessing}
      />

      <section className="flex flex-col gap-2">
        <h2 className="eyebrow px-1">Card</h2>
        <div className="surface-raise rounded-2xl p-4">
          <div className="flex min-h-11 items-center rounded-lg border border-control-border bg-control px-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? "#e6e9ec" : "#16191c",
                    fontFamily: "IBM Plex Sans, sans-serif",
                    "::placeholder": {
                      color: "#8a939b",
                    },
                  },
                  invalid: {
                    color: "#e5564d",
                  },
                },
              }}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <PayBar
        label={`Pay ${formatMoney(cartTotal, currency, { wholeUnits: true })}`}
        busyLabel={isProcessing ? "Processing payment…" : null}
        disabled={!stripe || !elements}
      />
    </form>
  );
}
