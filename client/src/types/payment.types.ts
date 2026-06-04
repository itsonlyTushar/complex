export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
    orderId: string;
};

export interface PaymentIntentPayload {
    amount: number;
    currency: string;
    commissionAmount: string;
    application_fee_amount: number;
    restaurantId: string;
}

export interface PaymentIntentResponse {
    message: string;
    paymentIntent: {
        id: string;
        client_secret: string;
        amount: number;
        currency: string;
    };
}

export interface CheckoutFormProps {
  restaurantId: string;
  cartItems: any[];
  cartTotal: number;
  onSuccess: () => void;
  tableIdFromUrl: string | null;
}
