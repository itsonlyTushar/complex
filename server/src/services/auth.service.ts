import { prisma } from "../config/db.js";
import { hashPassword } from "../utils/hash.js";
import type { SignupInput } from "../controllers/auth/auth.types.js";

export const signupService = async (data: SignupInput, foodCourtId: number = 1) => {
    const { restaurantName, location, ownerName, email, password } = data;

    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    // 2. Hash the password
    const hashedPassword = await hashPassword(password);

    // 3. Create Restaurant AND the Vendor User in one transaction!
    const newRestaurant = await prisma.restaurant.create({
        data: {
            name: restaurantName,
            location: location,
            foodCourtId: foodCourtId,
            vendors: {
                create: {
                    name: ownerName,
                    email: email,
                    password: hashedPassword,
                    role: "RESTAURANT_VENDOR"
                }
            }
        },
        include: {
            vendors: true // Return the newly created user data along with the restaurant
        }
    });

    return newRestaurant;
};
