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
    restaurantId: string;
    totalAmount: number;
    status: 'PENDING' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
    createdAt: Date;
    tableNumber: number;
    paymentIntentId?: string;
    customerName: string;
    items: OrderItem[];
}

export type CreateOrderPayload = {
    restaurantId: string;
    paymentIntentId: string;
    customerName: string;
    tableNumber: number;
    items: { menuID: number; quantity: number }[];
};

export type CreateManualOrderPayload = Omit<CreateOrderPayload, "paymentIntentId">;
