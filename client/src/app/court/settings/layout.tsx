"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNavItems = [
  {
    title: "General",
    href: "/court/settings",
  },
    {
    title: "Tables",
    href: "/court/settings/tables",
  },
  
  {
    title: "Account",
    href: "/court/settings/accounts",
  },
  {
    title: "Payments",
    href: "/court/settings/payments",
  },

];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 py-4 lg:flex-row lg:gap-8">
      <aside className="lg:w-56 lg:shrink-0">
        <nav
          aria-label="Settings"
          className="flex gap-1 overflow-x-auto lg:sticky lg:top-16 lg:flex-col lg:overflow-visible"
        >
          {settingsNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-body whitespace-nowrap transition-colors duration-[140ms] ease-(--ease-out)",
                  isActive
                    ? "bg-accent font-medium text-accent-foreground"
                    : "text-fg-secondary hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="w-full min-w-0 flex-1">{children}</div>
    </div>
  );
}
