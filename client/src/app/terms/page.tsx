import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Terms and Conditions</h1>
          <p className="max-w-3xl text-base text-muted-foreground md:text-lg">
            These terms govern your use of the Complex platform, including food court administration,
            restaurant vendor dashboards, and customer ordering services.
          </p>
        </div>

        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="space-y-6 text-sm md:text-base">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Complex, you agree to be bound by these Terms and Conditions.
                If you do not agree, please do not use the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">2. Use of the Service</h2>
              <p className="text-muted-foreground">
                You may use Complex only for lawful purposes. You must not attempt to interfere with the
                platform, bypass access controls, or misuse payment or ordering functionality.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">3. Accounts and Responsibilities</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the confidentiality of your account credentials and
                for all activity performed through your account.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">4. Payments and Orders</h2>
              <p className="text-muted-foreground">
                All payments made through Complex are subject to the payment processor&apos;s terms.
                Orders placed through the platform are subject to the applicable restaurant policies and
                availability.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The platform, its design, and its content remain the property of Complex unless otherwise
                stated. You may not copy, redistribute, or repurpose the platform without permission.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                Complex is provided as-is. We are not liable for indirect, incidental, or consequential
                damages arising from your use of the service, except where prohibited by law.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">7. Changes to These Terms</h2>
              <p className="text-muted-foreground">
                We may update these Terms and Conditions from time to time. Continued use of the service
                after changes are posted means you accept the revised terms.
              </p>
            </section>
          </div>
        </article>

        <p className="text-sm text-muted-foreground">
          Need help? Return to the <Link href="/" className="text-primary underline underline-offset-4">homepage</Link>.
        </p>
      </section>
    </main>
  );
}
