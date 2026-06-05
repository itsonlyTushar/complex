"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { useUpdateRestaurantStatus } from "@/hooks/mutations/useUserMutation";
import { Separator } from "@/components/ui/separator";

export default function AdminSettingsPage() {
  const { data: user, isLoading } = useGetMe();
  const { mutate: updateStatus, isPending } = useUpdateRestaurantStatus();

  const isClosed = user?.restaurant?.isClosed ?? false;

  const handleToggle = (checked: boolean) => {
    updateStatus(checked);
  };

  return (
    <section className="bg-card rounded-xl border shadow-sm p-6 h-full">
      <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
        General
      </h1>

      <Separator className="my-6 bg-border/60" />

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
