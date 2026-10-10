"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRightLeft, LogOut, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isGuestSession } from "@/lib/guest-data";
import { toast } from "@/lib/toast";

export function GuestModeBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    setIsGuest(isGuestSession());
  }, [pathname]);

  if (!isGuest) return null;

  const isCourt = pathname.startsWith("/court");

  const handleSwitchPerspective = () => {
    const nextRole = isCourt ? "RESTAURANT_VENDOR" : "FOOD_COURT_ADMIN";
    const nextToken = isCourt ? "guest_token_vendor" : "guest_token_court";
    const nextPath = isCourt ? "/admin" : "/court";
    const nextLabel = isCourt ? "Stall Vendor" : "Food Court Operator";

    document.cookie = `token=${nextToken}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `user_role=${nextRole}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `is_guest=true; path=/; max-age=86400; SameSite=Lax`;

    toast.success(`Switched perspective to ${nextLabel}`);
    router.push(nextPath);
  };

  const handleExitGuest = () => {
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `is_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    toast.info("Exited guest mode");
    router.push("/login");
  };

  return (
    <aside
      aria-label="Guest Mode Notification"
      className="sticky top-12 z-20 flex flex-wrap items-center justify-between gap-2.5 border-b border-primary/20 bg-primary/5 px-3.5 py-1.5 backdrop-blur-sm sm:px-5"
    >
      <div className="flex items-center gap-2 text-caption">
        <span className="flex items-center gap-1.5 rounded-full bg-primary/15 px-2 py-0.5 text-micro font-medium text-primary">
          <Eye className="size-3" />
          <span>Guest View</span>
        </span>
        <span className="text-fg-secondary">
          Exploring as{" "}
          <strong className="font-semibold text-fg-primary">
            {isCourt ? "Food Court Operator" : "Shop / Stall (Smokey Joe's BBQ)"}
          </strong>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSwitchPerspective}
          className="h-7 gap-1.5 px-2.5 text-caption font-medium shadow-none hover:bg-card"
        >
          <ArrowRightLeft className="size-3 text-fg-secondary" />
          <span>{isCourt ? "Switch to Stall view" : "Switch to Food Court view"}</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleExitGuest}
          className="h-7 gap-1 px-2 text-caption text-fg-tertiary hover:text-state-late"
          title="Exit Guest Mode"
        >
          <LogOut className="size-3" />
          <span className="hidden sm:inline">Exit</span>
        </Button>
      </div>
    </aside>
  );
}
