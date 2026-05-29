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
