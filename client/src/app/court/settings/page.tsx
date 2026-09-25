"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { useUpdateFoodCourtStatus } from "@/hooks/mutations/useUserMutation";
import { toast } from "@/lib/toast";

export default function CourtSettingsPage() {
  const { data: user, isLoading } = useGetMe();
  const { mutate: updateStatus, isPending } = useUpdateFoodCourtStatus();

  const isClosed = user?.foodCourt?.isClosed ?? false;

  return (
    <section className="flex flex-col gap-5">
      <div>
        <h1 className="text-h2">General</h1>
        <p className="mt-0.5 text-caption text-fg-tertiary">
          Controls that apply across the whole food court
        </p>
      </div>

      <div className="divide-y divide-border rounded-xl border bg-card">
        <div className="flex items-start justify-between gap-6 p-4">
          <div className="min-w-0">
            <Label
              htmlFor="close-court"
              className="cursor-pointer text-body font-medium"
            >
              Close food court
            </Label>
            <p className="mt-0.5 text-caption text-fg-tertiary">
              Temporarily stop every stall from accepting new table orders.
            </p>
            {isClosed && (
              <span className="state-chip mt-2" data-state="late">
                Closed to new orders
              </span>
            )}
          </div>
          <Switch
            id="close-court"
            className="mt-0.5 shrink-0"
            checked={isClosed}
            onCheckedChange={(checked) =>
              updateStatus(checked, {
                onError: (error) => toast.error(error.message),
              })
            }
            disabled={isLoading || isPending}
          />
        </div>

        <div className="flex items-start justify-between gap-6 p-4">
          <div className="min-w-0">
            <Label
              htmlFor="order-notifications"
              className="text-body font-medium text-fg-tertiary"
            >
              Order notifications
            </Label>
            <p className="mt-0.5 text-caption text-fg-tertiary">
              Get alerted when a stall falls behind on its tickets.
            </p>
            <span className="state-chip mt-2" data-state="idle">
              Coming soon
            </span>
          </div>
          <Switch
            id="order-notifications"
            className="mt-0.5 shrink-0"
            disabled
          />
        </div>
      </div>
    </section>
  );
}
