
export interface CartLine {
    menuID: number;
    quantity: number;
}

export interface CreatePaymentIntentPayload {
    restaurantId: string;
    items: CartLine[];
}

export interface RazorpayCheckoutPayload {
    restaurantId: string
    items: CartLine[]
    customerName: string
    tableNumber: number
}

export interface RazorpayVerifyPayload extends RazorpayCheckoutPayload {
    razorpayOrderId: string
    razorpayPaymentId: string
    razorpaySignature: string
}