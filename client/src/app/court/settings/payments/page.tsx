import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function page() {
  return (

    <section className="bg-card rounded-xl border shadow-sm p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Payments</h1>
        </div>
      </div>

      <Separator className="mb-10 bg-border/60" />

      <section className="flex gap-5 justify-around">

      <div className="flex gap-2 items-center">
        <Switch id="stripe" />
        <div>
          <Label
            htmlFor="stripe"
            className="text-base font-semibold leading-none cursor-pointer"
            >
            Stripe
          </Label>
          <span className="text-xs text-muted-foreground ">Activate Stripe Payments</span>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Switch id="razor-pay" />
        <div>
          <Label
            htmlFor="razor-pay"
            className="text-base font-semibold leading-none cursor-pointer"
          >
            Razor Pay
          </Label>
          <span className="text-xs text-muted-foreground ">Activate Razor Pay Payments</span>
        </div>
      </div>
      </section>

    </section>
  )
}
