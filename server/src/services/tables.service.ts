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

export const fetchTables = async (foodCourtId: number) => {
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
