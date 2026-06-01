import { prisma } from "../config/db.js"

export const fetchRestaurantService  = async (foodCourtId: number) => {
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

export const deleteRestaurantService = async (restaurantId: number, foodCourtId: number) => {
    // 1. Verify restaurant exists and belongs to this food court
    const restaurant = await prisma.restaurant.findUnique({
        where: { id: restaurantId }
    });

    if (!restaurant) {
        throw new Error("Restaurant not found");
    }

    if (restaurant.foodCourtId !== foodCourtId) {
        throw new Error("Unauthorized to delete this restaurant");
    }

    // 2. Cascade delete all related records in a transaction
    return await prisma.$transaction(async (tx) => {
        // Delete related menus
        await tx.menu.deleteMany({
            where: { restaurantId }
        });

        // Delete related categories
        await tx.category.deleteMany({
            where: { restaurantId }
        });

        // Delete related users (vendors)
        await tx.user.deleteMany({
            where: { restaurantId }
        });

        // Delete the restaurant itself
        return await tx.restaurant.delete({
            where: { id: restaurantId }
        });
    });
};

