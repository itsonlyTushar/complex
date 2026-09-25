"use client";

import { ArrowLeft } from "lucide-react";

type ViewHeaderProps = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  backLabel?: string;
};

// Top bar for the cart and order-status views: back on the left in thumb reach
// of the edge, the view's name, and where the guest is sitting.
export function ViewHeader({ title, subtitle, onBack, backLabel = "Back to menu" }: ViewHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-2">
        <button
          type="button"
          onClick={onBack}
          aria-label={backLabel}
          className="flex size-11 items-center justify-center rounded-lg text-fg-secondary transition-[background-color,transform] duration-100 active:scale-95 active:bg-accent"
        >
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-h3">{title}</h1>
          {subtitle && <p className="truncate text-caption text-fg-tertiary">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
