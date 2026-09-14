"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { useUpdateRestaurantStatus } from "@/hooks/mutations/useUserMutation";

export default function AdminSettingsPage() {
  const { data: user, isLoading } = useGetMe();
  const { mutate: updateStatus, isPending } = useUpdateRestaurantStatus();

  const isClosed = user?.restaurant?.isClosed ?? false;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-h2">General</h1>
        <p className="mt-0.5 text-caption text-fg-tertiary">
          Controls for your stall
        </p>
      </div>

      <div className="divide-y divide-border rounded-xl border bg-card">
        <div className="flex items-start justify-between gap-6 p-4">
          <div className="min-w-0">
            <Label
              htmlFor="close-store"
              className="cursor-pointer text-body font-medium"
            >
              Close store
            </Label>
            <p className="mt-0.5 text-caption text-fg-tertiary">
              Stop accepting new table orders. Tickets already on the rail are
              unaffected.
            </p>
            {isClosed && (
              <span className="state-chip mt-2" data-state="late">
                Closed to new orders
              </span>
            )}
          </div>
          <Switch
            id="close-store"
            className="mt-0.5 shrink-0"
            checked={isClosed}
            onCheckedChange={(checked) => updateStatus(checked)}
            disabled={isLoading || isPending}
          />
        </div>

        <div className="flex items-start justify-between gap-6 p-4">
          <div className="min-w-0">
            <Label
              htmlFor="notifications"
              className="text-body font-medium text-fg-tertiary"
            >
              Notifications
            </Label>
            <p className="mt-0.5 text-caption text-fg-tertiary">
              Alerts for tickets ageing past their threshold.
            </p>
            <span className="state-chip mt-2" data-state="idle">
              Coming soon
            </span>
          </div>
          <Switch id="notifications" className="mt-0.5 shrink-0" disabled />
        </div>
      </div>
    </section>
  );
}
