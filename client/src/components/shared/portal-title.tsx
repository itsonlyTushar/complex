"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  admin: "Service overview",
  "admin/orders": "Orders",
  "admin/tables": "Tables",
  "admin/payments": "Payments",
  "admin/menu": "Menu",
  "admin/settings": "Settings",
  court: "Food court overview",
  "court/restaurants": "Restaurants",
  "court/tables": "Tables",
  "court/settings": "Settings",
  sp: "Platform overview",
  "sp/activity": "Activity",
  "sp/new-court": "New food court",
  "sp/payments": "Payments",
};

export function PortalTitle() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const key =
    TITLES[segments.slice(0, 2).join("/")] ?? TITLES[segments[0] ?? ""];

  return (
    <span className="text-body font-medium">{key ?? "Overview"}</span>
  );
}
