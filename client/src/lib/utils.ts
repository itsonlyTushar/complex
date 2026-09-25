import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The type scale in globals.css (text-body, text-lead, text-h3…) isn't Tailwind's default,
// so tailwind-merge has to be told these are font sizes; otherwise it treats them as
// colours and drops e.g. text-primary-foreground when text-lead is added.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["micro", "caption", "body", "lead", "h3", "h2", "h1", "display"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(amount: number, currency = "USD", options?: { wholeUnits?: boolean }) {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    // Menu prices are whole rupees/dollars; ₹40 reads better than ₹40.00 on a menu.
    ...(options?.wholeUnits && Number.isInteger(amount) && { minimumFractionDigits: 0, maximumFractionDigits: 0 }),
  }).format(amount)
}
