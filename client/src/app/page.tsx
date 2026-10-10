import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/marketing/site-nav";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";
import { SiteFooter } from "@/components/marketing/site-footer";
import { HairlineFoodcourt } from "@/components/marketing/hairline-foodcourt";
import { BuiltForSection } from "@/components/marketing/built-for";
import { TestimonialsSection } from "@/components/marketing/testimonials";
import { HairlineFlow } from "@/components/marketing/hairline-flow";
import { IntegrationsBanner } from "@/components/marketing/integrations-banner";
import { PricingTeaser } from "@/components/marketing/pricing-tiers";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";



const FAQ_ITEMS = [
  {
    q: "Do we need to buy hardware?",
    a: "No. It's software. You print QR codes for your tables and your vendors use whatever browser they already have, whether that's a phone, a tablet or the screen already sitting in the kitchen.",
  },
  {
    q: "Do guests have to download an app?",
    a: "Nope. Scanning the code opens the menu in their browser. They order, they pay, they get updates by text.",
  },
  {
    q: "How does one payment reach several vendors?",
    a: "The guest pays once. We split it per stall through Stripe, take out your commission or rent share, and pay each vendor on your schedule.",
  },
  {
    q: "What happens when vendors change?",
    a: "Add or drop a stall in the operator portal. Table codes never change, so there's nothing to reprint and service doesn't stop.",
  },
  {
    q: "Can we try it on one section first?",
    a: "Yes, and most halls do exactly that. Codes on a handful of tables, run one lunch, then expand once your vendors have watched the rail work.",
  },
];

export default function Home() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteNav />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1200px] px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
            {/* The hero renders immediately rather than fading in: the headline
                should never wait on JS, and it is the one thing a visitor is
                here to read. */}
            <div>
              <div>
                <span className="eyebrow">Table ordering for food halls</span>
                <h1 className="mt-3 text-balance text-[2.25rem] leading-[1.08] font-semibold tracking-[-0.026em] sm:text-[3rem] lg:text-[3.5rem]">
                  Every table is a counter.
                </h1>
                <p className="mt-4 max-w-xl text-lead text-fg-secondary">
                  Guests scan, order from every stall in one cart, and pay once.
                  Each kitchen only sees its own tickets. You see the whole floor.
                </p>

                <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">Start free trial</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#built-for">See who it's for</Link>
                  </Button>
                </div>

                <p className="mt-4 text-caption text-fg-tertiary">
                  14-day trial. No card. Nothing to install.
                </p>
              </div>
            </div>

            <HairlineFoodcourt />
          </div>
        </section>

        <IntegrationsBanner />

        <BuiltForSection />

        <section
          id="operators"
          className="scroll-mt-20 border-y bg-surface-sunken/40 py-20 sm:py-28"
        >
          <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
            <Reveal>
              <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
                <span className="eyebrow">End-to-end flow</span>
                <h2 className="mt-3 text-balance text-h1">
                  From table scan to kitchen payout
                </h2>
                <p className="mt-4 text-lead text-fg-secondary">
                  One continuous loop connecting guests, multiple food hall kitchens, and automated operations.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="rounded-2xl border bg-card/60 p-4 sm:p-8 backdrop-blur-xs">
                <HairlineFlow />
              </div>
            </Reveal>
          </div>
        </section>

        <TestimonialsSection />

        <section className="border-t bg-surface-sunken/40">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 sm:py-28">
            <Reveal className="text-center">
              <span className="eyebrow">Pricing</span>
              <h2 className="mx-auto mt-3 max-w-2xl text-balance text-h1">
                Priced per venue, not per order
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-body text-fg-secondary">
                No setup fee, no cut of every ticket, no hardware line item.
                Switch plans or leave whenever you want.
              </p>
            </Reveal>

            <Reveal delay={0.06} className="mt-10">
              <PricingTeaser />
            </Reveal>

            <Reveal delay={0.1} className="mt-6 text-center">
              <Link
                href="/pricing"
                className="text-caption font-medium text-primary underline-offset-4 hover:underline"
              >
                Compare every feature →
              </Link>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[760px] px-4 py-20 sm:px-6 sm:py-28">
          <Reveal>
            <span className="eyebrow">Questions</span>
            <h2 className="mt-3 text-balance text-h1">
              Stuff operators ask us first
            </h2>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <Faq items={FAQ_ITEMS} />
          </Reveal>
        </section>

        <CtaBand />
      </main>

        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
