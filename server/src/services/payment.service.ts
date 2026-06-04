import Stripe from "stripe";
import { prisma } from "../config/db.js";
import type { Payments } from "../types/payment.types.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2022-11-15' as any
})

export const onboardRestaurantStripe = async (restaurantId: number) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: {id: restaurantId}
    })
    if(!restaurant) {
        throw new Error("Restaurant not found")
    }

    let stripeAccountId = restaurant.stripeAccountId

    if(!stripeAccountId) {
        const account = stripe.accounts.create({
            type: "express",
            capabilities: {
                card_payments: {
                    requested: true
                },
                transfers: {requested: true}
            }
        })

        stripeAccountId = (await account).id

        await prisma.restaurant.update({
            where: {id: restaurantId},
            data: {stripeAccountId}
        })

        // TODO: UPDATE THE refresh and return url LATER 
        const accountLink = await stripe.accountLinks.create({
            account: stripeAccountId,
            refresh_url: `${process.env.CLIENT_URL}/sp/onboarding/refresh?restaurantId=${restaurantId}`,
            return_url: `${process.env.CLIENT_URL}/sp/onboarding/success?restaurantId=${restaurantId}`,
            type: 'account_onboarding'
        })
        
        return {
            stripeAccountId,
            onboardingUrl: accountLink.url
        }
    }
}

export const createPaymentIntent = async (data: Payments, restaurantId: number) => {
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

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount),
        currency,
        application_fee_amount,
        transfer_data: {
            destination: restaurant.stripeAccountId,
        },
        metadata: {
            restaurantId: restaurantId.toString(),
            orderId: orderId ? orderId.toString() : "",
            commissionAmount: commissionAmount ? commissionAmount.toString() : "",
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


export const refundPayment = async (restaurantId: number, orderId: number) => {
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