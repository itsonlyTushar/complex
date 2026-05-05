import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

const Payment = () => {
  return (
    <>
      <section className="bg-card rounded-xl border shadow-sm p-6 h-full">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Payments</h1>

        {/* Close store switches   */}
        <div className="flex gap-2">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 max-w-md">
            <Switch id="close-store" />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="close-store"
                className="text-base font-semibold leading-none cursor-pointer"
              >
                Accept Online Payments
              </Label>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 max-w-md">
            <Switch id="close-store" />
            <div className="grid gap-1.5 leading-none">
              <Label
                htmlFor="close-store"
                className="text-base font-semibold leading-none cursor-pointer"
              >
                Accept Online Payments
              </Label>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Payment;
