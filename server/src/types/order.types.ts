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
    restaurantId: number
    totalAmount: number
    status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED'
    createdAt: Date
    tableName: number
    tableId: number
    paymentIntentId?: string
    customerName: string
    items: OrderItem[] 
}

