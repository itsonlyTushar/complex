import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12 lg:px-10">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Privacy Policy</h1>
          <p className="max-w-3xl text-base text-muted-foreground md:text-lg">
            This Privacy Policy explains how Complex collects, uses, and protects your information when
            you use our platform.
          </p>
        </div>

        <article className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          <div className="space-y-6 text-sm md:text-base">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect account details, business information, order activity, payment data, and device
                or usage information necessary to operate and improve the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                We use your information to provide the platform, process orders and payments, support
                accounts, communicate updates, and improve reliability and security.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">3. Information Sharing</h2>
              <p className="text-muted-foreground">
                We may share information with trusted partners who help operate the service, such as
                payment processors and hosting providers, as required for delivery of the platform.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
              <p className="text-muted-foreground">
                We use reasonable administrative and technical safeguards to protect information, but no
                system can guarantee absolute security.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">5. Retention</h2>
              <p className="text-muted-foreground">
                We retain personal information for as long as needed to provide the service, comply with
                law, resolve disputes, and enforce agreements.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">6. Your Rights</h2>
              <p className="text-muted-foreground">
                Depending on your location, you may have rights to access, correct, or request deletion
                of your personal data. Please contact us for assistance.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">7. Updates</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically. The latest version will always be
                available on this page.
              </p>
            </section>
          </div>
        </article>

        <p className="text-sm text-muted-foreground">
          Back to <Link href="/" className="text-primary underline underline-offset-4">home</Link>.
        </p>
      </section>
    </main>
  );
}
