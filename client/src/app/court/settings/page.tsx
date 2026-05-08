import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  return (
    <section className="bg-card rounded-xl border shadow-sm p-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight mb-8">General</h1>

      {/* Close store switches   */}
      <div className="flex gap-2">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 max-w-md">
          <Switch id="close-store" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="close-store"
              className="text-base font-semibold leading-none cursor-pointer"
            >
              Close Store
            </Label>
            <p className="text-sm text-muted-foreground">
              Temporarily disable orders from your store.
            </p>
          </div>
        </div>

        {/* Notification settings  */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 max-w-md">
          <Switch id="close-store" />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="close-store"
              className="text-base font-semibold leading-none cursor-pointer"
            >
              Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Change the notifications settings.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
