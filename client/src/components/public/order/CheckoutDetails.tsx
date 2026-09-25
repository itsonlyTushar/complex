"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/lib/toast";

type CheckoutDetailsProps = {
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  tableNumber: string;
  onTableNumberChange: (value: string) => void;
  tableLocked: boolean;
  disabled?: boolean;
};

// Inputs are 16px (text-lead): anything smaller makes iOS Safari zoom the page on focus.
export function CheckoutDetails({
  customerName,
  onCustomerNameChange,
  tableNumber,
  onTableNumberChange,
  tableLocked,
  disabled,
}: CheckoutDetailsProps) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="eyebrow px-1">Your details</h2>
      <div className="surface-raise flex flex-col gap-4 rounded-2xl p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="customer-name" className="text-caption font-medium text-fg-secondary">
            Name for the order
          </Label>
          <Input
            id="customer-name"
            autoComplete="name"
            autoCapitalize="words"
            enterKeyHint="done"
            required
            placeholder="So the stall knows it's yours"
            value={customerName}
            onChange={(e) => onCustomerNameChange(e.target.value)}
            disabled={disabled}
            className="h-11 rounded-lg text-lead"
          />
        </div>

        {tableLocked ? (
          <div className="flex items-center justify-between">
            <span className="text-caption font-medium text-fg-secondary">Your table</span>
            <span className="text-body font-semibold">
              Table <span data-numeric>{tableNumber}</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="table-number" className="text-caption font-medium text-fg-secondary">
              Table number
            </Label>
            <Input
              id="table-number"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              placeholder="On the sticker at your table"
              value={tableNumber}
              onChange={(e) => onTableNumberChange(e.target.value)}
              disabled={disabled}
              className="h-11 rounded-lg text-lead"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export const parseCheckoutDetails = (customerName: string, tableNumber: string) => {
  if (!customerName.trim()) {
    toast.error("Add a name for the order.");
    return null;
  }

  const parsedTable = parseInt(tableNumber, 10);
  if (isNaN(parsedTable) || parsedTable <= 0) {
    toast.error("Please enter a valid table number.");
    return null;
  }

  return { customerName: customerName.trim(), tableNumber: parsedTable };
};
