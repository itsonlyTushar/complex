import { prisma } from "../config/db.js";
import type { Table } from "../types/tables.types.js";

export const addTable = async (data: Omit<Table, "id"  | 'createdAt' | 'updatedAt'>) => {
    return await prisma.table.create({
        data: {
            number: data.number,
            occupacy: data.occupacy,
            shape: data.shape,
            foodCourtId: data.foodCourtId
        }
    });
}

export const fetchTables = async (foodCourtId: string) => {
    return await prisma.table.findMany({
        where: { foodCourtId }
    });
}

export const updateTable = async (id: number, data: Partial<Omit<Table, "id">>) => {
    return await prisma.table.update({
        where: {id},
        data
    })
}

export const deleteTable = async (id: number) => {
    return await prisma.table.delete({
        where: {id}
    })
}

export const saveLayout = async (
    foodCourtId: string,
    walls: any[],
    infrastructure: any[],
    placedTables: { id: number; x: number; y: number; rotation: number }[]
) => {
    return await prisma.$transaction(async (tx) => {
        // 1. Save walls and infrastructure on the FoodCourt
        await tx.foodCourt.update({
            where: { id: foodCourtId },
            data: {
                layout: {
                    walls,
                    infrastructure,
                },
            },
        });

        // 2. Reset all tables of the food court to unplaced
        await tx.table.updateMany({
            where: { foodCourtId },
            data: {
                isPlaced: false,
                x: null,
                y: null,
                rotation: 0,
            },
        });

        // 3. Update the placed tables with their coordinates
        for (const pt of placedTables) {
            await tx.table.update({
                where: {
                    id: pt.id,
                    foodCourtId,
                },
                data: {
                    isPlaced: true,
                    x: pt.x,
                    y: pt.y,
                    rotation: pt.rotation,
                },
            });
        }
    });
};

export const fetchLayout = async (foodCourtId: string) => {
    const foodCourt = await prisma.foodCourt.findUnique({
        where: { id: foodCourtId },
        select: { layout: true },
    });

    const tables = await prisma.table.findMany({
        where: { foodCourtId },
        orderBy: { number: "asc" }
    });

    return {
        layout: foodCourt?.layout || null,
        tables,
    };
};

