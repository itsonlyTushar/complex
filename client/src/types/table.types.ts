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
}

export interface Line {
    x1: number
    y1: number
    x2: number
    y2: number
}

export interface Table {
    id?: number;
    foodCourtId: number;
    number: string;
    occupacy: number;
    shape: string;
    createdAt?: Date;
    updatedAt?: Date;
}
