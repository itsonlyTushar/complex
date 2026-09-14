"use client";

import { Fragment, useState } from "react";
import { Check, Minus } from "lucide-react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { CtaBand } from "@/components/marketing/cta-band";
import { Faq } from "@/components/marketing/faq";
import { Reveal } from "@/components/marketing/reveal";
import {
  PricingTiers,
  type BillingCycle,
} from "@/components/marketing/pricing-tiers";

const MATRIX: {
  group: string;
  rows: { label: string; values: (string | boolean)[] }[];
}[] = [
  {
    group: "Capacity",
    rows: [
      { label: "Restaurant vendors", values: ["5", "20", "Unlimited"] },
      { label: "Table QR codes", values: ["25", "Unlimited", "Unlimited"] },
      { label: "Halls or locations", values: ["1", "1", "Unlimited"] },
    ],
  },
  {
    group: "Ordering",
    rows: [
      { label: "Single-cart multi-vendor checkout", values: [true, true, true] },
      { label: "Real-time SMS order alerts", values: [true, true, true] },
      {
        label: "Isolated kitchen display per stall",
        values: [false, true, true],
      },
      { label: "Modifiers and daily specials", values: [false, true, true] },
    ],
  },
  {
    group: "Money",
    rows: [
      { label: "Automated Stripe payout splits", values: [false, true, true] },
      { label: "Commission and rent share", values: [false, true, true] },
      { label: "Campus card and wallet splits", values: [false, false, true] },
    ],
  },
  {
    group: "Insight and support",
    rows: [
      { label: "Sales reporting", values: ["Basic", "Advanced", "Advanced"] },
      { label: "Table turnover analytics", values: [false, true, true] },
      {
        label: "Support",
        values: ["Email", "24/7 priority", "Account director"],
      },
      { label: "Uptime guarantee", values: [false, false, "99.99%"] },
    ],
  },
];

const BILLING_FAQ = [
  {
    q: "What happens after the 14-day trial?",
    a: "Nothing scary. We don't take a card up front, so pick a plan when the trial ends and your tables keep working. Do nothing and ordering just pauses until you choose.",
  },
  {
    q: "Can we change plan mid-month?",
    a: "Yep. Upgrades kick in straight away and get prorated. Downgrades wait until the end of your current period, so you keep what you already paid for.",
  },
  {
    q: "Is there a per-order fee?",
    a: "No. The plan price is the whole cost from us. Stripe charges its own standard transaction rates directly.",
  },
  {
    q: "Do seasonal or pop-up stalls cost extra?",
    a: "Only if they push you past your plan's vendor count. You can add and drop vendors anytime, so a seasonal stall comes off the roster when it leaves.",
  },
  {
    q: "What counts as a vendor?",
    a: "One trading stall with its own menu, kitchen view and payout account. Two brands out of the same kitchen still count as two if they need separate tickets and separate money.",
  },
];

function MatrixValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <>
        <Check className="mx-auto size-4 text-state-ready" aria-hidden="true" />
        <span className="sr-only">Included</span>
      </>
    );
  }

  if (value === false) {
    return (
      <>
        <Minus
          className="mx-auto size-4 text-fg-tertiary/60"
          aria-hidden="true"
        />
        <span className="sr-only">Not included</span>
      </>
    );
  }

  return (
    <span className="text-caption" data-numeric>
      {value}
    </span>
  );
}

export default function PricingPage() {
  const [cycle, setCycle] = useState<BillingCycle>("annual");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1200px] px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20">
          <Reveal className="text-center">
            <span className="eyebrow">Pricing</span>
            <h1 className="mx-auto mt-3 max-w-2xl text-balance text-[2rem] leading-[1.1] font-semibold tracking-[-0.024em] sm:text-[2.75rem]">
              Priced per venue, not per order
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lead text-fg-secondary">
              One plan covers the whole hall. No setup fee, no cut of every
              ticket, no hardware to buy. You get fourteen days to prove it on a
              real service.
            </p>
          </Reveal>

          <Reveal delay={0.07} className="mt-10">
            <PricingTiers cycle={cycle} onCycleChange={setCycle} />
          </Reveal>
        </section>

        <section className="border-t bg-surface-sunken/40">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 sm:py-24">
            <Reveal>
              <h2 className="text-balance text-h1">Compare every feature</h2>
              <p className="mt-2 text-body text-fg-secondary">
                Everything in each plan, side by side.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="mt-8">
              <div className="overflow-x-auto rounded-xl border bg-card">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="border-b">
                      <th
                        scope="col"
                        className="px-4 py-3 text-caption font-medium text-fg-tertiary"
                      >
                        Feature
                      </th>
                      {["Starter", "Pro", "Enterprise"].map((plan) => (
                        <th
                          key={plan}
                          scope="col"
                          className="px-4 py-3 text-center text-caption font-medium"
                        >
                          {plan}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {MATRIX.map((section) => (
                      <Fragment key={section.group}>
                        <tr className="border-b bg-accent/40">
                          <th
                            scope="colgroup"
                            colSpan={4}
                            className="px-4 py-2 text-left"
                          >
                            <span className="eyebrow">{section.group}</span>
                          </th>
                        </tr>

                        {section.rows.map((row) => (
                          <tr
                            key={row.label}
                            className="border-b transition-colors duration-[140ms] ease-(--ease-out) hover:bg-accent/50"
                          >
                            <th
                              scope="row"
                              className="px-4 py-3 text-caption font-normal text-fg-secondary"
                            >
                              {row.label}
                            </th>
                            {row.values.map((value, index) => (
                              <td
                                key={index}
                                className="px-4 py-3 text-center align-middle"
                              >
                                <MatrixValue value={value} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[760px] px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <span className="eyebrow">Billing</span>
            <h2 className="mt-3 text-balance text-h1">Before you pick a plan</h2>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <Faq items={BILLING_FAQ} />
          </Reveal>
        </section>

        <CtaBand
          title="Run one lunch service on us"
          body="Print codes for a few tables, invite two vendors, and watch the rail during your next rush. Fourteen days, no card."
        />
      </main>

      <SiteFooter />
    </div>
  );
}
