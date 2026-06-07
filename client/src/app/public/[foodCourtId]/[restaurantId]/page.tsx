"use client";

import { PiCookingPot } from "react-icons/pi";
import { Search, ShoppingCart, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useGetMenus } from "@/hooks/queries/useMenuQuery";
import { useCartStore } from "@/stores/useCartStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from "next/navigation";
import { CheckoutForm } from "@/components/public/CheckoutForm";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu } from "@/types";
import { Drawer, DrawerContent, DrawerTitle, DrawerHeader, DrawerTrigger } from "@/components/ui/drawer";
import Stepper, { Step } from "@/components/Stepper";
import { useGetOrders } from "@/hooks/queries/useOrderQuery";
import { useGetRestaurantDetails } from "@/hooks/queries/useCourtQuery";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

function Restaurant({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = React.use(params);

  const { data: menus = [], isLoading: isMenusLoading } = useGetMenus(restaurantId);
  const { data: restaurantDetails } = useGetRestaurantDetails(restaurantId);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const searchParams = useSearchParams();
  const tableIdFromUrl = searchParams.get("tableId");
  const parsedTableId = tableIdFromUrl && !isNaN(parseInt(tableIdFromUrl, 10)) 
    ? parseInt(tableIdFromUrl, 10) 
    : undefined;

  const {data, isLoading : isOrderLoading} = useGetOrders({
    restaurantId,
    tableNumber: parsedTableId
  });

  const orders = data?.orders || []; 
  console.log(orders)

  const activeOrder = orders.find(
    (order) => order.status === "PENDING" || order.status === "PREPARING" || order.status === "COMPLETED"
  ) || orders[0];

  const getStepFromStatus = (orderStatus?: string): number => {
    if (!orderStatus) return 1;
    const statusMap: Record<string, number> = {
      PENDING: 1,
      PREPARING: 2,
      READY: 3,
      COMPLETED: 4,
    };
    return statusMap[orderStatus.toUpperCase()] || 1;
  };

  const initialStep = getStepFromStatus(activeOrder?.status);

  const [filterMenu, setFilterMenu] = useState<Menu[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState(['Pending', 'Preparing', 'Ready', 'Completed'])

  useEffect(() => {
    if (!searchQuery) {
      setFilterMenu(menus);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = menus.filter(
        (menu) =>
          menu.itemName.toLowerCase().includes(query) ||
          (menu.description && menu.description.toLowerCase().includes(query))
      );
      setFilterMenu(filtered);
    }
  }, [menus, searchQuery]);
  
  const itemsMap = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const addItem = useCartStore((state) => state.addItem);

  const cartItems = React.useMemo(() => Object.values(itemsMap), [itemsMap]);
  const cartTotal = React.useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.cartQuantity,
        0,
      ),
    [cartItems],
  );
  const totalItems = React.useMemo(
    () => cartItems.reduce((total, item) => total + item.cartQuantity, 0),
    [cartItems],
  );

  const groupedMenus = React.useMemo(() => {
    return filterMenu.reduce(
      (acc, menu) => {
        if (!menu.category) return acc;
        const category = menu.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(menu);
        return acc;
      },
      {} as Record<string, typeof filterMenu>,
    );
  }, [filterMenu]);

  return (
    <>
      <div className="relative rounded-b-[2rem] px-2 py-4 h-34 bg-accent flex flex-col justify-between">
        <section className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold
           leading-none">{restaurantDetails?.name}</h1>
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <div className="flex min-w-18 justify-center gap-2 items-center bg-primary text-black px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                <ShoppingCart size={18} className="text-primary-foreground"/>
                <span className="text-sm text-primary-foreground font-bold text-center min-w-5">
                  {totalItems}
                </span>
              </div>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full w-full max-w-md">
              {/* 1. Header */}
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              {/* 2. Scrollable Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-4">
                {cartItems.length === 0 ? (
                  <p className="text-muted-foreground text-center mt-10">
                    Your cart is empty.
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-2 py-2 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{item.itemName}</p>
                        <p className="text-sm text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity Controls (Reusing your existing function) */}
                      <div className="flex items-center gap-3 bg-secondary rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)}>
                          -
                        </button>
                        <span className="w-4 text-center">
                          {item.cartQuantity}
                        </span>
                        <button onClick={() => updateQuantity(item.id, 1)}>
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* 3. Footer / Checkout */}
              {cartItems.length > 0 && (
                <div className="border-t pt-4 mt-auto px-2 py-2 flex flex-col gap-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      restaurantId={restaurantId}
                      cartItems={cartItems}
                      cartTotal={cartTotal}
                      onSuccess={() => setIsCartOpen(false)}
                      tableIdFromUrl={tableIdFromUrl}
                    />
                  </Elements>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </section>

        <section className="w-full flex items-center gap-2">
          <div className="flex w-full items-center gap-2 border border-border/40 px-3 py-3 rounded-xl bg-black/20">
            <Search size={18} className="text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-white placeholder:text-muted-foreground"
              placeholder="Search the menu.."
            />
          </div>
          <ThemeToggle />
        </section>
      </div>

      <section className="my-10 mx-2">
        {isMenusLoading ? (
          <div className="flex justify-center items-center py-20 w-full">
            <Spinner className="size-8 text-primary" />
          </div>
        ) : Object.keys(groupedMenus).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No items found matching your search.
          </div>
        ) : (
          Object.entries(groupedMenus).map(([category, items], index) => (
            <div key={category}>
              <Accordion type="single" defaultValue={category} collapsible>
                <AccordionItem value={category}>
                  <AccordionTrigger className="text-2xl font-extrabold ">
                    <h1>{category}</h1>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4">
                      {items.map((menu, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-stretch p-3 rounded-3xl bg-card border border-border/40 shadow-sm gap-4 transition-all hover:shadow-md"
                        >
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-semibold text-lg leading-tight tracking-tight">
                                {menu.itemName}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {menu.description}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                              <span className="font-bold text-lg">
                                ${menu.price}
                              </span>
                              <div className="flex items-center gap-2 bg-accent rounded-full p-1 border border-border/50">
                                {!itemsMap[menu.id] ? (
                                  <Button
                                    onClick={() => addItem(menu)}
                                    className="rounded-lg"
                                  >
                                    Add
                                  </Button>
                                ) : (
                                  <>
                                    <Button
                                      onClick={() =>
                                        updateQuantity(menu.id, -1)
                                      }
                                      variant="ghost"
                                      size="icon"
                                    >
                                      -
                                    </Button>
                                    <span className="w-4 text-center font-medium text-sm">
                                      {itemsMap[menu.id].cartQuantity}
                                    </span>
                                    <Button
                                      onClick={() => updateQuantity(menu.id, 1)}
                                      variant="ghost"
                                      size="icon"
                                    >
                                      +
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {menu.image && (
                            <div className="relative w-[110px] shrink-0">
                              <Image
                                fill
                                className="object-cover rounded-2xl"
                                alt={menu.itemName || "Menu item"}
                                src={menu.image}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Separator />
            </div>
          ))
        )}


      <footer className="fixed z-50 bottom-6 right-6">
        
      {!isOrderLoading && orders.length < 0 && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button className="h-12 w-12 rounded-2xl flex items-center justify-center p-0 transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary/95">
              <PiCookingPot size={26} />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="overflow-y-auto max-h-[85vh] w-full">
              <DrawerHeader>
                <DrawerTitle className="text-center text-3xl font-extrabold tracking-tight">
                  {activeOrder?.status 
                    ? activeOrder.status.charAt(0) + activeOrder.status.slice(1).toLowerCase() 
                    : "It's Cooking"}
                </DrawerTitle>
              </DrawerHeader>
              <Stepper 
                key={activeOrder?.id ? `${activeOrder.id}-${initialStep}` : "no-order"}
                initialStep={initialStep}
                disableStepIndicators={true}
                hideFooter={true}
                onStepChange={(step) => {
                  console.log(step)
                }}
                onFinalStepCompleted={() => console.log('All steps completed!')}
              >
                {status.map((stepName) => (
                  <Step key={stepName}>
                    <p className="text-center hidden rounded-xl max-w-sm w-full border border-emerald-500/20 bg-emerald-500/10 text-md font-semibold py-1.5 px-3">
                      {stepName}
                    </p>
                  </Step>
                ))}
              </Stepper>

              <div className="min-h-37.5 max-h-[45vh] overflow-y-auto pr-1">
                              
              {activeOrder ? (
                
                orders.filter((statuses) => statuses?.status !== 'CANCELLED' && 'COMPLETED').map((order) => (
                  <div className="mx-auto w-full max-w-md px-6 pb-8 space-y-5">
                  <p className="text-sm text-muted-foreground">For {order.customerName}</p>
    
                  <div className="space-y-3">

                    <div className="bg-card border border-border/20 rounded-xl p-4 divide-y divide-border/20">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2.5 first:pt-0 last:pb-0">
                          <div>
                            <p className="font-medium text-sm">{item.menu?.itemName || `Item #${item.menuID}`}</p>
                            <p className="text-xs text-muted-foreground">${item.price} each</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">x{item.quantity}</p>
                            <p className="text-xs font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No active orders found.
                </div>
              )}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
      </footer>

      </section>
    </>
  );
}

export default Restaurant;
