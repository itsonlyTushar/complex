export interface Table {
    id?: number;
    foodCourtId: number;
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