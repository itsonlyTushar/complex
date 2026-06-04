import { ColumnDef } from "@tanstack/react-table"

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export interface PlacedItem {
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    rotation?: number
    tableId?: number
    tableNumber?: string
    occupacy?: number
}

export interface Line {
    x1: number
    y1: number
    x2: number
    y2: number
}

export interface Table {
    id?: number;
    foodCourtId: string;
    number: string;
    occupacy: number;
    shape: string;
    x?: number | null;
    y?: number | null;
    rotation?: number | null;
    isPlaced?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
