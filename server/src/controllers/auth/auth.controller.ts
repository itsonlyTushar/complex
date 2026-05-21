import type { Request, Response } from "express";
import { loginService, signFoodCourtService, signupService } from "../../services/auth.service.js";

// For Food Court
export const signupController = async (req: Request, res: Response) => {
    try {
        const user = await signupService(req.body);
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