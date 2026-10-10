import type { Request, Response } from "express";
import { loginService, signFoodCourtService, signupService, fetchFoodCourtsService, editFoodCourtService, deleteFoodCourtService } from "../../services/auth.service.js";

export const signupController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = req.user?.foodCourtId;
        if (!foodCourtId) {
            throw new Error("Unauthorized: No food court associated with this admin.");
        }
        const user = await signupService(req.body, foodCourtId);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

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

export const guestLoginController = async (req: Request, res: Response) => {
    try {
        const { role } = req.body;
        const validRole = role === "RESTAURANT_VENDOR" ? "RESTAURANT_VENDOR" : "FOOD_COURT_ADMIN";
        const guestUser = {
            id: validRole === "FOOD_COURT_ADMIN" ? 9991 : 9992,
            email: validRole === "FOOD_COURT_ADMIN" ? "court.guest@complexapp.food" : "stall.guest@complexapp.food",
            role: validRole,
            name: validRole === "FOOD_COURT_ADMIN" ? "Central Plaza Food Court (Guest)" : "Smokey Joe's BBQ (Guest)",
            foodCourtId: "demo-court-1",
            restaurantId: validRole === "RESTAURANT_VENDOR" ? "demo-stall-1" : null,
        };
        const token = validRole === "FOOD_COURT_ADMIN" ? "guest_token_court" : "guest_token_vendor";
        res.status(200).json({ token, user: guestUser });
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
        const court = await editFoodCourtService(id as string, req.body);
        res.status(200).json(court);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteFoodCourtController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await deleteFoodCourtService(id as string);
        res.status(200).json({ message: "Food Court deleted successfully" });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};