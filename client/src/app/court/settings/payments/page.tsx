"use client";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function page() {
  const { data: user, isLoading } = useGetMe();
  const usesRazorpay = user?.foodCourt?.paymentSystem === "razorpay";

  return (
    <section className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Set by the platform when this food court was onboarded.
          </p>
        </div>
      </div>

      <Separator className="mb-10 bg-border/60" />

      {isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading payment settings...
        </div>
      ) : (
        <section className="flex justify-center">
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl border border-state-ready/30 bg-state-ready-bg">
            <CheckCircle2 className="h-5 w-5 text-state-ready" />
            <div>
              <Label className="text-base font-semibold leading-none">
                {usesRazorpay ? "Razorpay" : "Stripe"}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Vendors in this food court accept payments via {usesRazorpay ? "Razorpay" : "Stripe"}.
              </p>
            </div>
          </div>
        </section>
      )}
    </section>
  )
}
