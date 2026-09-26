"use client";

import { useGetMe } from "@/hooks/queries/useUserQuery";
import { Skeleton } from "@/components/ui/skeleton";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super admin",
  FOOD_COURT_ADMIN: "Food court admin",
  RESTAURANT_VENDOR: "Vendor",
};

function roleLabel(role?: string) {
  if (!role) return null;
  return ROLE_LABELS[role] ?? role.replace(/_/g, " ");
}

/*
  Who am I signed in as, and with what permissions. It matters here because one
  login routes into three different portals, and an operator who also owns a
  stall can hold more than one account.
*/
export function AccountSummary() {
  const { data: user, isLoading } = useGetMe();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 px-2 py-2">
        <Skeleton className="size-7 shrink-0 rounded-md" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
    );
  }

  const name = user?.name || user?.email;
  const label = roleLabel(user?.role);

  if (!name && !label) return null;

  const initial = (name ?? "?").trim().charAt(0).toUpperCase();

  return (
    <div
      className="flex items-center gap-2.5 px-2 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      title={label ? `${name ?? "Signed in"} · ${label}` : name}
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-accent text-caption font-medium text-accent-foreground">
        {initial}
      </span>

      <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
        {name && (
          <span className="truncate text-caption font-medium leading-tight">
            {name}
          </span>
        )}
        {label && <span className="eyebrow truncate">{label}</span>}
      </div>
    </div>
  );
}
