import {
    PaymentIntentPayload,
    PaymentIntentResponse,
    RazorpayCheckoutPayload,
    RazorpayCheckoutResponse,
    RazorpayVerifyPayload,
} from "@/types/payment.types";
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

export const connectRazorpay = async (data: { keyId: string; keySecret: string }) => {
    const token = await getAuth();
    const response = await fetch(`${API_URL}/api/payments/razorpay/connect`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to connect Razorpay");
    }

    return response.json();
};

export const disconnectRazorpay = async () => {
    const token = await getAuth();
    const response = await fetch(`${API_URL}/api/payments/razorpay/connect`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to disconnect Razorpay");
    }

    return response.json();
};

export const createRazorpayOrder = async (data: RazorpayCheckoutPayload): Promise<RazorpayCheckoutResponse> => {
    const response = await fetch(`${API_URL}/api/payments/razorpay/order`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to start Razorpay checkout");
    }

    return response.json();
};

export const verifyRazorpayPayment = async (data: RazorpayVerifyPayload) => {
    const response = await fetch(`${API_URL}/api/payments/razorpay/verify`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to verify payment");
    }

    return response.json();
};
