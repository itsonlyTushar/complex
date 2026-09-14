import { PaymentIntentPayload, PaymentIntentResponse } from "@/types/payment.types";
import { getAuth } from "@/app/actions/auth";
import { API_URL } from "@/lib/api";

export const createPaymentIntent = async (data: PaymentIntentPayload): Promise<PaymentIntentResponse> => {
    const response = await fetch(`${API_URL}/api/payments/create-payment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create payment intent");
    }

    return response.json();
};

export const onboardRestaurant = async (): Promise<{ stripeAccountId: string; onboardingUrl: string }> => {
    let token = await getAuth();
    const response = await fetch(`${API_URL}/api/payments/onboard-restaurant`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to onboard Stripe");
    }

    return response.json();
};

export const verifyOnboarding = async (): Promise<{ completed: boolean }> => {
    let token = await getAuth();
    const response = await fetch(`${API_URL}/api/payments/verify-onboarding`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to verify onboarding");
    }

    return response.json();
};
