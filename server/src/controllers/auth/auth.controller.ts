import type { Request, Response } from "express";
import { loginService, signFoodCourtService, signupService, fetchFoodCourtsService, editFoodCourtService, deleteFoodCourtService } from "../../services/auth.service.js";

// For Food Court
export const signupController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId;
        if (!foodCourtId) {
            throw new Error("Unauthorized: No food court associated with this admin.");
        }
        const user = await signupService(req.body, foodCourtId);
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

export const fetchFoodCourtsController = async (req: Request, res: Response) => {
    try {
        const courts = await fetchFoodCourtsService();
        res.status(200).json(courts);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const editFoodCourtController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const court = await editFoodCourtService(Number(id), req.body);
        res.status(200).json(court);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFoodCourtController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteFoodCourtService(Number(id));
        res.status(200).json({ message: "Food Court deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};