import Stripe from "stripe";
import { prisma } from "../config/db.js";
import type { CartLine } from "../types/payment.types.js";
import { fingerprintCart, priceCart } from "./pricing.service.js";
import { assertRestaurantAcceptingOrders } from "./court.service.js";

const stripeKey = process.env.STRIPE_SECRET || process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
    console.warn("[WARNING] STRIPE_SECRET or STRIPE_SECRET_KEY is not defined in environment variables. Stripe integration will be disabled.");
}

const stripe = new Proxy({} as Stripe, {
    get(target, prop) {
        if (!stripeKey) {
            throw new Error("Stripe Client is not initialized. Please configure STRIPE_SECRET in your environment variables.");
        }
        const stripeInstance = new Stripe(stripeKey, {
            apiVersion: '2026-05-27.dahlia'
        });
        return Reflect.get(stripeInstance, prop);
    }
});

export const onboardRestaurantStripe = async (restaurantId: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: {id: restaurantId}
    })
    if(!restaurant) {
        throw new Error("Restaurant not found")
    }

    let stripeAccountId = restaurant.stripeAccountId

    if(!stripeAccountId) {
        const account = await stripe.accounts.create({
            type: "express",
            capabilities: {
                card_payments: {
                    requested: true
                },
                transfers: {requested: true}
            }
        })

        stripeAccountId = account.id

        await prisma.restaurant.update({
            where: {id: restaurantId},
            data: {stripeAccountId}
        })
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${clientUrl}/admin/settings/payment?status=refresh&restaurantId=${restaurantId}`,
        return_url: `${clientUrl}/admin/settings/payment?status=success&restaurantId=${restaurantId}`,
        type: 'account_onboarding'
    })
    
    return {
        stripeAccountId,
        onboardingUrl: accountLink.url
    }
}

export const verifyRestaurantOnboarding = async (restaurantId: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    })

    if (!restaurant) {
        throw new Error("Restaurant not found")
    }

    if (!restaurant.stripeAccountId) {
        return { completed: false }
    }

    const account = await stripe.accounts.retrieve(restaurant.stripeAccountId)
    const completed = account.details_submitted

    if (completed !== restaurant.onBoradingCompleted) {
        await prisma.restaurant.update({
            where: { id: restaurantId },
            data: { onBoradingCompleted: completed }
        })
    }

    return { completed }
}

export const createPaymentIntent = async (restaurantId: string, lines: CartLine[]) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: {
            id: true,
            stripeAccountId: true,
            commissionRate: true,
            foodCourt: { select: { currancy: true, paymentSystem: true } },
        },
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (!restaurant.stripeAccountId) {
        throw new Error("Restaurant does not have a Stripe account onboarded");
    }

    if (restaurant.foodCourt.paymentSystem.toLowerCase() !== "stripe") {
        throw new Error("Stripe is not enabled for this food court.");
    }

    await assertRestaurantAcceptingOrders(restaurantId);

    const { items, totalAmount } = await priceCart(restaurantId, lines);
    const currency = restaurant.foodCourt.currancy.toLowerCase();
    if (!/^[a-z]{3}$/.test(currency)) {
        throw new Error("The food court has an invalid payment currency.");
    }

    const commissionRate = restaurant.commissionRate ?? 5.0;
    if (!Number.isFinite(commissionRate) || commissionRate < 0 || commissionRate > 100) {
        throw new Error("The restaurant commission rate is invalid.");
    }
    const amountInMinorUnits = totalAmount * 100;
    if (!Number.isSafeInteger(amountInMinorUnits)) {
        throw new Error("The cart total is too large to process.");
    }
    const computedFee = Math.round(amountInMinorUnits * (commissionRate / 100));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInMinorUnits,
        currency,
        application_fee_amount: computedFee,
        transfer_data: {
            destination: restaurant.stripeAccountId,
        },
        metadata: {
            restaurantId: restaurantId.toString(),
            cartHash: fingerprintCart(items),
            commissionAmount: computedFee.toString(),
        }
    });

    return paymentIntent;
};

export const verifyPaymentIntentForOrder = async (
    paymentIntentId: string,
    restaurantId: string,
    lines: CartLine[],
) => {
    const { items, totalAmount } = await priceCart(restaurantId, lines);
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: {
            stripeAccountId: true,
            foodCourt: { select: { currancy: true } },
        },
    });
    if (!restaurant?.stripeAccountId) {
        throw new Error("Restaurant payment configuration was not found.");
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const destination = paymentIntent.transfer_data?.destination;
    const destinationId = typeof destination === "string" ? destination : destination?.id;
    const expectedCurrency = restaurant.foodCourt.currancy.toLowerCase();
    if (
        paymentIntent.status !== "succeeded"
        || paymentIntent.metadata.restaurantId !== restaurantId
        || paymentIntent.metadata.cartHash !== fingerprintCart(items)
        || paymentIntent.amount !== totalAmount * 100
        || paymentIntent.currency.toLowerCase() !== expectedCurrency
        || destinationId !== restaurant.stripeAccountId
    ) {
        throw new Error("Payment does not match this restaurant and cart.");
    }

    return { items, totalAmount };
};

export const refundUnfulfilledPaymentIntent = async (paymentIntentId: string, restaurantId: string) => {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.metadata.restaurantId !== restaurantId || paymentIntent.status !== "succeeded") {
        return;
    }

    await stripe.refunds.create({
        payment_intent: paymentIntentId,
        reverse_transfer: true,
        refund_application_fee: true,
    }, {
        idempotencyKey: `unfulfilled-order-${paymentIntentId}`.slice(0, 255),
    });
};

export const updatePaymentIntentMetadata = async (paymentIntentId: string, orderId: number) => {
    await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
            orderId: orderId.toString(),
        },
    });
};


export const refundPayment = async (restaurantId: string, orderId: number) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (!restaurant.stripeAccountId) {
        throw new Error("Restaurant does not have a Stripe account onboarded");
    }

    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            restaurantId,
        }
    });

    if (!order) {
        throw new Error("Order not found");
    }

    const paymentIntent = order.paymentIntentId;

    if (!paymentIntent) {
        throw new Error("Payment id is required");
    }

    const refund = await stripe.refunds.create({
        payment_intent: paymentIntent,
        reverse_transfer: true,
        refund_application_fee: true,
    }, {
        idempotencyKey: `order-refund-${orderId}`,
    });

    return refund;
};


export const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if(!webhookSecret) {
        throw new Error("STRIPE_WEBHOK_SECRET is not configured")
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)

    if(event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        const orderId = paymentIntent.metadata.orderId

        if(orderId) {
            await prisma.order.update({
                where: {id: parseInt(orderId)},
                data: {
                    status: "PREPARING",
                    paymentIntentId: paymentIntent.id
                },
            })
        }
    }
    return event
}

export const getRestaurantsCommission = async () => {
    return await prisma.restaurant.findMany({
        select: {
            id: true,
            name: true,
            stripeAccountId: true,
            onBoradingCompleted: true,
            razorpayKeyId: true,
            commissionRate: true,
            foodCourt: {
                select: {
                    name: true,
                    paymentSystem: true,
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
};

export const updateRestaurantCommission = async (id: string, commissionRate: number) => {
    return await prisma.restaurant.update({
        where: { id },
        data: { commissionRate },
    });
};