import type { Request, Response } from "express"
import { addMenuService } from "../../services/menu.service.js"

export const addMenuController = async (req: Request, res: Response) => {
    try {
        const restaurantId = (req as any).user?.restaurantId
        const newItem = await addMenuService(req.body, Number(restaurantId));
        res.status(201).json(newItem)
    } catch (error:any) {
        res.status(400).json({message: error.message})
    }
}