"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  itemName: string;
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  canIncrement?: boolean;
  className?: string;
};

const stepButton =
  "flex size-10 items-center justify-center text-fg-secondary transition-[background-color,transform] duration-100 ease-(--ease-out) active:scale-95 active:bg-accent disabled:opacity-45 disabled:active:scale-100";

export function QuantityStepper({
  itemName,
  quantity,
  onDecrement,
  onIncrement,
  canIncrement = true,
  className,
}: QuantityStepperProps) {
  return (
    <div className={cn("inline-flex h-10 shrink-0 items-center rounded-lg border border-control-border bg-control", className)}>
      <button type="button" onClick={onDecrement} aria-label={`Remove one ${itemName}`} className={cn(stepButton, "rounded-l-lg")}>
        <Minus className="size-4" />
      </button>
      <span data-numeric aria-live="polite" className="min-w-6 text-center text-body font-semibold">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={`Add one more ${itemName}`}
        className={cn(stepButton, "rounded-r-lg text-primary")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
