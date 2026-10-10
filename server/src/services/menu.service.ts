import { prisma } from "../config/db.js"
import type { Category, Menu } from "../types/menu.types.js"
import { uploadImageToCloudinary } from "../config/cloudinary.js"

export const addMenuService = async (data: Menu, restaurantId: string) => {
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
            image: image ? await uploadImageToCloudinary(image) : "",
            categoryId: resolvedCategoryId,
            price: Math.round(price),
            cost: Math.round(cost),
            quantity: Math.round(quantity),
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

export const fetchMenuService = async (restaurandId: string) => {
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

export const updateMenuService = async (data: Menu, restaurantId: string) => {
    const { id, itemName, category, image, price, cost, quantity, description } = data;
    const existingItem = await prisma.menu.findFirst({
        where: { id, restaurantId },
        select: { id: true },
    });
    if (!existingItem) {
        throw new Error("Menu item not found for this restaurant.");
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

    const result = await prisma.menu.updateMany({
        where: {
            id,
            restaurantId,
        },
        data: {
            itemName,
            image: image ? await uploadImageToCloudinary(image) : "",
            categoryId: resolvedCategoryId,
            price: Math.round(price),
            cost: Math.round(cost),
            quantity: Math.round(quantity),
            description
        },
    });
    if (result.count !== 1) {
        throw new Error("Menu item not found for this restaurant.");
    }
    const updatedItem = await prisma.menu.findFirstOrThrow({
        where: { id, restaurantId },
        include: { category: true },
    });

    return {
        ...updatedItem,
        category: updatedItem.category ? updatedItem.category.name : ""
    };
}

export const addCategory = async (data: Category, restaurantId: string) => {
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

export const fetchCategory = async (restaurantId: string) => {
    const data = await prisma.category.findMany({
        where: {
            restaurantId: restaurantId
        }
    })
    return data
}

export const updateCategory = async (data: Category, restaurantId: string) => {
    const { id, name } = data
    const result = await prisma.category.updateMany({
        where: {
           id,
           restaurantId,
        },
        data: {name}
    })
    if (result.count !== 1) {
        throw new Error("Category not found for this restaurant.");
    }
    return prisma.category.findFirstOrThrow({ where: { id, restaurantId } });
}

export const deleteCategory = async (data: { id: number }, restaurantId: string) => {
    const {id} = data
    const result = await prisma.category.deleteMany({
        where: {
            id,
            restaurantId,
        }
    })
    if (result.count !== 1) {
        throw new Error("Category not found for this restaurant.");
    }
    return { id };
}

export const deleteMenuService = async (data: { id: number }, restaurantId: string) => {
    const { id } = data;
    const result = await prisma.menu.deleteMany({
        where: {
            id,
            restaurantId,
        }
    });
    if (result.count !== 1) {
        throw new Error("Menu item not found for this restaurant.");
    }
    return { id };
}