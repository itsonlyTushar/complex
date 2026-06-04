"use client";

import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useCreatePaymentIntent } from "@/hooks/mutations/usePaymentMutation";
import { useAddOrder } from "@/hooks/mutations/useOrderMutation";
import { useCartStore } from "@/stores/useCartStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { CheckoutFormProps } from "@/types/payment.types";

export function CheckoutForm({ restaurantId, cartItems, cartTotal, onSuccess, tableIdFromUrl }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [tableNumber, setTableNumber] = useState(tableIdFromUrl || "");
  const [customerName, setCustomerName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
  const { mutateAsync: addOrder } = useAddOrder();
  const clearCart = useCartStore((state) => state.clearCart);

  React.useEffect(() => {
    if (tableIdFromUrl) {
      setTableNumber(tableIdFromUrl);
    }
  }, [tableIdFromUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe has not loaded yet.");
      return;
    }

    if (!customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }

    if (!tableNumber) {
      toast.error("Table number is required.");
      return;
    }

    const parsedTableNum = parseInt(tableNumber, 10);
    if (isNaN(parsedTableNum) || parsedTableNum <= 0) {
      toast.error("Please enter a valid table number.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Payment Intent
      const amountInCents = Math.round(cartTotal * 100);
      const commissionInCents = Math.round(amountInCents * 0.05); // 5% platform fee
      
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

      // 2. Confirm Card Payment
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
        // 3. Place Order
        await addOrder({
          restaurantId,
          totalAmount: Math.round(cartTotal),
          tableName: parsedTableNum,
          tableId: parsedTableNum,
          paymentIntentId,
          customerName,
          items: cartItems.map((item) => ({
            menuID: item.id,
            quantity: item.cartQuantity,
            price: Math.round(item.price),
          })),
        });

        toast.success("Payment succeeded and order placed successfully!");
        clearCart();
        onSuccess();
      } else {
        throw new Error("Payment status verification failed.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Checkout failed. Please try again.");
    } finally {
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

      <div className="flex flex-col gap-2 bg-accent/40 p-4 rounded-xl border border-border/20">
        <label className="text-sm font-semibold text-foreground mb-1">
          Credit or Debit Card
        </label>
        <div className="p-3 bg-card border border-border/30 rounded-lg min-h-[44px] flex items-center">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? "#e8e2d9" : "#114236",
                  fontFamily: "Inter, sans-serif",
                  "::placeholder": {
                    color: "#a1a1aa",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
            className="w-full"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isProcessing || !stripe || !elements}
        className="w-full rounded-xl py-3 font-semibold transition-all"
      >
        {isProcessing ? "Processing..." : `Pay $${cartTotal.toFixed(2)} & Order`}
      </Button>
    </form>
  );
}
