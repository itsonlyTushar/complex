import { createHash } from "node:crypto";
import { prisma } from "../config/db.js";
import type { CartLine } from "../types/payment.types.js";

export type { CartLine } from "../types/payment.types.js";

export interface PricedCart {
    items: (CartLine & { price: number })[];
    totalAmount: number;
}

export const parseCartLines = (value: unknown): CartLine[] => {
    if (!Array.isArray(value) || value.length === 0 || value.length > 50) {
        throw new Error("Your cart must contain between 1 and 50 items.");
    }

    const quantities = new Map<number, number>();
    for (const valueItem of value) {
        if (!valueItem || typeof valueItem !== "object") {
            throw new Error("Your cart contains an invalid item.");
        }

        const { menuID, quantity } = valueItem as Record<string, unknown>;
        if (!Number.isSafeInteger(menuID) || !Number.isSafeInteger(quantity) || (quantity as number) <= 0) {
            throw new Error("Your cart contains an invalid item or quantity.");
        }

        const id = menuID as number;
        const totalQuantity = (quantities.get(id) ?? 0) + (quantity as number);
        if (totalQuantity > 99) {
            throw new Error("The quantity for an item cannot exceed 99.");
        }
        quantities.set(id, totalQuantity);
    }

    return [...quantities].map(([menuID, quantity]) => ({ menuID, quantity }));
};

export const priceCart = async (restaurantId: string, lines: CartLine[]): Promise<PricedCart> => {
    const menus = await prisma.menu.findMany({
        where: { id: { in: lines.map((line) => line.menuID) }, restaurantId },
        select: { id: true, price: true, quantity: true },
    });
    const menuById = new Map(menus.map((menu) => [menu.id, menu]));

    const items = lines.map((line) => {
        const menu = menuById.get(line.menuID);
        if (!menu || !Number.isSafeInteger(menu.price) || menu.price < 0 || menu.quantity < line.quantity) {
            throw new Error("Your cart has an unavailable or out-of-stock item.");
        }
        return { ...line, price: menu.price };
    });

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    if (!Number.isSafeInteger(totalAmount) || totalAmount <= 0) {
        throw new Error("Your cart total is invalid.");
    }

    return { items, totalAmount };
};

export const fingerprintCart = (items: CartLine[]): string => {
    const canonicalItems = [...items]
        .sort((left, right) => left.menuID - right.menuID)
        .map(({ menuID, quantity }) => [menuID, quantity]);
    return createHash("sha256").update(JSON.stringify(canonicalItems)).digest("hex");
};
