import { number } from "joi"
import { prisma } from "../config/db.js"
import type { Category, Menu } from "../types/menu.types.js"

export const addMenuService = async (data: Menu, restaurantId: number) => {
    const { id, itemName, categoryId, image, price, cost, quantity, description } = data

    const exsistingItem = await prisma.menu.findFirst({
        where: {
            itemName,
            restaurantId
        }
    })

    if (exsistingItem) {
        throw new Error("Item already exists");
    }

    const newItem = await prisma.menu.create({
        data: {
            itemName,
            image: image || "",
            categoryId,
            price,
            cost,
            quantity,
            description,
            restaurantId
        }
    })
    return newItem
}

export const fetchMenuService = async (restaurandId: number) => {
    const menuData = await prisma.menu.findMany({
        where: {
            restaurantId: restaurandId
        }
    });
    return menuData
}

export const addCategory = async (data: Category, restaurantId: number) => {
    const { id, name } = data

    const existingCategory = await prisma.category.findFirst({
        where: {
            name,
            restaurantId
        }
    });

    if (existingCategory) {
        throw new Error("Category Already Exists")
    }

    const newCategory = await prisma.category.create({
        data: {
            name,
            restaurantId
        }
    })

    return newCategory
}

export const fetchCategory = async (restaurantId:number) => {
    const data = await prisma.category.findMany({
        where: {
            restaurantId: restaurantId
        }
    })
    return data
}