import type { Request, Response } from "express"
import { addTable, fetchTables } from "../../services/tables.service.js"

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