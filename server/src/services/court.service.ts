import { prisma } from "../config/db.js"

export const fetchRestaurantService  = async (foodCourtId: string) => {
    const data = await prisma.restaurant.findMany({
        where: {
            foodCourtId: foodCourtId
        },
        include: {
            vendors: true
        }
    })
    return data
}

export const deleteRestaurantService = async (restaurantId: string, foodCourtId: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (restaurant.foodCourtId !== foodCourtId) {
        throw new Error("Unauthorized to delete this restaurant");
    }

    return await prisma.$transaction(async (tx) => {
        await tx.menu.deleteMany({
            where: { restaurantId }
        });

        await tx.category.deleteMany({
            where: { restaurantId }
        });

        await tx.user.deleteMany({
            where: { restaurantId }
        });

        return await tx.restaurant.delete({
            where: { id: restaurantId }
        });
    });
};

export const editRestaurantService = async (restaurantId: string, foodCourtId: string, updateData: { name?: string; location?: string; isClosed?: boolean }) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (restaurant.foodCourtId !== foodCourtId) {
        throw new Error("Unauthorized to edit this restaurant");
    }

    return await prisma.restaurant.update({
        where: { id: restaurantId },
        data: updateData
    });
};

export const fetchPublicFoodCourtService = async (foodCourtId: string, tableNumber?: string) => {
    if (foodCourtId === "demo-court-1") {
        if (tableNumber) {
            const isValidTable = /^T?([1-9]|1[0-2])$/i.test(tableNumber.trim());
            if (!isValidTable) throw new Error("Invalid Table for this Food Court");
        }
        return {
            foodCourt: {
                id: "demo-court-1",
                name: "Central Plaza Food Court",
                location: "Level 2, North Wing",
                isClosed: false,
                currancy: "USD",
                paymentSystem: "stripe",
            },
            restaurants: [
                { id: "demo-stall-1", name: "Smokey Joe's BBQ", logo: null, description: "Low and slow authentic pit barbecue, smoked ribs and brisket.", isClosed: false },
                { id: "demo-stall-2", name: "Tokyo Ramen Bar", logo: null, description: "Handcrafted tonkotsu and miso ramen with fresh gyoza.", isClosed: false },
                { id: "demo-stall-3", name: "Taco Libre", logo: null, description: "Street-style tacos, roasted salsas, and fresh guacamole.", isClosed: false },
                { id: "demo-stall-4", name: "Bella Pasta & Pinsa", logo: null, description: "Fresh homemade pasta, Roman pinsa, and classic tiramisu.", isClosed: false },
                { id: "demo-stall-5", name: "Green Bowl Co.", logo: null, description: "Organic grain bowls, superfood salads, and fresh smoothies.", isClosed: false },
            ],
        };
    }

    const foodCourt = await prisma.foodCourt.findUnique({
        where: { id: foodCourtId },
        select: { id: true, name: true, location: true, isClosed: true, currancy: true, paymentSystem: true }
    });

    if (!foodCourt) throw new Error("Food Court not found");

    if (tableNumber) {
        const table = await prisma.table.findFirst({
            where: {
                number: tableNumber,
                foodCourtId: foodCourtId
            }
        });
        if (!table) throw new Error("Invalid Table for this Food Court");
    }

    const restaurants = await prisma.restaurant.findMany({
        where: { foodCourtId, isClosed: false },
        select: { id: true, name: true, logo: true, description: true, isClosed: true },
        orderBy: { name: "asc" }
    });

    return { foodCourt, restaurants };
}

export const fetchPublicRestaurantById = async (restaurantId: string) => {
    if (restaurantId.startsWith("demo-stall")) {
        const demoStalls: Record<string, { name: string; location: string; description: string }> = {
            "demo-stall-1": { name: "Smokey Joe's BBQ", location: "Counter 1", description: "Low and slow authentic pit barbecue, smoked ribs and brisket." },
            "demo-stall-2": { name: "Tokyo Ramen Bar", location: "Counter 2", description: "Handcrafted tonkotsu and miso ramen with fresh gyoza." },
            "demo-stall-3": { name: "Taco Libre", location: "Counter 3", description: "Street-style tacos, roasted salsas, and fresh guacamole." },
            "demo-stall-4": { name: "Bella Pasta & Pinsa", location: "Counter 4", description: "Fresh homemade pasta, Roman pinsa, and classic tiramisu." },
            "demo-stall-5": { name: "Green Bowl Co.", location: "Counter 5", description: "Organic grain bowls, superfood salads, and fresh smoothies." },
            "demo-stall-6": { name: "Sweet Tooth Desserts", location: "Counter 6", description: "Artisanal gelato, warm churros, and speciality pastries." }
        };
        const stall = demoStalls[restaurantId] || demoStalls["demo-stall-1"];
        return {
            id: restaurantId,
            name: stall.name,
            location: stall.location,
            logo: null,
            description: stall.description,
            isClosed: false,
            foodCourtId: "demo-court-1",
            foodCourt: { isClosed: false, currancy: "USD", paymentSystem: "stripe" }
        };
    }

    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: {
            id: true,
            name: true,
            location: true,
            logo: true,
            description: true,
            isClosed: true,
            foodCourtId: true,
            foodCourt: { select: { isClosed: true, currancy: true, paymentSystem: true } }
        }
    });
    return restaurant;
}

export const updateFoodCourtStatusService = async (foodCourtId: string, isClosed: boolean) => {
    return await prisma.foodCourt.update({
        where: { id: foodCourtId },
        data: { isClosed },
        select: { id: true, name: true, isClosed: true }
    });
}

export class OrderingClosedError extends Error {}

export const assertRestaurantAcceptingOrders = async (restaurantId: string) => {
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId },
        select: { isClosed: true, foodCourt: { select: { isClosed: true } } }
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (restaurant.foodCourt.isClosed) {
        throw new OrderingClosedError("This food court is closed and is not accepting orders right now.");
    }

    if (restaurant.isClosed) {
        throw new OrderingClosedError("This restaurant is closed and is not accepting orders right now.");
    }
}
