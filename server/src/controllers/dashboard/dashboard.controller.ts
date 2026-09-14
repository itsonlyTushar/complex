import type { Request, Response } from "express";
import {
    fetchVendorDashboard,
    fetchCourtDashboard,
    fetchSuperAdminDashboard,
} from "../../services/dashboard.service.js";

export const fetchVendorDashboardController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (user?.role !== "RESTAURANT_VENDOR") {
            return res.status(403).json({ message: "Only restaurant vendors can view this dashboard." });
        }
        if (!user?.restaurantId) {
            return res.status(403).json({ message: "No restaurant associated with this user." });
        }
        const data = await fetchVendorDashboard(user.restaurantId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to fetch dashboard metrics." });
    }
};

export const fetchCourtDashboardController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (user?.role !== "FOOD_COURT_ADMIN") {
            return res.status(403).json({ message: "Only food court admins can view this dashboard." });
        }
        if (!user?.foodCourtId) {
            return res.status(403).json({ message: "No food court associated with this user." });
        }
        const data = await fetchCourtDashboard(user.foodCourtId);
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to fetch dashboard metrics." });
    }
};

export const fetchSuperAdminDashboardController = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (user?.role !== "SUPER_ADMIN") {
            return res.status(403).json({ message: "Only super admins can view this dashboard." });
        }
        const data = await fetchSuperAdminDashboard();
        res.status(200).json(data);
    } catch (error: any) {
        res.status(400).json({ message: error.message || "Failed to fetch dashboard metrics." });
    }
};
