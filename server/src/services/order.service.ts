import { prisma } from "../config/db.js";
import type { CreateOrderPayload, Order, OrderItem } from "../types/order.types.js";
import { refundUnfulfilledPaymentIntent, updatePaymentIntentMetadata, verifyPaymentIntentForOrder } from "./payment.service.js";
import { assertRestaurantAcceptingOrders, OrderingClosedError } from "./court.service.js";
import { parseCartLines, priceCart } from "./pricing.service.js";

export const addOrder = async (data: CreateOrderPayload) => {
    const {
        restaurantId,
        items: rawItems,
        tableNumber: rawTableNumber,
        paymentIntentId,
        customerName: rawCustomerName,
    } = data;
    const existingOrder = await prisma.order.findUnique({
        where: { paymentIntentId },
        include: { items: true },
    });
    if (existingOrder) {
        if (existingOrder.restaurantId !== restaurantId) {
            throw new Error("Payment is already associated with another restaurant.");
        }
        await updatePaymentIntentMetadata(paymentIntentId, existingOrder.id);
        return existingOrder;
    }

    let paymentVerified = false;
    try {
        if (typeof rawCustomerName !== "string" || !rawCustomerName.trim()) {
            throw new Error("Customer name is required.");
        }
        if (typeof rawTableNumber !== "number" || !Number.isSafeInteger(rawTableNumber) || rawTableNumber <= 0) {
            throw new Error("A valid table number is required.");
        }
        const lines = parseCartLines(rawItems);
        const { items, totalAmount } = await verifyPaymentIntentForOrder(paymentIntentId, restaurantId, lines);
        paymentVerified = true;
        try {
            await assertRestaurantAcceptingOrders(restaurantId);
        } catch (error) {
            if (!(error instanceof OrderingClosedError)) throw error;
        }

        const newOrder = await createOrderRecord({
            restaurantId,
            totalAmount,
            items,
            tableNumber: rawTableNumber,
            paymentIntentId,
            customerName: rawCustomerName.trim(),
            status: "PREPARING",
        });

        await updatePaymentIntentMetadata(paymentIntentId, newOrder.id);
        return newOrder;
    } catch (error) {
        const concurrentlyCreatedOrder = await prisma.order.findUnique({
            where: { paymentIntentId },
            include: { items: true },
        });
        if (concurrentlyCreatedOrder?.restaurantId === restaurantId) {
            await updatePaymentIntentMetadata(paymentIntentId, concurrentlyCreatedOrder.id);
            return concurrentlyCreatedOrder;
        }

        if (paymentVerified) {
            await refundUnfulfilledPaymentIntent(paymentIntentId, restaurantId);
        }
        throw error;
    }
}

export const addManualOrder = async (data: Omit<CreateOrderPayload, "paymentIntentId">) => {
    const { restaurantId, items: rawItems, tableNumber: rawTableNumber, customerName: rawCustomerName } = data;
    if (typeof rawCustomerName !== "string" || !rawCustomerName.trim()) {
        throw new Error("Customer name is required.");
    }
    if (typeof rawTableNumber !== "number" || !Number.isSafeInteger(rawTableNumber) || rawTableNumber <= 0) {
        throw new Error("A valid table number is required.");
    }

    const lines = parseCartLines(rawItems);
    await assertRestaurantAcceptingOrders(restaurantId);
    const { items, totalAmount } = await priceCart(restaurantId, lines);
    return createOrderRecord({
        restaurantId,
        totalAmount,
        items,
        tableNumber: rawTableNumber,
        customerName: rawCustomerName.trim(),
    });
};

type OrderRecord = Pick<Order, 'restaurantId' | 'totalAmount' | 'tableNumber' | 'customerName'> & {
    items: (Pick<OrderItem, 'menuID' | 'quantity' | 'price'>)[];
    paymentIntentId?: string;
    status?: Order["status"];
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
};

// Writes the order and takes its items out of stock. Callers are responsible for
// checking the restaurant is open and that the items and payment are genuine.
export const createOrderRecord = async (data: OrderRecord) => {
    const { restaurantId, totalAmount, items, tableNumber, paymentIntentId, customerName, razorpayOrderId, razorpayPaymentId } = data;

    return await prisma.$transaction(async (tx) => {
        for (const item of items) {
            const inventory = await tx.menu.updateMany({
                where: {
                    id: item.menuID,
                    restaurantId,
                    quantity: { gte: item.quantity },
                },
                data: { quantity: { decrement: item.quantity } },
            });
            if (inventory.count !== 1) {
                throw new Error("An item sold out before the order could be placed.");
            }
        }

        const order = await tx.order.create({
            data: {
                restaurantId,
                totalAmount,
                tableNumber,
                paymentIntentId,
                razorpayOrderId,
                razorpayPaymentId,
                customerName,
                status: data.status,
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

        return order;
    });
}

export const fetchOrdersForRestaurant = async (restaurantId: string) => {
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

export const updateOrderStatusService = async (id: number, status: Order['status'], restaurantId: string) => {
    const currentOrder = await prisma.order.findFirst({
        where: { id, restaurantId },
        select: { status: true },
    });
    if (!currentOrder) {
        throw new Error("Order not found for this restaurant.");
    }
    const allowedTransitions: Record<Order["status"], Order["status"][]> = {
        PENDING: ["PREPARING", "CANCELLED"],
        PREPARING: ["READY", "CANCELLED"],
        READY: ["COMPLETED", "CANCELLED"],
        COMPLETED: [],
        CANCELLED: [],
    };
    if (!allowedTransitions[currentOrder.status as Order["status"]]?.includes(status)) {
        throw new Error("This order status transition is not allowed.");
    }

    const result = await prisma.order.updateMany({
        where: { id, restaurantId, status: currentOrder.status },
        data: { status },
    });
    if (result.count !== 1) {
        throw new Error("Order not found for this restaurant.");
    }

    return prisma.order.findFirstOrThrow({
        where: { id, restaurantId },
        include: {
            items: true
        }
    });
}

export const cancelOrderService = async (id: number, restaurantId: string) =>
    prisma.$transaction(async (tx) => {
        const order = await tx.order.findFirst({
            where: { id, restaurantId },
            include: { items: true },
        });
        if (!order) {
            throw new Error("Order not found for this restaurant.");
        }
        if (order.status === "CANCELLED") {
            return { order, newlyCancelled: false };
        }
        if (order.status === "COMPLETED" || !["PENDING", "PREPARING", "READY"].includes(order.status)) {
            throw new Error("This order can no longer be cancelled.");
        }

        const update = await tx.order.updateMany({
            where: { id, restaurantId, status: order.status },
            data: { status: "CANCELLED" },
        });
        if (update.count !== 1) {
            throw new Error("Order status changed while cancellation was in progress.");
        }

        for (const item of order.items) {
            await tx.menu.updateMany({
                where: { id: item.menuId, restaurantId },
                data: { quantity: { increment: item.quantity } },
            });
        }

        return {
            order: { ...order, status: "CANCELLED" },
            newlyCancelled: true,
        };
    });

export const fetchPaymentDetailsForRestaurant = async (restaurantId: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { commissionRate: true, foodCourt: { select: { currancy: true } } }
    });

    const platformCommissionRate = restaurant?.commissionRate ?? 5.0;
    const currency = restaurant?.foodCourt.currancy ?? "USD";

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
        const paymentProvider = order.razorpayPaymentId ? "razorpay" : order.paymentIntentId ? "stripe" : "cash";
        // Razorpay payments land directly in the restaurant's own account, so the platform takes no cut.
        const commissionRate = paymentProvider === "razorpay" ? 0 : platformCommissionRate;
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
            paymentProvider,
            paymentReference: order.razorpayPaymentId ?? order.paymentIntentId,
            currency,
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