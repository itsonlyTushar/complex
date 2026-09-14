import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";

export function CtaBand({
  title = "Put a code on every table this week",
  body = "Fourteen days free, no card, nothing to buy. Print your table codes and start routing orders the same afternoon.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal>
        <div className="flex flex-col items-start gap-5 rounded-xl border bg-card p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-h2 text-balance">{title}</h2>
            <p className="mt-2 text-body text-fg-secondary">{body}</p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">Start free trial</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">See pricing</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
