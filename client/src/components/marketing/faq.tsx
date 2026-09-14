"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FaqEntry {
  q: string;
  a: string;
}

export function Faq({ items }: { items: FaqEntry[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="divide-y divide-border overflow-hidden rounded-xl border bg-card"
    >
      {items.map((item, index) => (
        <AccordionItem
          key={item.q}
          value={`item-${index}`}
          className="border-b-0 px-4"
        >
          <AccordionTrigger className="py-4 text-left text-body font-medium hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="pb-4 text-caption leading-relaxed text-fg-secondary">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
