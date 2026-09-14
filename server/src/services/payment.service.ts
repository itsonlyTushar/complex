import Stripe from "stripe";
import { prisma } from "../config/db.js";
import type { Payments } from "../types/payment.types.js";

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

export const createPaymentIntent = async (data: Payments, restaurantId: string) => {
    const { amount, currency, commissionAmount, application_fee_amount, orderId } = data;

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (!restaurant.stripeAccountId) {
        throw new Error("Restaurant does not have a Stripe account onboarded");
    }

    const commissionRate = restaurant.commissionRate ?? 5.0;
    const computedFee = Math.round(amount * (commissionRate / 100));

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency,
        application_fee_amount: computedFee,
        transfer_data: {
            destination: restaurant.stripeAccountId,
        },
        metadata: {
            restaurantId: restaurantId.toString(),
            orderId: orderId ? orderId.toString() : "",
            commissionAmount: computedFee.toString(),
        }
    });

    return paymentIntent;
};

export const updatePaymentIntentMetadata = async (paymentIntentId: string, orderId: number) => {
    try {
        await stripe.paymentIntents.update(paymentIntentId, {
            metadata: {
                orderId: orderId.toString(),
            },
        });
    } catch (error) {
        console.error("Failed to update Stripe payment intent metadata:", error);
    }
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

    const order = await prisma.order.findUnique({
        where: {
            id: orderId
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
        include: {
            foodCourt: {
                select: {
                    name: true,
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