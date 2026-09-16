import { prisma } from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import type { FoodCourtSignUp, LoginInput, SignupInput } from "../types/index.js";
import jwt from "jsonwebtoken"

export const signupService = async (data: SignupInput, foodCourtId: string) => {
    const { restaurantName, location, ownerName, email, password } = data;

    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await hashPassword(password);

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
            vendors: true
        }
    });

    return newRestaurant;
};


export const signFoodCourtService = async (data: FoodCourtSignUp) => {
    const { foodCourtName, location, email, password, managementDetails, currancy, paymentSystem } = data

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
            currancy: currancy || "USD",
            paymentSystem: paymentSystem || "stripe",
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

export const fetchFoodCourtsService = async () => {
    return await prisma.foodCourt.findMany({
        include: {
            admins: true
        }
    });
};

export const editFoodCourtService = async (id: string, data: any) => {
    const { foodCourtName, location, currancy, paymentSystem, managementDetails, email } = data;
    return await prisma.$transaction(async (tx) => {
        const updatedCourt = await tx.foodCourt.update({
            where: { id },
            data: {
                name: foodCourtName,
                location,
                currancy,
                paymentSystem
            }
        });

        if (managementDetails || email) {
            const admin = await tx.user.findFirst({
                where: {
                    foodCourtId: id,
                    role: "FOOD_COURT_ADMIN"
                }
            });
            if (admin) {
                await tx.user.update({
                    where: { id: admin.id },
                    data: {
                        name: managementDetails,
                        email
                    }
                });
            }
        }
        return updatedCourt;
    });
};

export const deleteFoodCourtService = async (id: string) => {
    return await prisma.$transaction(async (tx) => {
        const restaurants = await tx.restaurant.findMany({
            where: { foodCourtId: id },
            select: { id: true }
        });
        const restaurantIds = restaurants.map(r => r.id);

        await tx.orderItem.deleteMany({
            where: {
                menu: {
                    restaurantId: { in: restaurantIds }
                }
            }
        });

        await tx.order.deleteMany({
            where: { restaurantId: { in: restaurantIds } }
        });

        await tx.menu.deleteMany({
            where: { restaurantId: { in: restaurantIds } }
        });

        await tx.category.deleteMany({
            where: { restaurantId: { in: restaurantIds } }
        });

        await tx.restaurant.deleteMany({
            where: { foodCourtId: id }
        });

        await tx.table.deleteMany({
            where: { foodCourtId: id }
        });

        await tx.user.deleteMany({
            where: {
                OR: [
                    { foodCourtId: id },
                    { restaurantId: { in: restaurantIds } }
                ]
            }
        });

        return await tx.foodCourt.delete({
            where: { id }
        });
    });
};