"use client";

import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import React, { useState } from "react";
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

function Restaurant({ params }: { params: Promise<{ restaurantId: string }> }) {
  const { restaurantId } = React.use(params);

  const { data: menus = [], isLoading: isMenusLoading } = useGetMenus();

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
    return menus.reduce(
      (acc, menu) => {
        if (!menu.category) return acc;
        const category = menu.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(menu);
        return acc;
      },
      {} as Record<string, typeof menus>,
    );
  }, [menus]);

  return (
    <>
      <div className="rounded-b-[2rem] px-2 py-4 h-34 rounded-b bg-accent flex flex-col justify-between">
        <section className=" flex justify-between items-center">
          <h1 className="text-4xl font-semibold">{restaurantId}</h1>
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex min-w-[4.5rem] justify-center gap-2 items-center bg-primary text-black px-3 py-1.5 rounded-lg cursor-pointer transition-all">
                <ShoppingCart size={18} />
                <span className="text-sm font-extrabold text-center min-w-[1.25rem]">
                  {totalItems}
                </span>
              </div>
            </SheetTrigger>
            <SheetContent className="flex flex-col h-full">
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
                <div className="border-t pt-4 mt-auto px-2 py-2">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full">Proceed to Checkout</Button>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </section>

        <section className="w-full">
          <div className="flex w-full items-center gap-2 border border-border/40 px-3 py-3 rounded-xl bg-black/20">
            <Search size={18} className="text-muted-foreground" />
            <input
              className="flex-1 border-none bg-transparent shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-white placeholder:text-muted-foreground"
              placeholder="Search the menu.."
            />
          </div>
        </section>
      </div>

      <section className="my-10 mx-2">
        {isMenusLoading ? (
          <div>
            <span>Loading Menu</span>
          </div>
        ) : (
          Object.entries(groupedMenus).map(([category, items], index) => (
            <div key={category}>
              <Accordion type="single" defaultValue={category} collapsible>
                <AccordionItem value={category}>
                  <AccordionTrigger className="text-xl font-extrabold uppercase">
                    {category}
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
      </section>
    </>
  );
}

export default Restaurant;
