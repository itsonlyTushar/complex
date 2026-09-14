import Link from "next/link";
import { QrCode, Split, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/marketing/site-nav";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SplitTicket } from "@/components/marketing/split-ticket";
import { VenueSwitcher } from "@/components/marketing/venue-switcher";
import { LiveRail } from "@/components/marketing/live-rail";
import { PricingTeaser } from "@/components/marketing/pricing-tiers";
import { Faq } from "@/components/marketing/faq";
import { CtaBand } from "@/components/marketing/cta-band";
import { Reveal } from "@/components/marketing/reveal";

const PROOF = [
  { value: "38s", label: "Scan to paid, typically" },
  { value: "3.1×", label: "Stalls per guest cart" },
  { value: "0", label: "Terminals to buy" },
];

const STEPS = [
  {
    icon: QrCode,
    title: "Print one code per table",
    body: "A sticker. That's the whole install. No tablets to mount, no hardware budget, nobody coming out to set it up.",
  },
  {
    icon: Split,
    title: "One cart, every stall",
    body: "Guests browse the whole hall, build one cart and pay once, right in the browser. No app download, because nobody is downloading an app for lunch.",
  },
  {
    icon: Timer,
    title: "Kitchens get their own rail",
    body: "We split the cart into per-stall tickets and start a clock on each one. Your stalls see their own line and nothing else.",
  },
];

const OPERATOR_POINTS = [
  {
    title: "Ticket age, not vibes",
    body: "Every ticket has a clock that escalates as it sits. You can spot the stall that's drowning from across the floor.",
  },
  {
    title: "Splits sort themselves out",
    body: "One guest payment, lots of vendors. We divide it per stall and take your commission out before anyone gets paid.",
  },
  {
    title: "Vendors stay in their lane",
    body: "Every stall gets its own portal, menu and kitchen view. They never see another vendor's orders or numbers.",
  },
];

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
                    <Link href="#how-it-works">See how it works</Link>
                  </Button>
                </div>

                <p className="mt-4 text-caption text-fg-tertiary">
                  14-day trial. No card. Nothing to install.
                </p>
              </div>
            </div>

            <SplitTicket />
          </div>
        </section>

        <section className="border-y bg-surface-sunken/40">
          <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {PROOF.map((item) => (
                <div key={item.label} className="flex items-baseline gap-3">
                  <dt className="order-2 text-caption text-fg-tertiary">
                    {item.label}
                  </dt>
                  <dd className="order-1 text-h1 leading-none" data-numeric>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
        >
          <Reveal>
            <span className="eyebrow">How it works</span>
            <h2 className="mt-3 max-w-2xl text-balance text-h1">
              Three steps. Then the queue is gone.
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.07}>
                <div className="flex h-full flex-col rounded-xl border bg-card p-5 transition-colors duration-[140ms] ease-(--ease-out) hover:border-border-strong">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                      <step.icon className="size-4" />
                    </span>
                    <span className="eyebrow" data-numeric>
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-h3">{step.title}</h3>
                  <p className="mt-2 text-caption leading-relaxed text-fg-secondary">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          id="operators"
          className="scroll-mt-20 border-y bg-surface-sunken/40"
        >
          <div className="mx-auto w-full max-w-[1200px] px-4 py-20 sm:px-6 sm:py-28">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
              <Reveal>
                <div>
                  <span className="eyebrow">For operators</span>
                  <h2 className="mt-3 text-balance text-h1">
                    The whole floor on one rail
                  </h2>
                  <p className="mt-4 max-w-xl text-lead text-fg-secondary">
                    You run the venue, not the kitchens. This is the view a hall
                    has never really had: every stall&apos;s load, side by side,
                    clock running.
                  </p>

                  <dl className="mt-7 flex flex-col gap-5">
                    {OPERATOR_POINTS.map((point) => (
                      <div key={point.title} className="flex gap-3">
                        <span
                          className="state-rail self-stretch"
                          data-state="ready"
                        />
                        <div>
                          <dt className="text-body font-medium">
                            {point.title}
                          </dt>
                          <dd className="mt-1 text-caption leading-relaxed text-fg-secondary">
                            {point.body}
                          </dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <LiveRail />
              </Reveal>
            </div>
          </div>
        </section>

        <section
          id="venues"
          className="mx-auto w-full max-w-[1200px] scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28"
        >
          <Reveal>
            <span className="eyebrow">Venues</span>
            <h2 className="mt-3 max-w-2xl text-balance text-h1">
              Built for rooms where nobody owns the table
            </h2>
          </Reveal>

          <Reveal delay={0.06} className="mt-8">
            <VenueSwitcher />
          </Reveal>
        </section>

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
