"use client"

import { Button } from "@/components/ui/button";
import { PlacedItem, Line } from "@/types/table.types";
import { RotateCw, Trash2, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useGetLayout } from "@/hooks/queries/useTableQuery";
import { useSaveLayout } from "@/hooks/mutations/useTableMutation";
import { toast } from "@/lib/toast";
import { TableLayoutMap } from "@/components/court/TableLayoutMap";

const Tables = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
    const [lines, setLines] = useState<Line[]>([]);
    
    // "select" to manage/delete/move elements, "draw" to sketch walls/lines
    const [toolMode, setToolMode] = useState<"select" | "draw">("select");
    const [drawingStart, setDrawingStart] = useState<{ x: number; y: number } | null>(null);
    const [currentMousePos, setCurrentMousePos] = useState<{ x: number; y: number } | null>(null);

    // States for moving placed elements inside the canvas
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null);

    // State for the currently selected item to show the rotate/delete toolbar
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    // React Query layout and table fetching / saving hooks
    const { data: layoutData, isLoading: isLayoutLoading } = useGetLayout();
    const { mutateAsync: saveLayout, isPending: isSaving } = useSaveLayout();

    // Map database shape names to internal canvas layout item types
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

    // Populate lines and placedItems on component mount / query fetch
    useEffect(() => {
        if (layoutData) {
            // Set walls
            setLines(layoutData.layout?.walls || []);

            // Set infrastructure
            const infra = layoutData.layout?.infrastructure || [];

            // Map database tables that are placed
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

    // Keyboard listener for deleting selected elements
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!selectedItemId) return;

            // Prevent accidental deletion if the user is typing in a form input/textarea
            const activeElement = document.activeElement;
            if (
                activeElement && 
                (activeElement.tagName === "INPUT" || 
                 activeElement.tagName === "TEXTAREA" || 
                 activeElement.getAttribute("contenteditable") === "true")
            ) {
                return;
            }

            if (e.key === "Delete" || e.key === "Backspace") {
                setPlacedItems((prev) => prev.filter((item) => item.id !== selectedItemId));
                setSelectedItemId(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedItemId]);

    // Drag and Drop Elements Handlers (Palette to Canvas)
    const handleDragStart = (e: React.DragEvent, itemType: string) => {
        e.dataTransfer.setData("itemType", itemType);
    };

    const handleDragStartTable = (e: React.DragEvent, tableId: number) => {
        e.dataTransfer.setData("tableId", String(tableId));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const itemType = e.dataTransfer.getData("itemType");
        const tableIdStr = e.dataTransfer.getData("tableId");

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tableIdStr) {
            // Dragged a specific table configuration
            const tableId = Number(tableIdStr);
            const table = (layoutData?.tables || []).find((t) => t.id === tableId);
            if (!table) return;

            const mappedType = mapShapeToType(table.shape);
            let width = 60;
            let height = 60;

            if (mappedType === "table_rectangle") {
                width = 110;
                height = 55;
            } else if (mappedType === "table_round") {
                width = 65;
                height = 65;
            }

            const newItem: PlacedItem = {
                id: `table_${table.id}`,
                type: mappedType,
                x,
                y,
                width,
                height,
                rotation: 0,
                tableId: table.id,
                tableNumber: table.number,
                occupacy: table.occupacy
            };
            setPlacedItems((prev) => [...prev, newItem]);
            setSelectedItemId(newItem.id); // Auto-select placed table!
            return;
        }

        if (!itemType) return;

        // Custom default bounds for infrastructure
        let width = 60;
        let height = 60;

        if (itemType === "bar") {
            width = 140;
            height = 40;
        } else if (itemType === "kitchen") {
            width = 160;
            height = 100;
        } else if (itemType === "gate") {
            width = 80;
            height = 30;
        } else if (itemType === "shop") {
            width = 100;
            height = 70;
        }

        const newItem: PlacedItem = {
            id: crypto.randomUUID(),
            type: itemType,
            x,
            y,
            width,
            height,
            rotation: 0 // Default starting rotation
        };
        setPlacedItems((prev) => [...prev, newItem]);
        setSelectedItemId(newItem.id); // Auto-select newly placed item!
    };

    // Tool Actions: Rotate and Delete Selected Item
    const handleRotateItem = (itemId: string) => {
        setPlacedItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, rotation: ((item.rotation || 0) + 45) % 360 } // Rotate by 45 degrees
                    : item
            )
        );
    };

    const handleDeleteItem = (itemId: string) => {
        setPlacedItems((prev) => prev.filter((item) => item.id !== itemId));
        if (selectedItemId === itemId) {
            setSelectedItemId(null);
        }
    };

    // Interactive Mouse Handlers (Supporting both sketching and repositioning elements)
    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setMouseDownPos({ x, y });

        if (toolMode === "select") {
            // Find if clicked inside an element boundary
            const clickedItem = placedItems.find((item) => {
                const left = item.x - item.width / 2;
                const right = item.x + item.width / 2;
                const top = item.y - item.height / 2;
                const bottom = item.y + item.height / 2;
                return x >= left && x <= right && y >= top && y <= bottom;
            });

            if (clickedItem) {
                setDraggedItemId(clickedItem.id);
                setDragOffset({ x: x - clickedItem.x, y: y - clickedItem.y });
            }
        } else if (toolMode === "draw") {
            setDrawingStart({ x, y });
            setCurrentMousePos({ x, y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (toolMode === "select" && draggedItemId) {
            // Update selected item coordinates smoothly as it is dragged
            setPlacedItems((prev) =>
                prev.map((item) =>
                    item.id === draggedItemId
                        ? { ...item, x: x - dragOffset.x, y: y - dragOffset.y }
                        : item
                )
            );
        } else if (toolMode === "draw" && drawingStart) {
            setCurrentMousePos({ x, y });
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (toolMode === "select") {
            if (draggedItemId) {
                // If it was a clean micro-click (barely any dragging motion), interpret it as a Select action
                if (mouseDownPos) {
                    const dx = x - mouseDownPos.x;
                    const dy = y - mouseDownPos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 4) {
                        setSelectedItemId(draggedItemId);
                    }
                }
                setDraggedItemId(null);
            } else {
                // Clicked on empty canvas background: deselect
                if (mouseDownPos) {
                    const dx = x - mouseDownPos.x;
                    const dy = y - mouseDownPos.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 4) {
                        setSelectedItemId(null);
                    }
                }
            }
        } else if (toolMode === "draw" && drawingStart && currentMousePos) {
            const dx = currentMousePos.x - drawingStart.x;
            const dy = currentMousePos.y - drawingStart.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Save line if drag gesture is long enough
            if (distance > 5) {
                const newLine: Line = {
                    x1: drawingStart.x,
                    y1: drawingStart.y,
                    x2: currentMousePos.x,
                    y2: currentMousePos.y,
                };
                setLines((prev) => [...prev, newLine]);
            }
            setDrawingStart(null);
            setCurrentMousePos(null);
        }
        setMouseDownPos(null);
    };

    // Save Table Layout to API
    const handleSaveLayout = async () => {
        try {
            const walls = lines;
            const infrastructure = placedItems.filter((item) => item.tableId === undefined);
            const placedTables = placedItems
                .filter((item) => item.tableId !== undefined)
                .map((item) => ({
                    id: item.tableId!,
                    x: item.x,
                    y: item.y,
                    rotation: item.rotation || 0
                }));

            await saveLayout({
                walls,
                infrastructure,
                placedTables
            });
            toast.success("Layout saved successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to save layout");
        }
    };

    // Locate coordinates to render floating contextual menu options
    const selectedItem = placedItems.find((item) => item.id === selectedItemId);

    // Compute which tables are not yet placed on the canvas
    const placedTableIds = new Set(
        placedItems
            .filter((item) => item.tableId !== undefined)
            .map((item) => item.tableId)
    );
    const availableTables = (layoutData?.tables || []).filter(
        (t) => !placedTableIds.has(t.id)
    );

    // Show premium loader if fetching initial layout data
    if (isLayoutLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        Loading Table Map Layout...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="py-6 px-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight">Table Map View</h1>

                    {/* Mode Toggle Controls */}
                    <div className="flex gap-4 items-center">
                        <div className="flex bg-muted p-1 rounded-lg border">
                            <button
                                onClick={() => {
                                    setToolMode("select");
                                    setSelectedItemId(null);
                                }}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    toolMode === "select"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Table Editor
                            </button>
                            <button
                                onClick={() => {
                                    setToolMode("draw");
                                    setSelectedItemId(null);
                                }}
                                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    toolMode === "draw"
                                        ? "bg-background shadow-sm text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                Draw Walls
                            </button>
                        </div>
                        <Button onClick={handleSaveLayout} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Layout"
                            )}
                        </Button>
                    </div>
                </div>

                {/* Main Workspace Layout */}
                <div className="flex gap-6 mt-6">
                    {/* Elements Sidebar */}
                    <div className="w-64 flex flex-col gap-4 p-4 border rounded-xl shadow-sm bg-card h-[550px]">
                        <div>
                            <h3 className="font-semibold text-lg">Palette</h3>
                            <p className="text-xs text-muted-foreground">
                                {toolMode === "select" 
                                    ? "Drag elements onto grid, or select/drag on canvas to reposition" 
                                    : "Switch back to Table Editor to manage elements"}
                            </p>
                        </div>

                        <hr className="border-muted-foreground/10" />

                        {toolMode === "select" ? (
                            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5">
                                {/* Tables Category */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80">
                                        Configured Tables
                                    </span>
                                    
                                    {availableTables.length === 0 ? (
                                        <div className="p-3 text-center border border-dashed rounded-lg text-muted-foreground text-xs bg-muted/20">
                                            {layoutData?.tables?.length === 0 ? (
                                                <div>
                                                    <p className="font-semibold mb-1 text-slate-700">No tables configured</p>
                                                    <p className="text-slate-500 mb-2">Configure tables in settings first.</p>
                                                    <a 
                                                        href="/court/settings/tables" 
                                                        className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1"
                                                    >
                                                        Manage Tables &rarr;
                                                    </a>
                                                </div>
                                            ) : (
                                                <p className="font-semibold text-slate-500">All tables have been placed.</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            {availableTables.map((table) => {
                                                const type = mapShapeToType(table.shape);
                                                return (
                                                    <div
                                                        key={table.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStartTable(e, table.id!)}
                                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs hover:border-slate-300"
                                                    >
                                                        <div className="flex flex-col gap-0.5">
                                                            <span>Table #{table.number}</span>
                                                            <span className="text-[9px] text-muted-foreground font-normal">
                                                                {table.occupacy} Seats • {table.shape}
                                                            </span>
                                                        </div>
                                                        {type === "table_square" && (
                                                            <div className="w-5 h-5 border-2 border-slate-700 bg-slate-100 rounded" />
                                                        )}
                                                        {type === "table_rectangle" && (
                                                            <div className="w-7 h-4 border-2 border-slate-700 bg-slate-100 rounded" />
                                                        )}
                                                        {type === "table_round" && (
                                                            <div className="w-5 h-5 border-2 border-slate-700 bg-slate-100 rounded-full" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Infrastructure Category */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80">Infrastructure</span>
                                    
                                    {/* Bar Counter */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "bar")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs hover:border-slate-300"
                                    >
                                        <span>Bar Counter</span>
                                        <div className="w-8 h-3.5 border-2 border-slate-700 bg-slate-400 rounded-sm" />
                                    </div>

                                    {/* Kitchen Zone */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "kitchen")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs hover:border-slate-300"
                                    >
                                        <span>Kitchen Zone</span>
                                        <div className="w-8 h-5.5 border-2 border-dashed border-orange-500 bg-orange-50 rounded-sm" />
                                    </div>

                                    {/* Entrance Gate */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "gate")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs hover:border-slate-300"
                                    >
                                        <span>Entrance Gate</span>
                                        <div className="w-7 h-4 border-2 border-dashed border-emerald-500 bg-emerald-50 rounded-sm" />
                                    </div>

                                    {/* Shop Stall */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "shop")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs hover:border-slate-300"
                                    >
                                        <span>Shop Stall</span>
                                        <div className="w-6 h-5.5 border-2 border-indigo-500 bg-indigo-50 rounded-sm flex flex-col justify-between overflow-hidden">
                                            <div className="h-1.5 bg-indigo-500 w-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 px-3 border-2 border-dashed border-muted-foreground/10 rounded-lg text-muted-foreground text-xs leading-relaxed bg-muted/5">
                                Wall sketching active. Click and drag on the canvas to draw walls.
                            </div>
                        )}

                        {/* Reset Actions */}
                        <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-muted-foreground/10">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setPlacedItems([]);
                                    setSelectedItemId(null);
                                }}
                                className="w-full text-xs font-semibold"
                                disabled={placedItems.length === 0}
                            >
                                Clear All Elements
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLines([])}
                                className="w-full text-xs font-semibold"
                                disabled={lines.length === 0}
                            >
                                Clear All Walls
                            </Button>
                        </div>
                    </div>

                    {/* Canvas Area Container */}
                    <div className="flex-1 h-[550px] relative">
                        <TableLayoutMap
                            ref={canvasRef}
                            placedItems={placedItems}
                            lines={lines}
                            selectedItemId={selectedItemId}
                            drawingStart={drawingStart}
                            currentMousePos={currentMousePos}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            className={toolMode === "draw" ? "cursor-crosshair" : draggedItemId ? "cursor-grabbing" : "cursor-default"}
                        />

                        {/* Contextual Toolbar Overlay for Selected Items */}
                        {toolMode === "select" && selectedItem && (
                            <div 
                                className="absolute bg-white border border-slate-200 shadow-lg rounded-lg flex items-center gap-1.5 p-1 select-none animate-in fade-in zoom-in-95 duration-100 z-10"
                                style={{
                                    left: `${selectedItem.x}px`,
                                    top: `${selectedItem.y - Math.max(selectedItem.width, selectedItem.height) / 2 - 38}px`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <button
                                    onClick={() => handleRotateItem(selectedItem.id)}
                                    className="flex items-center justify-center p-1.5 hover:bg-slate-100 text-xs font-semibold rounded transition-all text-slate-700 hover:text-slate-900 gap-1.5"
                                    title="Rotate 45°"
                                >
                                    <RotateCw className="w-3.5 h-3.5" />
                                    <span className="text-[10px]">Rotate 45°</span>
                                </button>
                                <div className="w-[1px] h-4 bg-slate-200" />
                                <button
                                    onClick={() => handleDeleteItem(selectedItem.id)}
                                    className="flex items-center justify-center p-1.5 hover:bg-red-50 text-red-600 hover:text-red-700 text-xs font-semibold rounded transition-all gap-1.5"
                                    title="Delete Item"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span className="text-[10px]">Delete</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Tables;
