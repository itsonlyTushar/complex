"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type TicketBarProps = {
  itemCount: number;
  total: string;
  caption?: string | null;
} & ({ href: string; onClick?: never } | { onClick: () => void; href?: never });

const barClass =
  "pointer-events-auto flex h-14 w-full items-center justify-between gap-3 rounded-2xl bg-primary pr-3 pl-4 text-primary-foreground shadow-overlay transition-transform duration-100 ease-(--ease-out) active:scale-[0.98]";

// The guest's running order, docked where the thumb rests. The only solid blue on the page.
export function TicketBar({ itemCount, total, caption, href, onClick }: TicketBarProps) {
  const content = (
    <>
      <span className="flex min-w-0 flex-col items-start">
        <span className="text-body font-semibold">
          <span data-numeric>{itemCount}</span> {itemCount === 1 ? "item" : "items"}
        </span>
        {caption && <span className="max-w-full truncate text-caption opacity-80">{caption}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-2 text-body font-semibold">
        <span data-numeric>{total}</span>
        <span aria-hidden className="h-5 w-px bg-current opacity-30" />
        View order
        <ChevronRight className="size-4" />
      </span>
    </>
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-md px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {href ? (
          <Link href={href} className={barClass}>
            {content}
          </Link>
        ) : (
          <button type="button" onClick={onClick} className={barClass}>
            {content}
          </button>
        )}
      </div>
    </div>
  );
}
