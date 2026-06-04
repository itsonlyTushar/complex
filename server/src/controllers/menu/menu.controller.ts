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
        const restaurantId = (req as any).user?.restaurantId;
        const newItem = await addMenuService(req.body, restaurantId);
        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const fetchMenuController = async (req: Request, res: Response) => {
    try {
        const restaurantId = (req as any).user?.restaurantId;
        const data = await fetchMenuService(restaurantId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const addCategoryController = async (req: Request, res: Response) => {
    try {
        const restaurantId = (req as any).user?.restaurantId;
        const data = await addCategory(req.body, restaurantId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const fetchCategoryController = async (req: Request, res: Response) => {
    try {
        const restaurantId = (req as any).user?.restaurantId;
        const data = await fetchCategory(restaurantId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCategoryController = async (req: Request, res: Response) => {
    try {
        const data = await updateCategory(req.body);
        res.status(200).json(data);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteCategoryController = async (req: Request, res: Response) => {
    try {
        const data = await deleteCategory(req.body)
        res.status(200).json(data);
    } catch (err: any) {
        res.status(400).json({ message: err.message })
    }
}

export const deleteMenuController = async (req: Request, res: Response) => {
    try {
        const deletedItem = await deleteMenuService(req.body);
        res.status(200).json(deletedItem);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}