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
                logo: true,
                restaurantDescription: true
            }
        });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const uploadLogo = async (userId: number, logo: string | URL) => {
    try {
        const logoUrl = typeof logo === "string" ? logo : logo.toString();
        const uploadedUrl = logoUrl ? await uploadImageToCloudinary(logoUrl) : "";
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                logo: uploadedUrl
            },
            select: {
                id: true,
                logo: true
            }
        });
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
