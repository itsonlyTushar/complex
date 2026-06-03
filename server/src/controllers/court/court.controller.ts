import type { Request, Response } from "express"
import { fetchRestaurantService, deleteRestaurantService, editRestaurantService, fetchPublicFoodCourtService } from "../../services/court.service.js"

export const fetchRestaurantsController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId
        const data = await fetchRestaurantService(Number(foodCourtId))
        res.status(200).json(data)
    } catch(error: any) {
        res.status(400).json({messsage: error.message})
    }
}

export const deleteRestaurantController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId;
        const userRole = (req as any).user?.role;
        const { id } = req.params;

        if (userRole !== "FOOD_COURT_ADMIN") {
             res.status(403).json({ message: "Only food court admins can delete restaurants" });
             return;
        }

        if (!id) {
             res.status(400).json({ message: "Restaurant ID is required" });
             return;
        }

        const deletedRestaurant = await deleteRestaurantService(Number(id), Number(foodCourtId));
        res.status(200).json({ message: "Restaurant deleted successfully", data: deletedRestaurant });
    } catch(error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const editRestaurantController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId;
        const userRole = (req as any).user?.role;
        const { id } = req.params;
        const updateData = req.body;

        if (userRole !== "FOOD_COURT_ADMIN") {
             res.status(403).json({ message: "Only food court admins can edit restaurants" });
             return;
        }

        if (!id) {
             res.status(400).json({ message: "Restaurant ID is required" });
             return;
        }

        const updatedRestaurant = await editRestaurantService(Number(id), Number(foodCourtId), updateData);
        res.status(200).json({ message: "Restaurant updated successfully", data: updatedRestaurant });
    } catch(error: any) {
        res.status(400).json({ message: error.message });
    }
}

export const fetchPublicRestaurantsController = async (req: Request, res: Response) => {
    try {
        const { foodCourtId } = req.params;
        const { tableId } = req.query;
        if (!foodCourtId) {
             res.status(400).json({ message: "Food Court ID is required" });
             return;
        }
        const data = await fetchPublicFoodCourtService(Number(foodCourtId), tableId ? String(tableId) : undefined);
        res.status(200).json(data);
    } catch(error: any) {
        res.status(400).json({ message: error.message });
    }
}
