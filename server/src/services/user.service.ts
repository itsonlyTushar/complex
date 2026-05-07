import { prisma } from "../config/db.js"
 
export const userService = async () => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                restaurantId: true
            }
        });
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
}