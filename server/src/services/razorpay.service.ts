import crypto from "crypto";
import { prisma } from "../config/db.js";
import { decryptSecret, encryptSecret } from "../utils/crypto.js";
import { assertRestaurantAcceptingOrders } from "./court.service.js";
import { createOrderRecord } from "./order.service.js";
import type { CartLine, RazorpayCheckoutPayload, RazorpayVerifyPayload } from "../types/payment.types.js";
import { fingerprintCart, parseCartLines, priceCart } from "./pricing.service.js";

const RAZORPAY_API = "https://api.razorpay.com/v1";

type RazorpayCredentials = { keyId: string; keySecret: string };

type RazorpayPayment = {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
    status: "created" | "authorized" | "captured" | "refunded" | "failed";
};

type RazorpayOrder = {
    id: string;
    amount: number;
    currency: string;
    notes: Record<string, string>;
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

    const { items, totalAmount } = await priceCart(restaurantId, lines);
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
            cartHash: fingerprintCart(items),
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

export const verifyRazorpayPayment = async (
    data: Omit<RazorpayVerifyPayload, "items" | "customerName" | "tableNumber">
        & { items: unknown; customerName: unknown; tableNumber: unknown },
) => {
    const {
        restaurantId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        items: rawLines,
        customerName: rawCustomerName,
        tableNumber: rawTableNumber,
    } = data;

    const alreadyRecorded = await prisma.order.findUnique({ where: { razorpayPaymentId }, include: { items: true } });
    if (alreadyRecorded) {
        if (alreadyRecorded.restaurantId !== restaurantId) {
            throw new Error("Payment is already associated with another restaurant.");
        }
        return alreadyRecorded;
    }

    const { restaurant, credentials } = await getRestaurantRazorpay(restaurantId);

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
    if (payment.order_id !== razorpayOrderId) {
        throw new Error("The payment does not match the checkout order.");
    }

    let paymentVerified = false;
    try {
        if (typeof rawCustomerName !== "string" || !rawCustomerName.trim()) {
            throw new Error("Customer name is required.");
        }
        if (typeof rawTableNumber !== "number" || !Number.isSafeInteger(rawTableNumber) || rawTableNumber <= 0) {
            throw new Error("A valid table number is required.");
        }
        const lines = parseCartLines(rawLines);
        const { items, totalAmount } = await priceCart(restaurantId, lines);
        const order = await razorpayRequest<RazorpayOrder>(credentials, `/orders/${razorpayOrderId}`);
        if (
            order.id !== razorpayOrderId
            || order.notes.restaurantId !== restaurantId
            || order.notes.cartHash !== fingerprintCart(items)
            || order.amount !== totalAmount * 100
            || order.currency.toLowerCase() !== restaurant.foodCourt.currancy.toLowerCase()
            || order.notes.tableNumber !== String(rawTableNumber)
            || order.notes.customerName !== rawCustomerName.trim().slice(0, 100)
            || payment.amount !== order.amount
            || payment.currency.toLowerCase() !== order.currency.toLowerCase()
        ) {
            throw new Error("The payment order does not match this restaurant and cart.");
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

        paymentVerified = true;
        return await createOrderRecord({
            restaurantId,
            totalAmount,
            items,
            tableNumber: rawTableNumber,
            customerName: rawCustomerName.trim(),
            razorpayOrderId,
            razorpayPaymentId,
        });
    } catch (error) {
        const concurrentOrder = await prisma.order.findUnique({
            where: { razorpayPaymentId },
            include: { items: true },
        });
        if (concurrentOrder?.restaurantId === restaurantId) {
            return concurrentOrder;
        }
        if (paymentVerified) {
            await razorpayRequest(credentials, `/payments/${razorpayPaymentId}/refund`, {});
        }
        throw error;
    }
};

export const refundRazorpayPayment = async (restaurantId: string, razorpayPaymentId: string) => {
    const { credentials } = await getRestaurantRazorpay(restaurantId);
    const payment = await razorpayRequest<RazorpayPayment>(credentials, `/payments/${razorpayPaymentId}`);
    if (payment.status === "refunded") {
        return payment;
    }
    if (payment.status !== "captured") {
        throw new Error("Only captured Razorpay payments can be refunded.");
    }
    return await razorpayRequest(credentials, `/payments/${razorpayPaymentId}/refund`, {});
};
