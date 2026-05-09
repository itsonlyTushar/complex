import { prisma } from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import type { LoginInput, SignupInput } from "../controllers/auth/auth.types.js";
import jwt from "jsonwebtoken"

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


// Login Service 

export const loginService = async (data: LoginInput) => {
    const { email, password } = data

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("Invalid Credentials")
    }

    const isMatch = await comparePassword(password, user.password)

    if (!isMatch) {
        throw new Error("Invalid Credentials")
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
    )

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    }
}