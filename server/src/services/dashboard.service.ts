import { prisma } from "../config/db.js";

const startOfToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const fetchVendorDashboard = async (restaurantId: string) => {
    const todayStart = startOfToday();

    const [openOrders, todayOrders, recentOrders] = await Promise.all([
        prisma.order.findMany({
            where: {
                restaurantId,
                status: { in: ["PENDING", "PREPARING", "COMPLETED"] },
            },
            select: { id: true, status: true, createdAt: true },
        }),
        prisma.order.findMany({
            where: { restaurantId, createdAt: { gte: todayStart } },
            include: { items: true },
        }),
        prisma.order.findMany({
            where: { restaurantId },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: { items: true },
        }),
    ]);

    const queueCounts = { PENDING: 0, PREPARING: 0, COMPLETED: 0 };
    let oldestOpenMs: number | null = null;
    const now = Date.now();
    for (const o of openOrders) {
        if (o.status in queueCounts) {
            queueCounts[o.status as keyof typeof queueCounts]++;
        }
        if (o.status === "PENDING" || o.status === "PREPARING") {
            const ageMs = now - new Date(o.createdAt).getTime();
            if (oldestOpenMs === null || ageMs > oldestOpenMs) oldestOpenMs = ageMs;
        }
    }

    const nonCancelledToday = todayOrders.filter((o) => o.status !== "CANCELLED");
    const cancelledToday = todayOrders.filter((o) => o.status === "CANCELLED").length;
    const revenueToday = nonCancelledToday.reduce((sum, o) => sum + o.totalAmount, 0);
    const coversToday = nonCancelledToday.reduce(
        (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
        0
    );
    const avgTicket = nonCancelledToday.length > 0 ? revenueToday / nonCancelledToday.length : 0;

    const coversByHour: { hour: string; covers: number }[] = Array.from({ length: 24 }, (_, h) => ({
        hour: String(h).padStart(2, "0"),
        covers: 0,
    }));
    for (const o of nonCancelledToday) {
        const hour = new Date(o.createdAt).getHours();
        const covers = o.items.reduce((s, i) => s + i.quantity, 0);
        const bucket = coversByHour[hour];
        if (bucket) bucket.covers += covers;
    }

    return {
        openTickets: queueCounts.PENDING + queueCounts.PREPARING + queueCounts.COMPLETED,
        queue: [
            { label: "Pending", state: "aging", count: queueCounts.PENDING },
            { label: "Preparing", state: "idle", count: queueCounts.PREPARING },
            { label: "Ready", state: "ready", count: queueCounts.COMPLETED },
        ],
        oldestOpenAgeSeconds: oldestOpenMs !== null ? Math.floor(oldestOpenMs / 1000) : null,
        revenueToday,
        coversToday,
        avgTicket,
        cancelledToday,
        coversByHour,
        recentOrders: recentOrders.map((o) => ({
            id: o.id,
            table: o.tableNumber,
            total: o.totalAmount,
            status: o.status,
            createdAt: o.createdAt,
        })),
    };
};

export const fetchCourtDashboard = async (foodCourtId: string) => {
    const restaurants = await prisma.restaurant.findMany({
        where: { foodCourtId },
        select: { id: true, isClosed: true },
    });
    const restaurantIds = restaurants.map((r) => r.id);
    const trading = restaurants.filter((r) => !r.isClosed).length;

    const todayStart = startOfToday();
    const todayOrders = restaurantIds.length
        ? await prisma.order.findMany({
              where: {
                  restaurantId: { in: restaurantIds },
                  createdAt: { gte: todayStart },
                  status: { not: "CANCELLED" },
              },
              select: { totalAmount: true },
          })
        : [];

    return {
        restaurantsTotal: restaurants.length,
        restaurantsTrading: trading,
        restaurantsDark: restaurants.length - trading,
        ordersToday: todayOrders.length,
        revenueToday: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    };
};

export const fetchSuperAdminDashboard = async () => {
    const todayStart = startOfToday();

    const [foodCourtsTotal, restaurantsTotal, vendorsTotal, todayOrders] = await Promise.all([
        prisma.foodCourt.count(),
        prisma.restaurant.count(),
        prisma.user.count({ where: { role: "RESTAURANT_VENDOR" } }),
        prisma.order.findMany({
            where: { createdAt: { gte: todayStart }, status: { not: "CANCELLED" } },
            select: { totalAmount: true },
        }),
    ]);

    return {
        foodCourtsTotal,
        restaurantsTotal,
        vendorsTotal,
        ordersToday: todayOrders.length,
        revenueToday: todayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    };
};
