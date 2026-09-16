import Link from "next/link";
import { Logo } from "@/components/ui/logo";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "For operators", href: "/#operators" },
      { label: "Venues", href: "/#venues" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Portals",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Operator portal", href: "/court" },
      { label: "Vendor portal", href: "/admin" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
          <div className="max-w-xs">
            <Logo size={40} />
            <p className="mt-3 text-caption text-fg-secondary">
              Table ordering for multi-vendor food halls. One cart for the
              guest, separate tickets for every kitchen.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:gap-14">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h3 className="eyebrow">{column.heading}</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-caption text-fg-secondary underline-offset-4 transition-colors duration-[140ms] ease-(--ease-out) hover:text-foreground hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-micro text-fg-tertiary">
            © <span data-numeric>2026</span> Complex. All rights reserved.
          </p>
          <p className="text-micro text-fg-tertiary">
            Built for venues that run on tickets, not queues.
          </p>
        </div>
      </div>
    </footer>
  );
}
