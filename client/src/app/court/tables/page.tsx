"use client"

import { Button } from "@/components/ui/button";
import { PlacedItem, Line } from "@/types/table.types";
import { RotateCw, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const Tables = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
    const [lines, setLines] = useState<Line[]>([]);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
    
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

    // Sync canvas resolution with the parent container dynamically
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setCanvasSize({ width, height });
            }
        });

        resizeObserver.observe(parent);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

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

    // Drawing Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw elegant designer grid lines
        ctx.strokeStyle = "rgba(0, 0, 0, 0.04)";
        ctx.lineWidth = 1;
        const gridSize = 40;

        // Draw vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw all finalized sketched lines/walls
        ctx.strokeStyle = "#475569"; // slate-600
        ctx.lineWidth = 3;
        ctx.lineCap = "round";

        lines.forEach((line) => {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        });

        // Draw live active line preview if drawing
        if (drawingStart && currentMousePos) {
            ctx.beginPath();
            ctx.setLineDash([6, 6]);
            ctx.strokeStyle = "#3b82f6"; // blue-500
            ctx.lineWidth = 2;
            ctx.moveTo(drawingStart.x, drawingStart.y);
            ctx.lineTo(currentMousePos.x, currentMousePos.y);
            ctx.stroke();
            ctx.setLineDash([]); // Reset line dash
        }

        // Draw placed elements (Square, Rectangle, and Round tables, and Infrastructure)
        placedItems.forEach((item) => {
            const isSelectedThis = item.id === selectedItemId;

            ctx.save();
            // Move origin to item center and apply its individual rotation
            ctx.translate(item.x, item.y);
            ctx.rotate(((item.rotation || 0) * Math.PI) / 180);

            const chairRadius = 7;

            // Draw Chairs centered at (0, 0)
            if (item.type === "table_square") {
                ctx.fillStyle = "#cbd5e1"; // slate-300
                ctx.strokeStyle = "#64748b"; // slate-500
                ctx.lineWidth = 1.5;

                const dist = item.width / 2 + 8;
                const chairs = [
                    { cx: 0, cy: -dist },
                    { cx: 0, cy: dist },
                    { cx: -dist, cy: 0 },
                    { cx: dist, cy: 0 },
                ];
                chairs.forEach((c) => {
                    ctx.beginPath();
                    ctx.arc(c.cx, c.cy, chairRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                });
            } else if (item.type === "table_rectangle") {
                ctx.fillStyle = "#cbd5e1";
                ctx.strokeStyle = "#64748b";
                ctx.lineWidth = 1.5;

                const distY = item.height / 2 + 8;
                const distX = item.width / 2 + 8;
                const chairs = [
                    { cx: -30, cy: -distY },
                    { cx: 0, cy: -distY },
                    { cx: 30, cy: -distY },
                    { cx: -30, cy: distY },
                    { cx: 0, cy: distY },
                    { cx: 30, cy: distY },
                    { cx: -distX, cy: 0 },
                    { cx: distX, cy: 0 },
                ];
                chairs.forEach((c) => {
                    ctx.beginPath();
                    ctx.arc(c.cx, c.cy, chairRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                });
            } else if (item.type === "table_round") {
                ctx.fillStyle = "#cbd5e1";
                ctx.strokeStyle = "#64748b";
                ctx.lineWidth = 1.5;

                const radialDist = item.width / 2 + 9;
                const numChairs = 5;
                for (let i = 0; i < numChairs; i++) {
                    const angle = (i * 2 * Math.PI) / numChairs - Math.PI / 2;
                    const cx = Math.cos(angle) * radialDist;
                    const cy = Math.sin(angle) * radialDist;
                    ctx.beginPath();
                    ctx.arc(cx, cy, chairRadius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
            } else if (item.type === "bar") {
                ctx.fillStyle = "#94a3b8"; // slate-400
                ctx.strokeStyle = "#475569";
                ctx.lineWidth = 1.5;
                const stools = [
                    { cx: -45, cy: item.height / 2 + 8 },
                    { cx: -15, cy: item.height / 2 + 8 },
                    { cx: 15, cy: item.height / 2 + 8 },
                    { cx: 45, cy: item.height / 2 + 8 },
                ];
                stools.forEach((s) => {
                    ctx.beginPath();
                    ctx.arc(s.cx, s.cy, 6, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                });
            }

            // Draw Selected Indicator Outline Dash
            if (isSelectedThis) {
                ctx.save();
                ctx.strokeStyle = "rgba(59, 130, 246, 0.45)";
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.roundRect(-item.width / 2 - 12, -item.height / 2 - 12, item.width + 24, item.height + 24, 10);
                ctx.stroke();
                ctx.restore();
            }

            // Draw Main shapes centered at (0, 0)
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = isSelectedThis ? "#3b82f6" : "#1e293b";
            ctx.lineWidth = 2.5;

            if (item.type === "table_square") {
                ctx.beginPath();
                ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#334155";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("4 Seats", 0, 0);

            } else if (item.type === "table_rectangle") {
                ctx.beginPath();
                ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 8);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#334155";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("6-8 Seats", 0, 0);

            } else if (item.type === "table_round") {
                ctx.beginPath();
                ctx.arc(0, 0, item.width / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = "#334155";
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("Round", 0, 0);

            } else if (item.type === "bar") {
                ctx.fillStyle = "#334155"; // Slate-700
                ctx.beginPath();
                ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 4);
                ctx.fill();
                ctx.stroke();

                // Double inner line representing counter trim
                ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.roundRect(-item.width / 2 + 4, -item.height / 2 + 4, item.width - 8, item.height - 8, 2);
                ctx.stroke();

                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("BAR COUNTER", 0, 0);

            } else if (item.type === "kitchen") {
                ctx.fillStyle = "rgba(249, 115, 22, 0.07)"; // Soft orange backdrop
                ctx.strokeStyle = isSelectedThis ? "#3b82f6" : "#f97316"; // Orange-500
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 6);
                ctx.fill();
                ctx.stroke();

                // Draw floor plan double-cross lines
                ctx.strokeStyle = "rgba(249, 115, 22, 0.2)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(-item.width / 2, -item.height / 2);
                ctx.lineTo(item.width / 2, item.height / 2);
                ctx.moveTo(item.width / 2, -item.height / 2);
                ctx.lineTo(-item.width / 2, item.height / 2);
                ctx.stroke();

                ctx.fillStyle = "#c2410c"; // Orange-700
                ctx.font = "bold 12px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("KITCHEN ZONE", 0, 0);

            } else if (item.type === "gate") {
                ctx.fillStyle = "rgba(16, 185, 129, 0.08)"; // Soft emerald backdrop
                ctx.strokeStyle = isSelectedThis ? "#3b82f6" : "#10b981"; // Emerald-500
                ctx.lineWidth = 2;
                ctx.setLineDash([4, 4]);
                ctx.beginPath();
                ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 4);
                ctx.fill();
                ctx.stroke();
                ctx.setLineDash([]); // Reset dash

                // Draw swing arc
                ctx.strokeStyle = "#10b981";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(-item.width / 2, item.height / 2, item.height, -Math.PI / 2, 0, false);
                ctx.stroke();

                ctx.fillStyle = "#047857"; // Emerald-700
                ctx.font = "bold 10px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("🚪 ENTRANCE", 8, 0);

            } else if (item.type === "shop") {
                // Draw Shop / Stall
                ctx.fillStyle = "rgba(99, 102, 241, 0.07)"; // Soft indigo backdrop
                ctx.strokeStyle = isSelectedThis ? "#3b82f6" : "#6366f1"; // Indigo-500
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 6);
                ctx.fill();
                ctx.stroke();

                // Draw a nice striped awning pattern at the front of the shop (top edge)
                ctx.save();
                ctx.beginPath();
                ctx.rect(-item.width / 2, -item.height / 2, item.width, 12);
                ctx.clip();

                const stripeWidth = 12;
                for (let sx = -item.width / 2; sx < item.width / 2; sx += stripeWidth) {
                    ctx.fillStyle = sx % (stripeWidth * 2) === 0 ? "#6366f1" : "#ffffff";
                    ctx.fillRect(sx, -item.height / 2, stripeWidth, 12);
                }
                ctx.restore();

                // Draw outline for the awning block
                ctx.strokeStyle = "#4f46e5"; // Indigo-600
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.rect(-item.width / 2, -item.height / 2, item.width, 12);
                ctx.stroke();

                ctx.fillStyle = "#4338ca"; // Indigo-700
                ctx.font = "bold 11px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("SHOP / STALL", 0, item.height / 2 - 22);
            }

            ctx.restore();
        });

    }, [placedItems, canvasSize, lines, drawingStart, currentMousePos, draggedItemId, selectedItemId]);

    // Drag and Drop Elements Handlers (Palette to Canvas)
    const handleDragStart = (e: React.DragEvent, itemType: string) => {
        e.dataTransfer.setData("itemType", itemType);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const itemType = e.dataTransfer.getData("itemType");
        if (!itemType) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Custom default bounds for each element type
        let width = 60;
        let height = 60;

        if (itemType === "table_rectangle") {
            width = 110;
            height = 55;
        } else if (itemType === "table_round") {
            width = 65;
            height = 65;
        } else if (itemType === "bar") {
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

    // Locate coordinates to render floating contextual menu options
    const selectedItem = placedItems.find((item) => item.id === selectedItemId);

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
                        <Button>Save Layout</Button>
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
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80">Tables</span>
                                    
                                    {/* Square Table (4) */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "table_square")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs"
                                    >
                                        <span>Square Table (4)</span>
                                        <div className="w-5 h-5 border-2 border-slate-700 bg-slate-100 rounded" />
                                    </div>

                                    {/* Rectangle Table (6-8) */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "table_rectangle")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs"
                                    >
                                        <span>Rect Table (6-8)</span>
                                        <div className="w-8 h-5 border-2 border-slate-700 bg-slate-100 rounded" />
                                    </div>

                                    {/* Round Table */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "table_round")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs"
                                    >
                                        <span>Round Table</span>
                                        <div className="w-5 h-5 border-2 border-slate-700 bg-slate-100 rounded-full" />
                                    </div>
                                </div>

                                {/* Infrastructure Category */}
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground/80">Infrastructure</span>
                                    
                                    {/* Bar Counter */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "bar")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs"
                                    >
                                        <span>Bar Counter</span>
                                        <div className="w-8 h-3.5 border-2 border-slate-700 bg-slate-400 rounded-sm" />
                                    </div>

                                    {/* Kitchen Zone */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "kitchen")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs"
                                    >
                                        <span>Kitchen Zone</span>
                                        <div className="w-8 h-5.5 border-2 border-dashed border-orange-500 bg-orange-50 rounded-sm" />
                                    </div>

                                    {/* Entrance Gate */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "gate")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs"
                                    >
                                        <span>Entrance Gate</span>
                                        <div className="w-7 h-4 border-2 border-dashed border-emerald-500 bg-emerald-50 rounded-sm" />
                                    </div>

                                    {/* Shop Stall */}
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, "shop")}
                                        className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 cursor-grab rounded-lg flex items-center justify-between select-none font-semibold transition-all shadow-sm active:cursor-grabbing group text-xs"
                                    >
                                        <span>Shop Stall</span>
                                        <div className="w-6 h-5.5 border-2 border-indigo-500 bg-indigo-50 rounded-sm flex flex-col justify-between overflow-hidden">
                                            <div className="h-1.5 bg-indigo-500 w-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 px-3 border-2 border-dashed border-muted-foreground/10 rounded-lg text-muted-foreground text-xs leading-relaxed">
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
                    <div className="flex-1 h-[550px] border-2 border-dashed border-muted rounded-xl shadow-sm relative overflow-hidden bg-muted/5">
                        <canvas
                            ref={canvasRef}
                            width={canvasSize.width}
                            height={canvasSize.height}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            className={`w-full h-full block ${
                                toolMode === "draw" ? "cursor-crosshair" : draggedItemId ? "cursor-grabbing" : "cursor-default"
                            }`}
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
