import { prisma } from "../config/db.js"
 
export const userService = async (userId: number) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                restaurantId: true,
                foodCourtId: true
            }
        });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}