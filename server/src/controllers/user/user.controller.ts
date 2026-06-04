import { uploadLogo, userService, updateRestaurantStatus } from "../../services/user.service.js"
import type { Request, Response } from "express"

export const userController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await userService(userId)
        res.status(200).json(user)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const uploadLogoController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id
        if(!userId) {
            throw new Error("Unauthorized")
        } 
        const { logo } = req.body
        const user = await uploadLogo(userId, logo)
        res.status(200).json(user)
    } catch(err: any) {
        res.status(400).json({ message: err.message })
    }
}

export const updateRestaurantStatusController = async (req: Request, res: Response) => {
    try {
        const restaurantId = (req as any).user?.restaurantId
        if (!restaurantId) {
            throw new Error("User does not have a restaurant associated")
        }
        const { isClosed } = req.body
        if (typeof isClosed !== "boolean") {
            throw new Error("isClosed must be a boolean")
        }
        const restaurant = await updateRestaurantStatus(restaurantId, isClosed)
        res.status(200).json(restaurant)
    } catch(err: any) {
        res.status(400).json({ message: err.message })
    }
}

