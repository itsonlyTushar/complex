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
    if (restaurandId.startsWith("demo-stall")) {
        return [
            { id: 1, itemName: "Texas Brisket Plate", image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60", price: 22, cost: 9, quantity: 45, description: "14-hour smoked prime beef brisket served with house pickles and jalapeño cornbread.", restaurantId: restaurandId, categoryId: 1, category: "Smoked Meats" },
            { id: 2, itemName: "Pulled Pork Sandwich", image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=500&auto=format&fit=crop&q=60", price: 14, cost: 5, quantity: 60, description: "Slow-roasted pulled pork topped with creamy cabbage slaw on a toasted brioche bun.", restaurantId: restaurandId, categoryId: 2, category: "Sandwiches & Burgers" },
            { id: 3, itemName: "Smoked Ribs (Half Rack)", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=500&auto=format&fit=crop&q=60", price: 28, cost: 12, quantity: 30, description: "Fall-off-the-bone tender baby back ribs glazed in sweet honey chipotle sauce.", restaurantId: restaurandId, categoryId: 1, category: "Smoked Meats" },
            { id: 4, itemName: "Smoked Mac & Cheese", image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&auto=format&fit=crop&q=60", price: 12, cost: 3, quantity: 50, description: "Cavatappi pasta baked in a velvety 4-cheese sauce with hardwood smoke finish.", restaurantId: restaurandId, categoryId: 3, category: "Sides & Bites" },
            { id: 5, itemName: "Crispy Waffle Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60", price: 4, cost: 1, quantity: 100, description: "Golden crispy waffle-cut fries tossed with house barbecue spice dust.", restaurantId: restaurandId, categoryId: 3, category: "Sides & Bites" },
            { id: 6, itemName: "Craft Lemonade", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60", price: 5, cost: 1, quantity: 80, description: "Freshly squeezed Meyer lemons infused with mint and pure cane sugar.", restaurantId: restaurandId, categoryId: 4, category: "Craft Drinks" }
        ];
    }

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