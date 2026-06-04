import { prisma } from "../config/db.js";
import type { Order, OrderItem } from "../types/order.types.js";
import { updatePaymentIntentMetadata } from "./payment.service.js";

// We omit the auto-generated fields (id, status, createdAt) for the incoming payload
type CreateOrderPayload = Omit<Order, 'id' | 'status' | 'createdAt'>;

export const addOrder = async (data: CreateOrderPayload) => {
    const { restaurantId, totalAmount, items, tableId, tableName, paymentIntentId, customerName } = data;

    const newOrder = await prisma.order.create({
        data: {
            restaurantId,
            totalAmount,
            tableName,
            tableNumber: tableId,
            paymentIntentId,
            customerName,
            items: {
                create: items.map((item) => ({
                    menuId: item.menuID,
                    quantity: item.quantity,
                    price: item.price,
                }))
            }
        },
        include: {
            items: true
        }
    });

    if (paymentIntentId) {
        await updatePaymentIntentMetadata(paymentIntentId, newOrder.id);
    }

    return newOrder;
}

export const fetchOrdersForRestaurant = async (restaurantId: number) => {
    // Find all orders for this restaurant
    const orders = await prisma.order.findMany({
        where: {
            restaurantId: restaurantId
        },
        include: {
            items: {
                include: {
                    menu: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return orders;
}

export const updateOrderService = async (data: Order) => {
    const { id, status, totalAmount, items } = data;

    const updatedOrder = await prisma.order.update({
        where: {
            id: id
        },
        data: {
            status: status,
            totalAmount: totalAmount,
            items: {
                deleteMany: {}, 
                create: items.map((item) => ({ 
                    menuId: item.menuID,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        },
        include: {
            items: true
        }
    });

    return updatedOrder;
}

export const updateOrderStatusService = async (id: number, status: Order['status']) => {
    const updatedOrder = await prisma.order.update({
        where: { id: id },
        data: { status: status },
        include: {
            items: true
        }
    });

    return updatedOrder;
}