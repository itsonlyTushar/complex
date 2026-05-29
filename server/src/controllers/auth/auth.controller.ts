import type { Request, Response } from "express";
import { loginService, signFoodCourtService, signupService } from "../../services/auth.service.js";

// For Food Court
export const signupController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId;
        if (!foodCourtId) {
            throw new Error("Unauthorized: No food court associated with this admin.");
        }
        const user = await signupService(req.body, Number(foodCourtId));
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// For Super Admin 
export const foodCourtSignUpController = async (req: Request, res: Response) => {
    try {
        const user = await signFoodCourtService(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const loginController = async (req: Request, res: Response) => {
    try {
        const user = await loginService(req.body)
        res.status(201).json(user)
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}