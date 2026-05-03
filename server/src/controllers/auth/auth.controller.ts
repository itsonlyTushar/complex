import type { Request, Response } from "express";
import { signupService } from "../../services/auth.service.js";

export const signupController = async (req: Request, res: Response) => {
    try {
        const user = await signupService(req.body);
        res.status(201).json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};