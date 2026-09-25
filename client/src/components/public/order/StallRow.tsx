"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PublicStall } from "@/types/restaurant.types";

type StallRowProps = {
  stall: PublicStall;
  href: string;
  itemsInOrder: number;
};

export function StallRow({ stall, href, itemsInOrder }: StallRowProps) {
  return (
    <li>
      <Link href={href} className="flex min-h-18 items-center gap-3 p-3 transition-colors duration-100 active:bg-accent">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface-sunken outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
          {stall.logo ? (
            <Image fill sizes="48px" alt="" src={stall.logo} className="object-cover" />
          ) : (
            <span aria-hidden className="text-h3 text-fg-secondary">
              {stall.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-lead font-medium">{stall.name}</p>
          {stall.description && (
            <p className="line-clamp-2 text-caption text-fg-tertiary">{stall.description}</p>
          )}
          {itemsInOrder > 0 && (
            <p className="text-caption font-medium text-primary">
              <span data-numeric>{itemsInOrder}</span> in your order
            </p>
          )}
        </div>

        <ChevronRight className="size-5 shrink-0 text-fg-tertiary" />
      </Link>
    </li>
  );
}
