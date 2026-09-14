"use client"

import React, { useEffect, useState } from "react";
import { TableLayoutMap } from "@/components/court/TableLayoutMap";
import { useGetLayout } from "@/hooks/queries/useTableQuery";
import { PlacedItem, Line } from "@/types/table.types";
import { Loader2 } from "lucide-react";

const Page = () => {
    const { data: layoutData, isLoading: isLayoutLoading } = useGetLayout();
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
    const [lines, setLines] = useState<Line[]>([]);

    const mapShapeToType = (shape: string) => {
        switch (shape.toLowerCase()) {
            case "square":
                return "table_square";
            case "rectangle":
                return "table_rectangle";
            case "circle":
            case "round":
                return "table_round";
            default:
                return "table_square";
        }
    };

    useEffect(() => {
        if (layoutData) {
            setLines(layoutData.layout?.walls || []);
            const infra = layoutData.layout?.infrastructure || [];
            const placedTables = (layoutData.tables || [])
                .filter((t) => t.isPlaced && t.x !== null && t.y !== null)
                .map((t) => {
                    const mappedType = mapShapeToType(t.shape);
                    let width = 60;
                    let height = 60;
                    if (mappedType === "table_rectangle") {
                        width = 110;
                        height = 55;
                    } else if (mappedType === "table_round") {
                        width = 65;
                        height = 65;
                    }
                    return {
                        id: `table_${t.id}`,
                        type: mappedType,
                        x: t.x!,
                        y: t.y!,
                        width,
                        height,
                        rotation: t.rotation || 0,
                        tableId: t.id,
                        tableNumber: t.number,
                        occupacy: t.occupacy
                    };
                });
            setPlacedItems([...infra, ...placedTables]);
        }
    }, [layoutData]);

    return (
        <div className="flex flex-col gap-6 py-6">
            <section>
                <h1 className="text-3xl font-semibold tracking-tight">Tables</h1>
                <p className="text-muted-foreground mt-1">
                    View and deliver the food efficiently with the table map
                </p>
            </section>

            <section className="flex-1 border rounded-xl p-4 shadow-sm bg-card min-h-[580px] flex flex-col justify-center">
                {isLayoutLoading ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground animate-pulse">
                            Loading Table Layout Map...
                        </p>
                    </div>
                ) : (
                    <div className="w-full h-[550px] relative">
                        <TableLayoutMap placedItems={placedItems} lines={lines} />
                    </div>
                )}
            </section>
        </div>
    );
};

export default Page;