import type { Request, Response } from "express";
import {
    addCategory,
    addMenuService,
    deleteCategory,
    deleteMenuService,
    fetchCategory,
    fetchMenuService,
    updateCategory,
    updateMenuService,
} from "../../services/menu.service.js";

export const addMenuController = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.user?.restaurantId;
        if (!restaurantId) return res.status(403).json({ message: "No restaurant ID found for this user." });
        const newItem = await addMenuService(req.body, restaurantId);
        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const fetchMenuController = async (req: Request, res: Response) => {
    try {
        // An explicit restaurantId (the public menu page) wins, otherwise a signed-in
        // vendor browsing another store would be served their own menu.
        const restaurantId = req.query.restaurantId as string || req.user?.restaurantId;
        if (!restaurantId) {
            return res.status(400).json({ message: "Restaurant ID is required." });
        }
        const data = await fetchMenuService(restaurantId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const addCategoryController = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.user?.restaurantId;
        if (!restaurantId) return res.status(403).json({ message: "No restaurant ID found for this user." });
        const data = await addCategory(req.body, restaurantId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const fetchCategoryController = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.user?.restaurantId;
        if (!restaurantId) return res.status(403).json({ message: "No restaurant ID found for this user." });
        const data = await fetchCategory(restaurantId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCategoryController = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.user?.restaurantId;
        const { id, name } = req.body ?? {};
        if (!restaurantId || !Number.isSafeInteger(id) || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Valid category ID and name are required." });
        }
        const data = await updateCategory({ id, name: name.trim() }, restaurantId);
        res.status(200).json(data);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.user?.restaurantId;
        const { id } = req.body ?? {};
        if (!restaurantId || !Number.isSafeInteger(id)) {
            return res.status(400).json({ message: "A valid category ID is required." });
        }
        const data = await deleteCategory({ id }, restaurantId)
        res.status(200).json(data);
    } catch (err: any) {
        res.status(400).json({ message: err.message })
    }
}

export const deleteMenuController = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.user?.restaurantId;
        const { id } = req.body ?? {};
        if (!restaurantId || !Number.isSafeInteger(id)) {
            return res.status(400).json({ message: "A valid menu item ID is required." });
        }
        const deletedItem = await deleteMenuService({ id }, restaurantId);
        res.status(200).json(deletedItem);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}