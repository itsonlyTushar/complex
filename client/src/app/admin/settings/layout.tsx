"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNavItems = [
  {
    title: "General",
    href: "/admin/settings",
  },
  {
    title: "Account",
    href: "/admin/settings/accounts",
  },
  {
    title: "Payments",
    href: "/admin/settings/payment",
  },
  {
    title: "Menu",
    href: "/admin/settings/menu",
  },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 p-6 lg:items-start">
      <aside className="lg:w-1/5 border px-2 py-4 rounded-xl shadow">
        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
          {settingsNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium hover:bg-accent",
                pathname === item.href ? "bg-accent" : "transparen",
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1 lg:max-w-2xl">{children}</div>
    </div>
  );
}
