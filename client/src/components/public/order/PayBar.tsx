"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type PayBarProps = {
  label: string;
  busyLabel?: string | null;
  disabled?: boolean;
};

// The one action on the checkout screen, pinned where the thumb already is.
// Rendered inside the checkout <form>, so type="submit" still submits it.
export function PayBar({ label, busyLabel, disabled }: PayBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-md px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button type="submit" disabled={disabled || !!busyLabel} className="h-12 w-full rounded-xl text-lead font-semibold">
          {busyLabel ? (
            <>
              <Spinner className="size-4" />
              {busyLabel}
            </>
          ) : (
            label
          )}
        </Button>
      </div>
    </div>
  );
}
