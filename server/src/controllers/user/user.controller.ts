import { userService } from "../../services/user.service.js"
import type { Request, Response } from "express"

export const userController = async (req: Request, res: Response) => {
    try {
        const users = await userService()
        res.status(200).json(users)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}
