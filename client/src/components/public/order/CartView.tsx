"use client";

import { Plus } from "lucide-react";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/public/CheckoutForm";
import { RazorpayCheckoutForm } from "@/components/public/RazorpayCheckoutForm";
import { formatMoney } from "@/lib/utils";
import type { CartItem } from "@/types/cart.types";
import { QuantityStepper } from "./QuantityStepper";
import { ViewHeader } from "./ViewHeader";

let stripePromise: Promise<Stripe | null> | null = null;
const getStripe = () => (stripePromise ??= loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""));

type CartViewProps = {
  restaurantId: string;
  subtitle: string;
  cartItems: CartItem[];
  cartTotal: number;
  currency: string;
  usesRazorpay: boolean;
  tableIdFromUrl: string | null;
  onBack: () => void;
  onPaid: () => void;
  onIncrement: (item: CartItem) => void;
  onDecrement: (item: CartItem) => void;
};

// A full page, deliberately not a Sheet or Drawer: Razorpay's checkout iframe is mounted
// on <body>, and a modal's focus trap would leave it visible but untappable.
export function CartView({
  restaurantId,
  subtitle,
  cartItems,
  cartTotal,
  currency,
  usesRazorpay,
  tableIdFromUrl,
  onBack,
  onPaid,
  onIncrement,
  onDecrement,
}: CartViewProps) {
  if (cartItems.length === 0) {
    return (
      <div className="min-h-dvh">
        <ViewHeader title="Your order" subtitle={subtitle} onBack={onBack} />
        <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
          <div>
            <p className="text-lead font-medium">Nothing in your order yet</p>
            <p className="text-caption text-fg-tertiary">Add something from the menu to get started.</p>
          </div>
          <Button onClick={onBack} className="h-11 rounded-xl px-6 font-semibold">
            Browse the menu
          </Button>
        </div>
      </div>
    );
  }

  const checkoutProps = { restaurantId, cartItems, cartTotal, currency, tableIdFromUrl, onSuccess: onPaid };

  return (
    <div className="min-h-dvh pb-32">
      <ViewHeader title="Your order" subtitle={subtitle} onBack={onBack} />

      <main className="flex flex-col gap-6 px-4 pt-4">
        <section className="flex flex-col gap-2">
          <ul className="surface-raise divide-y divide-border rounded-2xl">
            {cartItems.map((item) => (
              <li key={item.id} className="flex items-center gap-3 p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-body font-medium">{item.itemName}</p>
                  <p data-numeric className="text-caption text-fg-tertiary">
                    {formatMoney(item.price, currency, { wholeUnits: true })}
                  </p>
                </div>
                <QuantityStepper
                  itemName={item.itemName}
                  quantity={item.cartQuantity}
                  onDecrement={() => onDecrement(item)}
                  onIncrement={() => onIncrement(item)}
                  canIncrement={item.cartQuantity < item.quantity}
                />
                <span data-numeric className="min-w-18 text-right text-body font-semibold">
                  {formatMoney(item.price * item.cartQuantity, currency, { wholeUnits: true })}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={onBack}
            className="flex h-11 items-center gap-1.5 self-start rounded-lg px-1 text-body font-medium text-primary active:opacity-70"
          >
            <Plus className="size-4" />
            Add more items
          </button>

          <div className="flex items-baseline justify-between px-1">
            <span className="text-body text-fg-secondary">Total</span>
            <span data-numeric className="text-h2">
              {formatMoney(cartTotal, currency, { wholeUnits: true })}
            </span>
          </div>
        </section>

        {usesRazorpay ? (
          <RazorpayCheckoutForm {...checkoutProps} />
        ) : (
          <Elements stripe={getStripe()}>
            <CheckoutForm {...checkoutProps} />
          </Elements>
        )}
      </main>
    </div>
  );
}
