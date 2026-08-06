"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FaqSection() {
  const faqs = [
    {
      q: "How does table QR code ordering work in a shared food court?",
      a: "Unique QR code stickers are placed on each table in the shared dining area. When a diner sits down, they scan the QR code on their phone. The digital portal displays all restaurant vendors operating in that food court. Diners select items, place their order, and pay instantly without standing in counter lines.",
    },
    {
      q: "Can individual restaurant vendors see other restaurants' orders?",
      a: "No. COMPLEX provides complete vendor order isolation. Each restaurant receives a dedicated kitchen terminal showing ONLY their own orders. Other vendors operating in the same food court cannot view competitor ticket streams or revenue data.",
    },
    {
      q: "How do payments work if a diner orders from multiple vendors?",
      a: "Diners add items from any vendor into a single cart and pay once using Apple Pay, Google Pay, or Credit Card. Behind the scenes, COMPLEX automatically splits the payment and routes funds directly to each vendor's connected Stripe account.",
    },
    {
      q: "How fast can we set up COMPLEX for our food court?",
      a: "Food court setups take less than 15 minutes. Simply generate your table QR map, invite your restaurant vendors via email, and upload digital menus. Vendors can start receiving kitchen orders immediately.",
    },
    {
      q: "How do diners know when their food is ready?",
      a: "When a vendor marks an order as 'Ready' on their kitchen screen, diners receive an instant real-time alert on their phone screen (and optional SMS notification) prompting them to collect their meal at the vendor's counter.",
    },
    {
      q: "Is there a free trial available?",
      a: "Yes! Every new food court account includes a full-featured 14-day free trial. No credit card is required to test the platform and set up your table QR maps.",
    },
  ];

  return (
    <section className="w-full bg-[#f0ebe3] text-[#114236] py-16 sm:py-24 border-b border-[#114236]/10" id="faq">
      <div className="w-full max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-[#114236] uppercase mb-3">
            <HelpCircle className="w-4 h-4 text-[#114236]" /> Clear Answers
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#114236] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-[#114236]/80 mt-3">
            Everything you need to know about implementing COMPLEX in your food court or dining hall.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="rounded-2xl bg-white border border-[#114236]/15 p-6 sm:p-8 space-y-2 shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-[#114236]/10 py-2">
                <AccordionTrigger className="text-left text-sm sm:text-base font-bold text-[#114236] hover:text-[#114236]/80 transition-colors py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-[#114236]/80 leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

      </div>
    </section>
  );
}
