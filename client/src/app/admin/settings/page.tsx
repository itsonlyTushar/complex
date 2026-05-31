"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { useUpdateRestaurantStatus } from "@/hooks/mutations/useUserMutation";

export default function AdminSettingsPage() {
  const { data: user, isLoading } = useGetMe();
  const { mutate: updateStatus, isPending } = useUpdateRestaurantStatus();

  const isClosed = user?.restaurant?.isClosed ?? false;

  const handleToggle = (checked: boolean) => {
    updateStatus(checked);
  };

  return (
    <section className="bg-card rounded-xl border shadow-sm p-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight mb-8">General</h1>

      {/* Close store switches   */}
      <div className="flex gap-2">
        <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 max-w-md">
          <Switch
            id="close-store"
            checked={isClosed}
            onCheckedChange={handleToggle}
            disabled={isLoading || isPending}
          />
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
        <div className="flex items-center gap-4 p-4 rounded-lg bg-accent/30 border border-border/50 max-w-md opacity-60">
          <Switch id="notifications" disabled />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="notifications"
              className="text-base font-semibold leading-none cursor-not-allowed"
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

