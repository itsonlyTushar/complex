"use client"

import React, { useEffect, useRef, useState } from "react";
import { PlacedItem, Line } from "@/types/table.types";

interface TableLayoutMapProps {
    placedItems: PlacedItem[];
    lines: Line[];
    selectedItemId?: string | null;
    drawingStart?: { x: number; y: number } | null;
    currentMousePos?: { x: number; y: number } | null;
    onDragOver?: React.DragEventHandler<HTMLCanvasElement>;
    onDrop?: React.DragEventHandler<HTMLCanvasElement>;
    onMouseDown?: React.MouseEventHandler<HTMLCanvasElement>;
    onMouseMove?: React.MouseEventHandler<HTMLCanvasElement>;
    onMouseUp?: React.MouseEventHandler<HTMLCanvasElement>;
    className?: string;
}

export const TableLayoutMap = React.forwardRef<HTMLCanvasElement, TableLayoutMapProps>(
    (
        {
            placedItems,
            lines,
            selectedItemId = null,
            drawingStart = null,
            currentMousePos = null,
            onDragOver,
            onDrop,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            className
        },
        ref
    ) => {
        const localCanvasRef = useRef<HTMLCanvasElement | null>(null);
        const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

        // Sync forwarded ref with local canvas ref
        useEffect(() => {
            if (!ref) return;
            if (typeof ref === "function") {
                ref(localCanvasRef.current);
            } else {
                ref.current = localCanvasRef.current;
            }
        }, [ref]);

        // Sync canvas resolution with the parent container dynamically
        useEffect(() => {
            const canvas = localCanvasRef.current;
            if (!canvas) return;

            const parent = canvas.parentElement;
            if (!parent) return;

            const resizeObserver = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    const { width, height } = entry.contentRect;
                    setCanvasSize({ width: Math.floor(width), height: Math.floor(height) });
                }
            });

            resizeObserver.observe(parent);

            return () => {
                resizeObserver.disconnect();
            };
        }, []);

        // Drawing Loop
        useEffect(() => {
            const canvas = localCanvasRef.current;
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
                    
                    const label = item.tableNumber ? `Table ${item.tableNumber}` : "4 Seats";
                    const subLabel = item.tableNumber && item.occupacy ? `${item.occupacy} Seats` : "";
                    if (subLabel) {
                        ctx.fillText(label, 0, -6);
                        ctx.font = "normal 9px Inter, sans-serif";
                        ctx.fillStyle = "#64748b";
                        ctx.fillText(subLabel, 0, 8);
                    } else {
                        ctx.fillText(label, 0, 0);
                    }

                } else if (item.type === "table_rectangle") {
                    ctx.beginPath();
                    ctx.roundRect(-item.width / 2, -item.height / 2, item.width, item.height, 8);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "#334155";
                    ctx.font = "bold 11px Inter, sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    
                    const label = item.tableNumber ? `Table ${item.tableNumber}` : "6-8 Seats";
                    const subLabel = item.tableNumber && item.occupacy ? `${item.occupacy} Seats` : "";
                    if (subLabel) {
                        ctx.fillText(label, 0, -6);
                        ctx.font = "normal 9px Inter, sans-serif";
                        ctx.fillStyle = "#64748b";
                        ctx.fillText(subLabel, 0, 8);
                    } else {
                        ctx.fillText(label, 0, 0);
                    }

                } else if (item.type === "table_round") {
                    ctx.beginPath();
                    ctx.arc(0, 0, item.width / 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "#334155";
                    ctx.font = "bold 11px Inter, sans-serif";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    
                    const label = item.tableNumber ? `T-${item.tableNumber}` : "Round";
                    const subLabel = item.tableNumber && item.occupacy ? `${item.occupacy} S` : "";
                    if (subLabel) {
                        ctx.fillText(label, 0, -5);
                        ctx.font = "normal 8px Inter, sans-serif";
                        ctx.fillStyle = "#64748b";
                        ctx.fillText(subLabel, 0, 7);
                    } else {
                        ctx.fillText(label, 0, 0);
                    }

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
                    ctx.strokeStyle = "#f97316"; // Orange-500
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
                    ctx.strokeStyle = "#10b981"; // Emerald-500
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
                    ctx.strokeStyle = "#6366f1"; // Indigo-500
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

        }, [placedItems, canvasSize, lines, drawingStart, currentMousePos, selectedItemId]);

        return (
            <div className="w-full h-full border border-muted rounded-xl relative overflow-hidden bg-muted/5">
                <canvas
                    ref={localCanvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    className={`w-full h-full block ${className || ""}`}
                />
            </div>
        );
    }
);

TableLayoutMap.displayName = "TableLayoutMap";
