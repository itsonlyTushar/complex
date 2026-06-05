import { prisma } from "../config/db.js"
import { uploadImageToCloudinary } from "../config/cloudinary.js"
 
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
                foodCourtId: true,
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        isClosed: true,
                        stripeAccountId: true,
                        onBoradingCompleted: true,
                        logo: true,
                        description: true,
                        commissionRate: true
                    }
                }
            }
        });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const updateRestaurantStatus = async (restaurantId: string, isClosed: boolean) => {
    try {
        const restaurant = await prisma.restaurant.update({
            where: { id: restaurantId },
            data: { isClosed },
            select: {
                id: true,
                name: true,
                isClosed: true
            }
        });
        return restaurant;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


export const uploadLogo = async (userId: number, logo: string | URL) => {
    try {
        const logoUrl = typeof logo === "string" ? logo : logo.toString();
        const uploadedUrl = logoUrl ? await uploadImageToCloudinary(logoUrl) : "";
        
        const userObj = await prisma.user.findUnique({
            where: { id: userId },
            select: { restaurantId: true }
        });

        if (!userObj || !userObj.restaurantId) {
            throw new Error("User does not have an associated restaurant");
        }

        const restaurant = await prisma.restaurant.update({
            where: { id: userObj.restaurantId },
            data: {
                logo: uploadedUrl
            },
            select: {
                id: true,
                logo: true
            }
        });
        return restaurant;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
