"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMenus } from "@/hooks/queries/useMenuQuery";
import { useGetOrders } from "@/hooks/queries/useOrderQuery";
import { useGetRestaurantDetails } from "@/hooks/queries/useCourtQuery";
import { useCartStore } from "@/stores/useCartStore";
import { cn, formatMoney } from "@/lib/utils";
import type { Menu } from "@/types";
import { CartView } from "@/components/public/order/CartView";
import { MenuItemRow } from "@/components/public/order/MenuItemRow";
import { OrdersView, OrderStatusStrip } from "@/components/public/order/OrderStatus";
import { PublicShell as Shell } from "@/components/public/order/PublicShell";
import { IdentityBar } from "@/components/public/order/IdentityBar";
import { SearchField } from "@/components/public/order/SearchField";
import { TicketBar } from "@/components/public/order/TicketBar";
import { CenteredMessage } from "@/components/public/order/CenteredMessage";

type View = "menu" | "cart" | "orders";
const VIEWS: readonly View[] = ["menu", "cart", "orders"];

const sectionId = (index: number) => `menu-section-${index}`;

function Restaurant({ params }: { params: Promise<{ foodCourtId: string; restaurantId: string }> }) {
  const { foodCourtId, restaurantId } = React.use(params);
  const searchParams = useSearchParams();

  const tableIdFromUrl = searchParams.get("tableId");
  const parsedTableId = tableIdFromUrl && !isNaN(parseInt(tableIdFromUrl, 10))
    ? parseInt(tableIdFromUrl, 10)
    : undefined;
  const viewParam = searchParams.get("view") as View | null;
  const view: View = viewParam && VIEWS.includes(viewParam) ? viewParam : "menu";

  const { data: menus = [], isLoading: isMenusLoading, isError: isMenusError, refetch: refetchMenus } = useGetMenus(restaurantId);
  const { data: restaurantDetails, isLoading: isDetailsLoading } = useGetRestaurantDetails(restaurantId);
  const { data: orderData, refetch: refetchOrders } = useGetOrders(
    { restaurantId, tableNumber: parsedTableId },
    // Poll only while something is being made, so the status moves without a refresh.
    { refetchInterval: (query) => (query.state.data?.orders.length ? 15_000 : false) },
  );
  const activeOrders = orderData?.orders ?? [];

  const currency = restaurantDetails?.foodCourt?.currancy ?? "USD";
  const usesRazorpay = restaurantDetails?.foodCourt?.paymentSystem === "razorpay";
  const stallName: string = restaurantDetails?.name ?? "";
  const tableLabel = tableIdFromUrl ? `Table ${tableIdFromUrl}` : null;
  const viewSubtitle = [stallName, tableLabel].filter(Boolean).join(" · ");
  const courtHref = `/public/${foodCourtId}${tableIdFromUrl ? `?tableId=${tableIdFromUrl}` : ""}`;
  const closedMessage = restaurantDetails?.foodCourt?.isClosed
    ? "This food court isn't taking orders right now."
    : restaurantDetails?.isClosed
      ? "This stall isn't taking orders right now."
      : null;

  const itemsMap = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clearCart);

  // The cart is shared across every store page, so items picked at another
  // (possibly now closed) store must not be checked out under this one.
  useEffect(() => {
    const items = Object.values(useCartStore.getState().items);
    if (items.some((item) => item.restaurantId !== restaurantId)) {
      clearCart();
    }
  }, [restaurantId, clearCart]);

  const cartItems = useMemo(() => Object.values(itemsMap), [itemsMap]);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.cartQuantity, 0);

  const addToCart = (menu: Menu) => {
    if ((itemsMap[menu.id]?.cartQuantity ?? 0) < menu.quantity) {
      addItem(menu);
    }
  };

  // Views live in the URL so the phone's back button steps back through them
  // instead of leaving the stall.
  const pushedView = useRef(false);
  const menuScrollY = useRef(0);

  const viewUrl = (next: View) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    if (next === "menu") nextParams.delete("view");
    else nextParams.set("view", next);
    const query = nextParams.toString();
    return `${window.location.pathname}${query ? `?${query}` : ""}`;
  };

  const openView = (next: View) => {
    if (view === "menu") menuScrollY.current = window.scrollY;
    window.history.pushState(null, "", viewUrl(next));
    pushedView.current = true;
  };

  const backToMenu = () => {
    if (pushedView.current) {
      pushedView.current = false;
      window.history.back();
    } else {
      window.history.replaceState(null, "", viewUrl("menu"));
    }
  };

  const handlePaid = () => {
    refetchOrders();
    if (parsedTableId !== undefined) {
      window.history.replaceState(null, "", viewUrl("orders"));
    } else {
      backToMenu();
    }
  };

  useEffect(() => {
    window.scrollTo(0, view === "menu" ? menuScrollY.current : 0);
  }, [view]);

  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.trim().toLowerCase();

  const sections = useMemo(() => {
    const visible = query
      ? menus.filter(
          (menu) =>
            menu.itemName.toLowerCase().includes(query) ||
            menu.description?.toLowerCase().includes(query),
        )
      : menus;

    const groups = new Map<string, Menu[]>();
    for (const menu of visible) {
      const category = menu.category || "More";
      groups.set(category, [...(groups.get(category) ?? []), menu]);
    }
    return [...groups].map(([category, items]) => ({ category, items }));
  }, [menus, query]);

  const showRail = !query && sections.length > 1;
  const headerRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const observer = new ResizeObserver(() => setHeaderHeight(header.offsetHeight));
    observer.observe(header);
    return () => observer.disconnect();
  }, [view, closedMessage]);

  // Highlight the section under the sticky header as the guest scrolls.
  useEffect(() => {
    if (view !== "menu" || !showRail) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = (headerRef.current?.offsetHeight ?? 0) + 24;
        let current = 0;
        sections.forEach((_, index) => {
          const section = document.getElementById(sectionId(index));
          if (section && section.getBoundingClientRect().top <= line) current = index;
        });
        setActiveSection(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [view, showRail, sections]);

  useEffect(() => {
    const rail = railRef.current;
    const chip = rail?.children[activeSection] as HTMLElement | undefined;
    if (rail && chip) rail.scrollTo({ left: chip.offsetLeft - 16, behavior: "smooth" });
  }, [activeSection]);

  const jumpToSection = (index: number) => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(sectionId(index))?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  };

  if (closedMessage) {
    return (
      <Shell>
        <CenteredMessage
          eyebrow={tableLabel}
          title={stallName}
          message={closedMessage}
          action={
            <Button asChild className="h-11 rounded-xl px-6 font-semibold">
              <Link href={courtHref}>See other stalls</Link>
            </Button>
          }
        />
      </Shell>
    );
  }

  if (view === "cart") {
    return (
      <Shell>
        <CartView
          restaurantId={restaurantId}
          subtitle={viewSubtitle}
          cartItems={cartItems}
          cartTotal={cartTotal}
          currency={currency}
          usesRazorpay={usesRazorpay}
          tableIdFromUrl={tableIdFromUrl}
          onBack={backToMenu}
          onPaid={handlePaid}
          onIncrement={(item) => item.cartQuantity < item.quantity && updateQuantity(item.id, 1)}
          onDecrement={(item) => updateQuantity(item.id, -1)}
        />
      </Shell>
    );
  }

  if (view === "orders") {
    return (
      <Shell>
        <OrdersView orders={activeOrders} currency={currency} subtitle={viewSubtitle} onBack={backToMenu} />
      </Shell>
    );
  }

  return (
    <Shell>
      <header
        ref={headerRef}
        className="sticky top-0 z-30 border-b border-border bg-background/90 pt-[env(safe-area-inset-top)] backdrop-blur-md"
      >
        <IdentityBar
          title={stallName}
          tableId={tableIdFromUrl}
          isLoading={isDetailsLoading}
          backHref={courtHref}
          backLabel="Back to all stalls"
        />

        <div className="px-4 pb-3">
          <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search dishes" label="Search the menu" />
        </div>

        {showRail && (
          <nav aria-label="Menu sections">
            <div ref={railRef} className="no-scrollbar relative flex gap-1.5 overflow-x-auto px-4 pb-2.5">
              {sections.map((section, index) => (
                <button
                  key={section.category}
                  type="button"
                  onClick={() => jumpToSection(index)}
                  aria-current={index === activeSection ? "true" : undefined}
                  className={cn(
                    "h-9 shrink-0 rounded-full px-3.5 text-body font-medium transition-colors duration-150",
                    index === activeSection ? "bg-accent text-accent-foreground" : "text-fg-secondary active:bg-accent",
                  )}
                >
                  {section.category}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className={cn("flex flex-col gap-6 px-4 pt-4", totalItems > 0 ? "pb-32" : "pb-10")}>
        {activeOrders.length > 0 && (
          <OrderStatusStrip orders={activeOrders} onOpen={() => openView("orders")} />
        )}

        {isMenusLoading || isDetailsLoading ? (
          <MenuSkeleton />
        ) : isMenusError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-body text-fg-secondary">We couldn&apos;t load the menu.</p>
            <Button variant="outline" onClick={() => refetchMenus()} className="h-11 rounded-xl px-6">
              Try again
            </Button>
          </div>
        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center gap-1 py-16 text-center">
            <p className="text-lead font-medium">
              {query ? `Nothing matches “${searchQuery.trim()}”` : "No dishes yet"}
            </p>
            <p className="text-caption text-fg-tertiary">
              {query ? "Try a different word." : "This stall hasn't added its menu."}
            </p>
          </div>
        ) : (
          sections.map((section, index) => (
            <section
              key={section.category}
              id={sectionId(index)}
              aria-labelledby={`${sectionId(index)}-title`}
              style={{ scrollMarginTop: headerHeight + 8 }}
              className="flex flex-col gap-2"
            >
              <h2 id={`${sectionId(index)}-title`} className="flex items-baseline gap-2 px-1 text-h3">
                {section.category}
                <span data-numeric className="text-caption font-normal text-fg-tertiary">
                  {section.items.length}
                </span>
              </h2>
              <ul className="surface-raise divide-y divide-border rounded-2xl">
                {section.items.map((menu) => (
                  <MenuItemRow
                    key={menu.id}
                    menu={menu}
                    currency={currency}
                    quantityInCart={itemsMap[menu.id]?.cartQuantity ?? 0}
                    onAdd={() => addToCart(menu)}
                    onDecrement={() => updateQuantity(menu.id, -1)}
                  />
                ))}
              </ul>
            </section>
          ))
        )}
      </main>

      {totalItems > 0 && (
        <TicketBar
          itemCount={totalItems}
          total={formatMoney(cartTotal, currency, { wholeUnits: true })}
          caption={tableLabel && `for ${tableLabel}`}
          onClick={() => openView("cart")}
        />
      )}
    </Shell>
  );
}

function MenuSkeleton() {
  return (
    <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading menu">
      <Skeleton className="mx-1 h-5 w-28" />
      <div className="surface-raise divide-y divide-border rounded-2xl">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex gap-3 p-3">
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="mt-4 h-4 w-16" />
            </div>
            <Skeleton className="size-22 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Restaurant;
