import { prisma } from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import type { FoodCourtSignUp, LoginInput, SignupInput } from "../types/index.js";
import jwt from "jsonwebtoken"

/* Sign up for the Restaurants */
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
                    role: "RESTAURANT_VENDOR",
                    foodCourtId: foodCourtId
                }
            }
        },
        include: {
            vendors: true // Return the newly created user data along with the restaurant
        }
    });

    return newRestaurant;
};


/* SIGN-UP FOR THE FOOD COURT */
export const signFoodCourtService = async (data: FoodCourtSignUp, foodCourtId: number = 1) => {
    const { foodCourtName, location, email, password, managementDetails } = data

    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    })

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password)

    const newFoodCourt = await prisma.foodCourt.create({
        data: {
            name: foodCourtName,
            location: location,
            admins: {
                create: {
                    name: managementDetails,
                    email: email,
                    password: hashedPassword,
                    role: "FOOD_COURT_ADMIN"
                }
            }
        },
        include: {
            admins: true
        }
    })
    return newFoodCourt
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
        throw new Error("Invalid email or password")
    }

    const token = jwt.sign(
        {
            userId: user.id, role: user.role, email: user.email
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        }
    }
}