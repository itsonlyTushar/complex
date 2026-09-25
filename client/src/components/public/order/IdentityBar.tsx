"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

type IdentityBarProps = {
  title: string;
  tableId: string | null;
  isLoading?: boolean;
  backHref?: string;
  backLabel?: string;
};

// The top row of every guest page: where you're sitting, and whose menu you're in.
export function IdentityBar({ title, tableId, isLoading, backHref, backLabel = "Back" }: IdentityBarProps) {
  return (
    <div className={cn("flex h-14 items-center gap-1", backHref ? "px-2" : "pr-2 pl-4")}>
      {backHref && (
        <Link
          href={backHref}
          aria-label={backLabel}
          className="flex size-11 shrink-0 items-center justify-center rounded-lg text-fg-secondary transition-[background-color,transform] duration-100 active:scale-95 active:bg-accent"
        >
          <ArrowLeft className="size-5" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        {tableId && (
          <p className="eyebrow">
            Table <span data-numeric>{tableId}</span>
          </p>
        )}
        {isLoading ? <Skeleton className="mt-1 h-5 w-40" /> : <h1 className="truncate text-h3">{title}</h1>}
      </div>
      <ThemeToggle />
    </div>
  );
}
