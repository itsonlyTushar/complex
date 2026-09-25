import { prisma } from "../config/db.js";
import type { Order, OrderItem } from "../types/order.types.js";
import { isPaymentIntentSucceeded, updatePaymentIntentMetadata } from "./payment.service.js";
import { assertRestaurantAcceptingOrders, OrderingClosedError } from "./court.service.js";

type CreateOrderPayload = Omit<Order, 'id' | 'status' | 'createdAt'>;

// The card is charged before the order is written, so a court or stall that closes
// mid-checkout still has to take an order the customer already paid for.
const isUnclaimedPayment = async (paymentIntentId: string, restaurantId: string) => {
    const claimed = await prisma.order.findFirst({ where: { paymentIntentId }, select: { id: true } });
    return !claimed && await isPaymentIntentSucceeded(paymentIntentId, restaurantId);
}

export const addOrder = async (data: CreateOrderPayload) => {
    const { restaurantId, totalAmount, items, tableNumber, paymentIntentId, customerName } = data;

    try {
        await assertRestaurantAcceptingOrders(restaurantId);
    } catch (error) {
        const paidBeforeClosing = error instanceof OrderingClosedError
            && !!paymentIntentId
            && await isUnclaimedPayment(paymentIntentId, restaurantId);
        if (!paidBeforeClosing) throw error;
    }

    const menuIds = [...new Set(items.map((item) => item.menuID))];
    const ownedItems = await prisma.menu.count({ where: { id: { in: menuIds }, restaurantId } });
    if (ownedItems !== menuIds.length) {
        throw new Error("Order contains items from another restaurant");
    }

    const newOrder = await createOrderRecord({ restaurantId, totalAmount, items, tableNumber, paymentIntentId, customerName });

    if (paymentIntentId) {
        await updatePaymentIntentMetadata(paymentIntentId, newOrder.id);
    }

    return newOrder;
}

type OrderRecord = Pick<Order, 'restaurantId' | 'totalAmount' | 'tableNumber' | 'customerName' | 'paymentIntentId'> & {
    items: Pick<OrderItem, 'menuID' | 'quantity' | 'price'>[];
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
};

// Writes the order and takes its items out of stock. Callers are responsible for
// checking the restaurant is open and that the items and payment are genuine.
export const createOrderRecord = async (data: OrderRecord) => {
    const { restaurantId, totalAmount, items, tableNumber, paymentIntentId, customerName, razorpayOrderId, razorpayPaymentId } = data;

    return await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                restaurantId,
                totalAmount,
                tableNumber,
                paymentIntentId,
                razorpayOrderId,
                razorpayPaymentId,
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