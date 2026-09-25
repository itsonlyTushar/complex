"use client";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublicFoodCourt } from "@/hooks/queries/useCourtQuery";
import { useCartStore } from "@/stores/useCartStore";
import { formatMoney } from "@/lib/utils";
import { PublicShell } from "@/components/public/order/PublicShell";
import { IdentityBar } from "@/components/public/order/IdentityBar";
import { SearchField } from "@/components/public/order/SearchField";
import { TicketBar } from "@/components/public/order/TicketBar";
import { CenteredMessage } from "@/components/public/order/CenteredMessage";
import { StallRow } from "@/components/public/order/StallRow";

// Search only earns its space once there are more stalls than fit on one screen.
const SEARCH_THRESHOLD = 6;

// A bad QR code can't be fixed by retrying, so only a network-style failure offers "Try again".
const friendlyError = (message?: string) => {
  if (message?.includes("Invalid Table"))
    return { text: "This QR code doesn't match a table here. Please ask a staff member.", retryable: false };
  if (message?.includes("not found"))
    return { text: "This link doesn't lead to a food court. Try scanning the QR code again.", retryable: false };
  return { text: "Something went wrong while loading the stalls.", retryable: true };
};

function FoodCourtContent({ foodCourtId }: { foodCourtId: string }) {
  const searchParams = useSearchParams();
  const tableId = searchParams.get("tableId");
  const { data, isLoading, isError, error, refetch } = useGetPublicFoodCourt(foodCourtId, tableId);

  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();

  const itemsMap = useCartStore((state) => state.items);
  const cartItems = useMemo(() => Object.values(itemsMap), [itemsMap]);

  const tableLabel = tableId ? `Table ${tableId}` : null;
  const withTable = (path: string, extra = "") =>
    `${path}${tableId ? `?tableId=${encodeURIComponent(tableId)}${extra && `&${extra}`}` : extra && `?${extra}`}`;

  if (isLoading) return <StallListSkeleton tableId={tableId} />;

  if (isError || !data) {
    const problem = friendlyError(error?.message);
    return (
      <CenteredMessage
        eyebrow={tableLabel}
        title="We couldn't open this food court"
        message={problem.text}
        action={
          problem.retryable && (
            <Button variant="outline" onClick={() => refetch()} className="h-11 rounded-xl px-6">
              Try again
            </Button>
          )
        }
      />
    );
  }

  const { foodCourt, restaurants: stalls } = data;

  if (foodCourt.isClosed) {
    return (
      <CenteredMessage
        eyebrow={tableLabel}
        title={foodCourt.name}
        message="We're closed right now and not taking orders. Please check back later."
      />
    );
  }

  const visibleStalls = query
    ? stalls.filter(
        (stall) =>
          stall.name.toLowerCase().includes(query) ||
          stall.description?.toLowerCase().includes(query),
      )
    : stalls;

  // The cart only ever holds one stall's items (a stall page clears anything from another).
  const cartStall = stalls.find((stall) => stall.id === cartItems[0]?.restaurantId);
  const cartCount = cartStall ? cartItems.reduce((sum, item) => sum + item.cartQuantity, 0) : 0;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <IdentityBar title={foodCourt.name} tableId={tableId} />
        {stalls.length >= SEARCH_THRESHOLD && (
          <div className="px-4 pb-3">
            <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search stalls" label="Search stalls" />
          </div>
        )}
      </header>

      <main className={cartCount > 0 ? "px-4 pt-4 pb-32" : "px-4 pt-4 pb-10"}>
        <section aria-labelledby="stalls-title" className="flex flex-col gap-2">
          <div className="px-1">
            <h2 id="stalls-title" className="flex items-baseline gap-2 text-h3">
              Stalls
              <span data-numeric className="text-caption font-normal text-fg-tertiary">
                {stalls.length}
              </span>
            </h2>
            <p className="text-caption text-fg-tertiary">
              Order from one stall at a time. Each stall takes its own payment.
            </p>
          </div>

          {visibleStalls.length === 0 ? (
            <div className="flex flex-col items-center gap-1 py-16 text-center">
              <p className="text-lead font-medium">
                {query ? `No stall matches “${searchQuery.trim()}”` : "No stalls are open right now"}
              </p>
              <p className="text-caption text-fg-tertiary">
                {query ? "Try a different word." : "Please check back in a little while."}
              </p>
            </div>
          ) : (
            <ul className="surface-raise divide-y divide-border overflow-hidden rounded-2xl">
              {visibleStalls.map((stall) => (
                <StallRow
                  key={stall.id}
                  stall={stall}
                  href={withTable(`/public/${foodCourtId}/${stall.id}`)}
                  itemsInOrder={stall.id === cartStall?.id ? cartCount : 0}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      {cartStall && cartCount > 0 && (
        <TicketBar
          itemCount={cartCount}
          total={formatMoney(cartTotal, foodCourt.currancy, { wholeUnits: true })}
          caption={`at ${cartStall.name}`}
          href={withTable(`/public/${foodCourtId}/${cartStall.id}`, "view=cart")}
        />
      )}
    </>
  );
}

function StallListSkeleton({ tableId }: { tableId: string | null }) {
  return (
    <>
      <header className="border-b border-border pt-[env(safe-area-inset-top)]">
        <IdentityBar title="" tableId={tableId} isLoading />
      </header>
      <div className="flex flex-col gap-2 px-4 pt-4" aria-busy="true" aria-label="Loading stalls">
        <Skeleton className="mx-1 h-5 w-24" />
        <Skeleton className="mx-1 h-3 w-64" />
        <div className="surface-raise divide-y divide-border rounded-2xl">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center gap-3 p-3">
              <Skeleton className="size-12 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function PublicFoodCourtPage({ params }: { params: Promise<{ foodCourtId: string }> }) {
  const { foodCourtId } = React.use(params);

  return (
    <PublicShell>
      <Suspense fallback={<StallListSkeleton tableId={null} />}>
        <FoodCourtContent foodCourtId={foodCourtId} />
      </Suspense>
    </PublicShell>
  );
}
