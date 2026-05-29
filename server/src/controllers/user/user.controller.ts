import { userService } from "../../services/user.service.js"
import type { Request, Response } from "express"

export const userController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new Error("Unauthorized");
        }
        const user = await userService(Number(userId))
        res.status(200).json(user)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}
