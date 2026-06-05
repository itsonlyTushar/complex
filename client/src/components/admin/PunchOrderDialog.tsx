"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetMenus } from "@/hooks/queries/useMenuQuery";
import { useGetMe } from "@/hooks/queries/useUserQuery";
import { useAddOrder } from "@/hooks/mutations/useOrderMutation";
import { toast } from "@/lib/toast";
import { Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import type { Menu } from "@/types/menu.types";

interface CartItem {
  menuId: number;
  itemName: string;
  price: number;
  quantity: number;
}

export function PunchOrderDialog() {
  const [open, setOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: user } = useGetMe();
  const restaurantId = user?.restaurant?.id || user?.restaurantId || "";

  const { data: menus = [], isLoading: isMenuLoading } = useGetMenus();
  const { mutate: addOrder, isPending: isSubmitting } = useAddOrder();

  const filteredMenus = useMemo(() => {
    if (!searchQuery.trim()) return menus;
    return menus.filter((m: Menu) =>
      m.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [menus, searchQuery]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const addToCart = (menu: Menu) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menuId === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menuId === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { menuId: menu.id, itemName: menu.itemName, price: menu.price, quantity: 1 },
      ];
    });
  };

  const updateQuantity = (menuId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.menuId === menuId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (menuId: number) => {
    setCart((prev) => prev.filter((item) => item.menuId !== menuId));
  };

  const resetForm = () => {
    setCustomerName("");
    setTableNumber("");
    setCart([]);
    setSearchQuery("");
  };

  const handleSubmit = () => {
    if (!customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    }
    const parsedTable = parseInt(tableNumber, 10);
    if (isNaN(parsedTable) || parsedTable <= 0) {
      toast.error("Please enter a valid table number.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Please add at least one item to the order.");
      return;
    }
    if (!restaurantId) {
      toast.error("Restaurant not found. Please try again.");
      return;
    }

    addOrder(
      {
        restaurantId,
        totalAmount: Math.round(cartTotal),
        tableNumber: parsedTable,
        customerName: customerName.trim(),
        items: cart.map((item) => ({
          menuID: item.menuId,
          quantity: item.quantity,
          price: Math.round(item.price),
        })),
      },
      {
        onSuccess: () => {
          toast.success("Order punched successfully!");
          resetForm();
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error.message || "Failed to punch order.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="gap-2 rounded-xl font-semibold shadow-sm">
          <Plus className="size-4" />
          Punch Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Punch New Order</DialogTitle>
          <DialogDescription>
            Manually create an order for a walk-in or cash customer.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="punch-customer-name" className="text-sm font-semibold">
                Customer Name
              </Label>
              <Input
                id="punch-customer-name"
                placeholder="e.g. John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={isSubmitting}
                className="rounded-xl"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="punch-table-number" className="text-sm font-semibold">
                Table Number
              </Label>
              <Input
                id="punch-table-number"
                type="number"
                min="1"
                placeholder="e.g. 5"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                disabled={isSubmitting}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Menu Search */}
          <div>
            <Label className="text-sm font-semibold mb-1.5 block">Add Items</Label>
            <Input
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl mb-3"
            />
            <div className="max-h-[200px] overflow-y-auto border rounded-xl divide-y">
              {isMenuLoading ? (
                <p className="text-sm text-muted-foreground p-4 text-center animate-pulse">
                  Loading menu...
                </p>
              ) : filteredMenus.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  No menu items found.
                </p>
              ) : (
                filteredMenus.map((menu: Menu) => {
                  const inCart = cart.find((c) => c.menuId === menu.id);
                  return (
                    <div
                      key={menu.id}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{menu.itemName}</p>
                        <p className="text-xs text-muted-foreground">
                          ${menu.price.toFixed(2)}
                          {menu.quantity <= 0 && (
                            <span className="ml-2 text-destructive font-semibold">Out of stock</span>
                          )}
                        </p>
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => updateQuantity(menu.id, -1)}
                            disabled={isSubmitting}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="text-sm font-bold w-6 text-center">
                            {inCart.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 rounded-lg"
                            onClick={() => updateQuantity(menu.id, 1)}
                            disabled={isSubmitting}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 rounded-lg text-xs"
                          onClick={() => addToCart(menu)}
                          disabled={isSubmitting || menu.quantity <= 0}
                        >
                          <Plus className="size-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="border rounded-xl p-4 bg-muted/20">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="size-4 text-primary" />
                <span className="text-sm font-bold">
                  Order Summary ({cart.length} item{cart.length > 1 ? "s" : ""})
                </span>
              </div>
              <div className="space-y-2">
                {cart.map((item) => (
                  <div
                    key={item.menuId}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="truncate">{item.itemName}</span>
                      <span className="text-muted-foreground text-xs">x{item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.menuId)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/40">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => { resetForm(); setOpen(false); }}
            disabled={isSubmitting}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || cart.length === 0}
            className="rounded-xl gap-2 font-semibold"
          >
            {isSubmitting ? "Placing..." : `Place Order — $${cartTotal.toFixed(2)}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
