import { prisma } from "../config/db.js"
import type { Category, Menu } from "../types/menu.types.js"

export const addMenuService = async (data: any, restaurantId: number) => {
    const { itemName, category, image, price, cost, quantity, description } = data

    const exsistingItem = await prisma.menu.findFirst({
        where: {
            itemName,
            restaurantId
        }
    })

    if (exsistingItem) {
        throw new Error("Item already exists");
    }

    let resolvedCategoryId: number | null = null;
    if (category) {
        const foundCategory = await prisma.category.findFirst({
            where: {
                name: category,
                restaurantId
            }
        });
        if (foundCategory) {
            resolvedCategoryId = foundCategory.id;
        }
    }

    const newItem = await prisma.menu.create({
        data: {
            itemName,
            image: image || "",
            categoryId: resolvedCategoryId,
            price: Math.round(Number(price)),
            cost: Math.round(Number(cost)),
            quantity: Math.round(Number(quantity)),
            description,
            restaurantId
        },
        include: {
            category: true
        }
    })

    return {
        ...newItem,
        category: newItem.category ? newItem.category.name : ""
    }
}

export const fetchMenuService = async (restaurandId: number) => {
    const menuData = await prisma.menu.findMany({
        where: {
            restaurantId: restaurandId
        },
        include: {
            category: true
        }
    });

    return menuData.map(item => ({
        ...item,
        category: item.category ? item.category.name : ""
    }));
}

export const updateMenuService = async (data: any, restaurantId: number) => {
    const { id, itemName, category, image, price, cost, quantity, description } = data;

    let resolvedCategoryId: number | null = null;
    if (category) {
        const foundCategory = await prisma.category.findFirst({
            where: {
                name: category,
                restaurantId
            }
        });
        if (foundCategory) {
            resolvedCategoryId = foundCategory.id;
        }
    }

    const updatedItem = await prisma.menu.update({
        where: {
            id: Number(id)
        },
        data: {
            itemName,
            image: image || "",
            categoryId: resolvedCategoryId,
            price: Math.round(Number(price)),
            cost: Math.round(Number(cost)),
            quantity: Math.round(Number(quantity)),
            description
        },
        include: {
            category: true
        }
    });

    return {
        ...updatedItem,
        category: updatedItem.category ? updatedItem.category.name : ""
    };
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

export const updateCategory = async (data: Category) => {
    const { id, name } = data
    const updateCat = await prisma.category.update({
        where: {
           id 
        },
        data: {name}
    })
    return updateCat
}