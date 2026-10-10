import type { Menu } from "./menu.types.js"

export interface OrderItem {
    id: number
    menuID: number
    quantity: number
    price: number
    menu?: Menu
}

export interface Order {
    id:number
    userId?: number
    restaurantId: string
    totalAmount: number
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'
    createdAt: Date
    tableNumber: number
    paymentIntentId?: string
    customerName: string
    items: OrderItem[] 
}

export interface CreateOrderPayload {
    restaurantId: string;
    items: unknown;
    tableNumber: unknown;
    customerName: unknown;
    paymentIntentId: string;
}
