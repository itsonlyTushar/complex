
export interface Payments {
    amount: number
    currency : string
    application_fee_amount: number
    orderId?: string
    commissionAmount?: string
}

export interface CartLine {
    menuID: number
    quantity: number
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