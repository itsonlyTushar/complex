import { prisma } from "../config/db.js"
import type { Menu } from "../types/menu.types.js"

export const addMenuService = async (data: Menu, restaurantId: number) => {
    const {id, itemName, category, image, price, cost, quantity, description} = data

    const exsistingItem = await prisma.menu.findFirst({
        where: {
            itemName,
            restaurantId
        }
    })

    if(exsistingItem) {
        throw new Error("Item already exists");
    }

    const newItem = await prisma.menu.create({
        data: {
            itemName,
            image: image || "",
            category,
            price,
            cost,
            quantity,
            description,
            restaurantId
        }
    })
    
    return newItem
}

