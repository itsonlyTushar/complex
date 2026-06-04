import { Menu } from './menu.types';

export interface OrderItem {
    id: number;
    menuID: number;
    quantity: number;
    price: number;
    menu?: Menu;
}

export interface Order {
    id: number;
    userId?: number;
    restaurantId: number;
    totalAmount: number;
    status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';
    createdAt: Date;
    tableName: number;
    tableId: number;
    paymentIntentId?: string;
    customerName: string;
    items: OrderItem[];
}

export type CreateOrderPayload = Omit<Order, "id" | "status" | "createdAt" | "items"> & {
    items: Omit<OrderItem, "id">[];
};
