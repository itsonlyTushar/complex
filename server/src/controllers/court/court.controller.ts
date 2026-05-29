import type { Request, Response } from "express"
import { fetchRestaurantService } from "../../services/court.service.js"

export const fetchRestaurantsController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId
        const data = await fetchRestaurantService(Number(foodCourtId))
        res.status(200).json(data)
    } catch(error: any) {
        res.status(400).json({messsage: error.message})
    }
}