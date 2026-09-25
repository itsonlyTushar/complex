"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatMoney } from "@/lib/utils";
import type { Menu } from "@/types";
import { QuantityStepper } from "./QuantityStepper";

type MenuItemRowProps = {
  menu: Menu;
  currency: string;
  quantityInCart: number;
  onAdd: () => void;
  onDecrement: () => void;
};

export function MenuItemRow({ menu, currency, quantityInCart, onAdd, onDecrement }: MenuItemRowProps) {
  const soldOut = menu.quantity <= 0;
  const canAddMore = quantityInCart < menu.quantity;

  return (
    <li className="flex gap-3 p-3">
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className={cn("text-lead font-medium", soldOut && "text-fg-tertiary")}>{menu.itemName}</h3>
        {menu.description && (
          <p className="mt-0.5 line-clamp-2 text-caption text-fg-tertiary">{menu.description}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span data-numeric className={cn("text-body font-semibold", soldOut && "text-fg-tertiary")}>
            {formatMoney(menu.price, currency, { wholeUnits: true })}
          </span>

          {soldOut ? (
            <span className="text-caption font-medium text-fg-tertiary">Sold out</span>
          ) : quantityInCart > 0 ? (
            <QuantityStepper
              itemName={menu.itemName}
              quantity={quantityInCart}
              onDecrement={onDecrement}
              onIncrement={onAdd}
              canIncrement={canAddMore}
            />
          ) : (
            <Button
              variant="outline"
              onClick={onAdd}
              aria-label={`Add ${menu.itemName}`}
              className="h-10 min-w-24 rounded-lg font-semibold text-primary"
            >
              <Plus className="size-4" />
              Add
            </Button>
          )}
        </div>
      </div>

      {menu.image && (
        <div className="relative size-22 shrink-0 overflow-hidden rounded-xl bg-muted outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
          <Image
            fill
            sizes="88px"
            alt=""
            src={menu.image}
            className={cn("object-cover", soldOut && "opacity-50 grayscale")}
          />
        </div>
      )}
    </li>
  );
}
