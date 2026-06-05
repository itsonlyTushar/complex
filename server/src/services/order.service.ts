import { prisma } from "../config/db.js";
import type { Order, OrderItem } from "../types/order.types.js";
import { updatePaymentIntentMetadata } from "./payment.service.js";

// We omit the auto-generated fields (id, status, createdAt) for the incoming payload
type CreateOrderPayload = Omit<Order, 'id' | 'status' | 'createdAt'>;

export const addOrder = async (data: CreateOrderPayload) => {
    const { restaurantId, totalAmount, items, tableNumber, paymentIntentId, customerName } = data;

    // Use a transaction to ensure both operations succeed together
    const newOrder = await prisma.$transaction(async (tx) => {
        // 1. Create the order
        const order = await tx.order.create({
            data: {
                restaurantId,
                totalAmount,
                tableNumber,
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

        // 2. Subtract inventory for each item
        for (const item of items) {
            await tx.menu.update({
                where: { id: item.menuID },
                data: {
                    quantity: {
                        decrement: item.quantity
                    }
                }
            });
        }

        return order;
    });

    if (paymentIntentId) {
        await updatePaymentIntentMetadata(paymentIntentId, newOrder.id);
    }

    return newOrder;
}

export const fetchOrdersForRestaurant = async (restaurantId: string) => {
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

export const fetchOrdersForTable = async (restaurantId: string, tableNumber: number) => {
    const orders = await prisma.order.findMany({
        where: {
            restaurantId: restaurantId,
            tableNumber: tableNumber,
            status: {
                notIn: ['CANCELLED', 'COMPLETED']
            }
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

export const fetchPaymentDetailsForRestaurant = async (restaurantId: string) => {
    // Fetch restaurant commission rate
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { commissionRate: true }
    });

    const commissionRate = restaurant?.commissionRate ?? 5.0;

    // Fetch all orders (excluding cancelled) with items and menu cost
    const orders = await prisma.order.findMany({
        where: {
            restaurantId,
            status: { not: 'CANCELLED' }
        },
        include: {
            items: {
                include: {
                    menu: {
                        select: { cost: true, itemName: true }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    const paymentDetails = orders.map((order) => {
        const totalAmount = order.totalAmount;
        const commissionAmount = parseFloat(((totalAmount * commissionRate) / 100).toFixed(2));
        const netAmount = parseFloat((totalAmount - commissionAmount).toFixed(2));

        const costOfGoods = order.items.reduce((sum, item) => {
            const menuCost = item.menu?.cost ?? 0;
            return sum + (item.quantity * menuCost);
        }, 0);

        const realProfit = parseFloat((netAmount - costOfGoods).toFixed(2));

        return {
            orderId: order.id,
            createdAt: order.createdAt,
            customerName: order.customerName,
            tableNumber: order.tableNumber,
            status: order.status,
            totalAmount,
            commissionRate,
            commissionAmount,
            netAmount,
            costOfGoods,
            realProfit,
            items: order.items.map((item) => ({
                itemName: item.menu?.itemName ?? `Item #${item.menuId}`,
                quantity: item.quantity,
                price: item.price,
                cost: item.menu?.cost ?? 0,
            })),
        };
    });

    // Summary totals
    const summary = {
        totalRevenue: paymentDetails.reduce((s, p) => s + p.totalAmount, 0),
        totalCommission: parseFloat(paymentDetails.reduce((s, p) => s + p.commissionAmount, 0).toFixed(2)),
        totalNet: parseFloat(paymentDetails.reduce((s, p) => s + p.netAmount, 0).toFixed(2)),
        totalCost: paymentDetails.reduce((s, p) => s + p.costOfGoods, 0),
        totalProfit: parseFloat(paymentDetails.reduce((s, p) => s + p.realProfit, 0).toFixed(2)),
        orderCount: paymentDetails.length,
    };

    return { payments: paymentDetails, summary };
}