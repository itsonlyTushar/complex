import crypto from "crypto";
import { prisma } from "../config/db.js";
import { decryptSecret, encryptSecret } from "../utils/crypto.js";
import { assertRestaurantAcceptingOrders } from "./court.service.js";
import { createOrderRecord } from "./order.service.js";
import type { CartLine, RazorpayCheckoutPayload, RazorpayVerifyPayload } from "../types/payment.types.js";

const RAZORPAY_API = "https://api.razorpay.com/v1";

type RazorpayCredentials = { keyId: string; keySecret: string };

type RazorpayPayment = {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: "created" | "authorized" | "captured" | "refunded" | "failed";
};

const razorpayRequest = async <T>(credentials: RazorpayCredentials, path: string, body?: object): Promise<T> => {
    const auth = Buffer.from(`${credentials.keyId}:${credentials.keySecret}`).toString("base64");
    const response = await fetch(`${RAZORPAY_API}${path}`, {
        method: body ? "POST" : "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${auth}`,
        },
        body: body ? JSON.stringify(body) : null,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data?.error?.description || "Razorpay request failed");
    }
    return data as T;
};

const getRestaurantRazorpay = async (restaurantId: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: {
            name: true,
            razorpayKeyId: true,
            razorpaySecret: true,
            foodCourt: { select: { paymentSystem: true, currancy: true } },
        },
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (!restaurant.razorpayKeyId || !restaurant.razorpaySecret) {
        throw new Error("This restaurant hasn't set up online payments yet.");
    }

    const credentials = { keyId: restaurant.razorpayKeyId, keySecret: decryptSecret(restaurant.razorpaySecret) };
    return { restaurant, credentials };
};

// Prices come from the menu, never from the client, so the amount charged can't be tampered with.
const priceCart = async (restaurantId: string, lines: CartLine[]) => {
    const menus = await prisma.menu.findMany({
        where: { id: { in: lines.map((line) => line.menuID) }, restaurantId },
        select: { id: true, price: true },
    });
    const priceById = new Map(menus.map((menu) => [menu.id, menu.price]));

    const items = lines.map((line) => {
        const price = priceById.get(line.menuID);
        if (price === undefined || !Number.isInteger(line.quantity) || line.quantity <= 0) {
            throw new Error("Your cart has an item that is no longer available.");
        }
        return { menuID: line.menuID, quantity: line.quantity, price };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, totalAmount };
};

export const connectRazorpay = async (restaurantId: string, keyId: string, keySecret: string) => {
    // Try the keys against Razorpay first so a typo fails here, not at a customer's checkout.
    await razorpayRequest({ keyId, keySecret }, "/orders?count=1");

    return await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { razorpayKeyId: keyId, razorpaySecret: encryptSecret(keySecret) },
        select: { id: true, razorpayKeyId: true },
    });
};

export const disconnectRazorpay = async (restaurantId: string) => {
    return await prisma.restaurant.update({
        where: { id: restaurantId },
        data: { razorpayKeyId: null, razorpaySecret: null },
        select: { id: true, razorpayKeyId: true },
    });
};

export const createRazorpayCheckout = async (data: RazorpayCheckoutPayload) => {
    const { restaurantId, items: lines, customerName, tableNumber } = data;

    await assertRestaurantAcceptingOrders(restaurantId);
    const { restaurant, credentials } = await getRestaurantRazorpay(restaurantId);

    if (restaurant.foodCourt.paymentSystem !== "razorpay") {
        throw new Error("Razorpay is not enabled for this food court.");
    }

    const { totalAmount } = await priceCart(restaurantId, lines);
    if (totalAmount <= 0) {
        throw new Error("Your cart is empty.");
    }

    const order = await razorpayRequest<{ id: string; amount: number; currency: string }>(credentials, "/orders", {
        amount: totalAmount * 100,
        currency: restaurant.foodCourt.currancy,
        notes: {
            restaurantId,
            tableNumber: String(tableNumber),
            customerName: customerName.slice(0, 100),
        },
    });

    return {
        keyId: credentials.keyId,
        razorpayOrderId: order.id,
        amount: order.amount,
        currency: order.currency,
        restaurantName: restaurant.name,
    };
};

export const verifyRazorpayPayment = async (data: RazorpayVerifyPayload) => {
    const { restaurantId, razorpayOrderId, razorpayPaymentId, razorpaySignature, items: lines, customerName, tableNumber } = data;

    const alreadyRecorded = await prisma.order.findUnique({ where: { razorpayPaymentId }, include: { items: true } });
    if (alreadyRecorded) {
        return alreadyRecorded;
    }

    const { credentials } = await getRestaurantRazorpay(restaurantId);

    const expectedSignature = crypto
        .createHmac("sha256", credentials.keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");
    const signatureValid = expectedSignature.length === razorpaySignature.length
        && crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpaySignature));
    if (!signatureValid) {
        throw new Error("Payment could not be verified.");
    }

    let payment = await razorpayRequest<RazorpayPayment>(credentials, `/payments/${razorpayPaymentId}`);
    const { items, totalAmount } = await priceCart(restaurantId, lines);

    if (payment.amount !== totalAmount * 100) {
        // Prices changed mid-checkout or the cart was altered after paying: return the money rather
        // than record an order that doesn't match it. An uncaptured payment is released by Razorpay on its own.
        if (payment.status === "captured") {
            await razorpayRequest(credentials, `/payments/${razorpayPaymentId}/refund`, {});
        }
        throw new Error("Your cart changed during payment, so the payment has been returned. Please try again.");
    }

    if (payment.status === "authorized") {
        payment = await razorpayRequest<RazorpayPayment>(credentials, `/payments/${razorpayPaymentId}/capture`, {
            amount: payment.amount,
            currency: payment.currency,
        });
    }

    if (payment.status !== "captured") {
        throw new Error("Payment was not completed.");
    }

    // No open/closed check here: the customer has already paid, and ordering was open when checkout started.
    return await createOrderRecord({
        restaurantId,
        totalAmount,
        items,
        tableNumber,
        customerName,
        razorpayOrderId,
        razorpayPaymentId,
    });
};

export const refundRazorpayPayment = async (restaurantId: string, razorpayPaymentId: string) => {
    const { credentials } = await getRestaurantRazorpay(restaurantId);
    return await razorpayRequest(credentials, `/payments/${razorpayPaymentId}/refund`, {});
};
