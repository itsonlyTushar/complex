import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const toggles = [
  {
    id: "close-court",
    title: "Close food court",
    description:
      "Temporarily stop every stall from accepting new table orders.",
  },
  {
    id: "order-notifications",
    title: "Order notifications",
    description: "Get alerted when a stall falls behind on its tickets.",
  },
];

export default function CourtSettingsPage() {
  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-h2">General</h1>
        <p className="mt-0.5 text-caption text-fg-tertiary">
          Controls that apply across the whole food court
        </p>
      </div>

      <div className="divide-y divide-border rounded-xl border bg-card">
        {toggles.map((toggle) => (
          <div
            key={toggle.id}
            className="flex items-start justify-between gap-6 p-4"
          >
            <div className="min-w-0">
              <Label
                htmlFor={toggle.id}
                className="cursor-pointer text-body font-medium"
              >
                {toggle.title}
              </Label>
              <p className="mt-0.5 text-caption text-fg-tertiary">
                {toggle.description}
              </p>
            </div>
            <Switch id={toggle.id} className="mt-0.5 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
