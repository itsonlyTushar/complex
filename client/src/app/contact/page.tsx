import type { Metadata } from "next";
import {
  Building2,
  Headphones,
  Workflow,
  ArrowRight,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Reveal } from "@/components/marketing/reveal";
import { ContactForm } from "@/components/marketing/contact-form";
import { CtaBand } from "@/components/marketing/cta-band";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Complex team for food hall onboarding, kitchen routing demonstrations, vendor payouts, and technical support.",
};

const CONTACT_CHANNELS = [
  {
    icon: Building2,
    badge: "Sales & Onboarding",
    title: "Launch a food hall",
    email: "sales@complexapp.food",
    description:
      "Schedule a 15-minute live platform walkthrough, review multi-vendor payout splits, or get table QR sticker templates.",
  },
  {
    icon: Headphones,
    badge: "Live Kitchen Support",
    title: "Active service helpline",
    email: "support@complexapp.food",
    description:
      "Urgent assistance for live venues. Our operations engineers monitor tickets and kitchen rails during trading rush hours.",
  },
  {
    icon: Workflow,
    badge: "Integrations & APIs",
    title: "POS & hardware bridge",
    email: "partners@complexapp.food",
    description:
      "Connect existing thermal kitchen receipt printers, export data to external accounting, or build custom webhook integrations.",
  },
];



export default function ContactPage() {
  return (
    <SmoothScroll>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteNav />

        <main className="flex-1">
          {/* Header section */}
          <section className="mx-auto w-full max-w-[1200px] px-4 pt-14 pb-12 sm:px-6 sm:pt-20 sm:pb-16">
            <Reveal className="max-w-2xl">
              <span className="eyebrow">Contact & Inquiries</span>
              <h1 className="mt-3 text-balance text-[2rem] leading-[1.1] font-semibold tracking-[-0.024em] sm:text-[2.75rem]">
                Let's get your tables talking
              </h1>
              <p className="mt-4 text-lead text-fg-secondary">
                Whether you operate a 20-stall hall, run an independent kitchen,
                or want to replace clunky hardware with clean QR rails, our team
                is here to help.
              </p>
            </Reveal>
          </section>

          {/* Form and Channels Grid */}
          <section className="border-t bg-surface-sunken/30">
            <div className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Left Column: Direct Channels & Guidance */}
                <div className="flex flex-col gap-6 lg:col-span-5">

                  <div className="space-y-4">
                    {CONTACT_CHANNELS.map((channel) => {
                      const Icon = channel.icon;
                      return (
                        <div
                          key={channel.title}
                          className="rounded-xl border border-border bg-card p-5 transition-colors duration-[140ms] ease-(--ease-out) hover:border-border-strong"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-accent/40 text-foreground">
                              <Icon className="size-4.5" />
                            </div>
                            <div>
                              <span className="text-micro font-medium uppercase tracking-wider text-fg-tertiary">
                                {channel.badge}
                              </span>
                              <h3 className="text-body font-semibold text-foreground">
                                {channel.title}
                              </h3>
                            </div>
                          </div>

                          <p className="mt-3 text-caption text-fg-secondary">
                            {channel.description}
                          </p>

                          <div className="mt-3.5 border-t border-border pt-3">
                            <a
                              href={`mailto:${channel.email}`}
                              className="inline-flex items-center gap-1.5 font-mono text-caption font-medium text-foreground hover:underline"
                            >
                              <span>{channel.email}</span>
                              <ArrowRight className="size-3 text-fg-tertiary" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Column: Interactive Form */}
                <div className="lg:col-span-7">
                  <Reveal delay={0.08}>
                    <ContactForm />
                  </Reveal>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Band */}
          <CtaBand
            title="Want to test order routing right now?"
            body="Start your 14-day free trial in under 2 minutes. Generate table codes and explore the live kitchen display system without a sales call."
          />
        </main>

        <SiteFooter />
      </div>
    </SmoothScroll>
  );
}
