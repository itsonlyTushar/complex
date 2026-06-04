import type { Request, Response } from "express"
import { prisma } from "../../config/db.js"
import { addTable, fetchTables, saveLayout, fetchLayout } from "../../services/tables.service.js"

export const addTableController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId
        const userRole = (req as any).user?.role

        if (userRole !== "FOOD_COURT_ADMIN") {
             res.status(403).json({ message: "Only food court admins can add tables" })
             return
        }

        if (!foodCourtId) {
             res.status(400).json({ message: "Food court ID is required" })
             return
        }

        const { number, occupacy, shape } = req.body

        if (!number || occupacy === undefined || !shape) {
             res.status(400).json({ message: "Table number, occupancy, and shape are required" })
             return
        }

                const table = await addTable({
            number,
            occupacy,
            shape,
            foodCourtId
        })

        res.status(201).json({ message: "Table added successfully", data: table })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}


export const fetchTablesController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId

        if (!foodCourtId) {
             res.status(400).json({ message: "Food court ID is required" })
             return
        }

        const tables = await fetchTables(foodCourtId)
        res.status(200).json(tables)
    } catch(error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const saveLayoutController = async (req: Request, res: Response) => {
    try {
        const foodCourtId = (req as any).user?.foodCourtId
        const userRole = (req as any).user?.role

        if (userRole !== "FOOD_COURT_ADMIN") {
             res.status(403).json({ message: "Only food court admins can save layout" })
             return
        }

        if (!foodCourtId) {
             res.status(400).json({ message: "Food court ID is required" })
             return
        }

        const { walls, infrastructure, placedTables } = req.body

        if (!Array.isArray(walls) || !Array.isArray(infrastructure) || !Array.isArray(placedTables)) {
             res.status(400).json({ message: "walls, infrastructure, and placedTables arrays are required" })
             return
        }

        await saveLayout(foodCourtId, walls, infrastructure, placedTables)
        res.status(200).json({ message: "Layout saved successfully" })
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}

export const fetchLayoutController = async (req: Request, res: Response) => {
    try {
        let foodCourtId = (req as any).user?.foodCourtId

        if (!foodCourtId && (req as any).user?.restaurantId) {
            const restaurant = await prisma.restaurant.findUnique({
                where: { id: (req as any).user.restaurantId },
                select: { foodCourtId: true }
            })
            if (restaurant) {
                foodCourtId = restaurant.foodCourtId
            }
        }

        if (!foodCourtId) {
             res.status(400).json({ message: "Food court ID is required" })
             return
        }

        const layoutData = await fetchLayout(foodCourtId)
        res.status(200).json(layoutData)
    } catch (error: any) {
        res.status(400).json({ message: error.message })
    }
}
