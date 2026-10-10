"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

/* =========================================================================
 * CONFIGURATION
 * Edit scene elements, timings, and routing orders here.
 * ========================================================================= */
export const FOODCOURT_CONFIG = {
  timing: {
    orderInterval: 3.4, // Seconds between order starts (never > 2 concurrent)
    lineDrawDuration: 1.0, // Hairline outbound draw duration
    prepDuration: 1.0, // Shop prep fill duration
    returnDuration: 0.8, // Ready return line duration
    readyHoldDuration: 1.2, // Duration table displays "READY"
  },
  shops: [
    { id: "S1", name: "TACOS", x: 130, y: 35, w: 160, h: 44, edge: "top" },
    { id: "S2", name: "RAMEN", x: 510, y: 35, w: 160, h: 44, edge: "top" },
    {
      id: "S3",
      name: "TAPROOM",
      x: 130,
      y: 420,
      w: 160,
      h: 44,
      edge: "bottom",
    },
    { id: "S4", name: "COFFEE", x: 510, y: 420, w: 160, h: 44, edge: "bottom" },
  ],
  tables: [
    { id: "T1", x: 210, y: 190, r: 20 },
    { id: "T2", x: 400, y: 190, r: 20 },
    { id: "T3", x: 590, y: 190, r: 20 },
    { id: "T4", x: 210, y: 310, r: 20 },
    { id: "T5", x: 400, y: 310, r: 20 },
    { id: "T6", x: 590, y: 310, r: 20 },
  ],
  // Scheduled order sequence: carefully paired so overlapping paths never cross
  orders: [
    { tableId: "T1", shopId: "S1", tag: "#101 · 2 ITEMS" },
    { tableId: "T6", shopId: "S4", tag: "#102 · 1 ITEM" },
    { tableId: "T2", shopId: "S2", tag: "#103 · 3 ITEMS" },
    { tableId: "T4", shopId: "S3", tag: "#104 · 2 ITEMS" },
    { tableId: "T3", shopId: "S2", tag: "#105 · 1 ITEM" },
    { tableId: "T5", shopId: "S4", tag: "#106 · 2 ITEMS" },
  ],
};

/* Softly rounded right-angle orthogonal path generator with zero crossing */
function createOrthogonalPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  channelY: number,
  radius = 6,
) {
  // If the line is straight vertical or nearly straight, draw a clean direct line with no kinks
  if (Math.abs(startX - endX) < radius * 2) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  const isGoingDown = channelY > startY;
  const isTargetBelow = endY > channelY;
  const isGoingRight = endX > startX;

  const r1y = isGoingDown ? radius : -radius;
  const r1x = isGoingRight ? radius : -radius;
  const r2x = isGoingRight ? -radius : radius;
  const r2y = isTargetBelow ? radius : -radius;

  return [
    `M ${startX} ${startY}`,
    `L ${startX} ${channelY - r1y}`,
    `Q ${startX} ${channelY} ${startX + r1x} ${channelY}`,
    `L ${endX + r2x} ${channelY}`,
    `Q ${endX} ${channelY} ${endX} ${channelY + r2y}`,
    `L ${endX} ${endY}`,
  ].join(" ");
}

function getRoute(tableId: string, shopId: string, isReturn = false) {
  const table = FOODCOURT_CONFIG.tables.find((t) => t.id === tableId)!;
  const shop = FOODCOURT_CONFIG.shops.find((s) => s.id === shopId)!;

  const offset = isReturn ? 4 : -4;
  const isShopTop = shop.edge === "top";

  const startX = table.x + offset;
  const startY = isShopTop ? table.y - table.r : table.y + table.r;
  const targetX = shop.x + shop.w / 2 + offset;
  const targetY = isShopTop ? shop.y + shop.h : shop.y;

  // Intermediate routing channels
  const channelY = isShopTop
    ? table.y === 190
      ? 115 + offset
      : 135 + offset
    : table.y === 310
      ? 385 + offset
      : 365 + offset;

  return isReturn
    ? createOrthogonalPath(targetX, targetY, startX, startY, channelY)
    : createOrthogonalPath(startX, startY, targetX, targetY, channelY);
}

export function HairlineFoodcourt({
  className,
  embedded = false,
}: {
  className?: string;
  embedded?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wiresLayerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Static reduced-motion fallback: shows one completed order cleanly
    if (isReduced) {
      const wiresLayer = wiresLayerRef.current;
      if (wiresLayer) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        path.setAttribute("class", "fc-order-line");
        path.setAttribute("d", getRoute("T1", "S1", false));
        wiresLayer.appendChild(path);

        const packet = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        packet.setAttribute("class", "fc-order-packet");
        packet.setAttribute("cx", "206");
        packet.setAttribute("cy", "79");
        packet.setAttribute("r", "2.5");
        wiresLayer.appendChild(packet);
      }
      const s1 = container.querySelector("#fc-shop-S1");
      s1?.classList.add("is-active");
      const tag = container.querySelector("#fc-tag-S1");
      if (tag) tag.setAttribute("opacity", "1");
      const t1 = container.querySelector("#fc-table-T1");
      t1?.classList.add("is-ordering");
      return;
    }

    let orderIndex = 0;
    const activeTimelines = new Set<gsap.core.Timeline>();
    let nextTimer: gsap.core.Tween | null = null;

    // Ensure global GSAP timeline is running
    gsap.globalTimeline.resume();

    const ctx = gsap.context(() => {
      const wiresLayer = wiresLayerRef.current;
      if (!wiresLayer) return;

      function runOrder(order: (typeof FOODCOURT_CONFIG.orders)[0]) {
        const table = FOODCOURT_CONFIG.tables.find(
          (t) => t.id === order.tableId,
        );
        const shop = FOODCOURT_CONFIG.shops.find((s) => s.id === order.shopId);
        if (!table || !shop || !wiresLayer) return;

        const tableGroup = container?.querySelector(`#fc-table-${table.id}`);
        const tableLabel = container?.querySelector(`#fc-label-${table.id}`);
        const pulseRing = container?.querySelector(`#fc-pulse-${table.id}`);
        const shopGroup = container?.querySelector(`#fc-shop-${shop.id}`);
        const prepLine = container?.querySelector(`#fc-prep-${shop.id}`);
        const tag = container?.querySelector(`#fc-tag-${shop.id}`);
        const tagText = container?.querySelector(`#fc-tag-text-${shop.id}`);

        // Outbound line
        const outPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        outPath.setAttribute("class", "fc-order-line");
        outPath.setAttribute("d", getRoute(table.id, shop.id, false));
        wiresLayer.appendChild(outPath);

        // Return line
        const retPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        retPath.setAttribute("class", "fc-ready-line");
        retPath.setAttribute("d", getRoute(table.id, shop.id, true));
        retPath.setAttribute("opacity", "0");
        wiresLayer.appendChild(retPath);

        // Order packet dot
        const packet = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle",
        );
        packet.setAttribute("class", "fc-order-packet");
        packet.setAttribute("r", "2.5");
        packet.setAttribute("opacity", "0");
        wiresLayer.appendChild(packet);

        const outLen = outPath.getTotalLength();
        outPath.style.strokeDasharray = `${outLen}`;
        outPath.style.strokeDashoffset = `${outLen}`;

        const retLen = retPath.getTotalLength();
        retPath.style.strokeDasharray = `${retLen}`;
        retPath.style.strokeDashoffset = `${retLen}`;

        const tl = gsap.timeline({
          onComplete: () => {
            activeTimelines.delete(tl);
            outPath.remove();
            retPath.remove();
            packet.remove();
          },
        });
        activeTimelines.add(tl);

        // 1. Table pulse ring
        tl.add(() => {
          tableGroup?.classList.add("is-ordering");
        });

        if (pulseRing) {
          tl.fromTo(
            pulseRing,
            { attr: { r: table.r }, opacity: 0.9 },
            {
              attr: { r: table.r + 14 },
              opacity: 0,
              duration: 0.7,
              ease: "sine.out",
            },
          );
        }

        // 2. Outbound line draws + packet dot travels
        const packetProxy = { p: 0 };
        tl.to(packet, { opacity: 1, duration: 0.1 }, "<0.1");

        tl.to(
          outPath,
          {
            strokeDashoffset: 0,
            duration: FOODCOURT_CONFIG.timing.lineDrawDuration,
            ease: "power2.inOut",
          },
          "<",
        );

        tl.to(
          packetProxy,
          {
            p: 1,
            duration: FOODCOURT_CONFIG.timing.lineDrawDuration,
            ease: "power2.inOut",
            onUpdate: () => {
              const pt = outPath.getPointAtLength(packetProxy.p * outLen);
              packet.setAttribute("cx", `${pt.x}`);
              packet.setAttribute("cy", `${pt.y}`);
            },
          },
          "<",
        );

        // 3. Shop confirms + tag displays
        tl.add(() => {
          packet.setAttribute("opacity", "0");
          shopGroup?.classList.add("is-active");
          if (tagText) tagText.textContent = order.tag;
        });

        if (tag) {
          tl.to(tag, { opacity: 1, duration: 0.3, ease: "power1.out" });
        }

        // 4. Shop prep line fills along dedicated bottom rail
        if (prepLine) {
          const prepY = shop.y + shop.h - 8;
          const xEnd = shop.x + shop.w - 16;
          tl.set(prepLine, {
            attr: {
              x1: shop.x + 16,
              y1: prepY,
              x2: shop.x + 16,
              y2: prepY,
            },
            opacity: 1,
          });
          tl.to(prepLine, {
            attr: { x2: xEnd },
            duration: FOODCOURT_CONFIG.timing.prepDuration,
            ease: "power1.inOut",
          });
        }

        // 5. Return line draws in success color + table reads READY
        tl.add(() => {
          retPath.setAttribute("opacity", "1");
          packet.setAttribute("class", "fc-ready-packet");
          packet.setAttribute("opacity", "1");
          shopGroup?.classList.remove("is-active");
          shopGroup?.classList.add("is-ready");
        });

        const returnProxy = { p: 0 };
        tl.to(retPath, {
          strokeDashoffset: 0,
          duration: FOODCOURT_CONFIG.timing.returnDuration,
          ease: "power2.inOut",
        });

        tl.to(
          returnProxy,
          {
            p: 1,
            duration: FOODCOURT_CONFIG.timing.returnDuration,
            ease: "power2.inOut",
            onUpdate: () => {
              const pt = retPath.getPointAtLength(returnProxy.p * retLen);
              packet.setAttribute("cx", `${pt.x}`);
              packet.setAttribute("cy", `${pt.y}`);
            },
          },
          "<",
        );

        // Arrive at table
        tl.add(() => {
          packet.setAttribute("opacity", "0");
          tableGroup?.classList.remove("is-ordering");
          tableGroup?.classList.add("is-ready");
          if (tableLabel) tableLabel.textContent = "READY";
        });

        if (pulseRing) {
          tl.fromTo(
            pulseRing,
            { attr: { r: table.r }, opacity: 0.9, stroke: "var(--fc-success)" },
            {
              attr: { r: table.r + 14 },
              opacity: 0,
              duration: 0.7,
              ease: "sine.out",
            },
            "<",
          );
        }

        // 6. Reset to idle
        tl.to(
          [outPath, retPath],
          { opacity: 0, duration: 0.4 },
          `+=${FOODCOURT_CONFIG.timing.readyHoldDuration}`,
        );
        if (tag) tl.to(tag, { opacity: 0, duration: 0.3 }, "<");
        if (prepLine) tl.to(prepLine, { opacity: 0, duration: 0.3 }, "<");

        tl.add(() => {
          tableGroup?.classList.remove("is-ready");
          shopGroup?.classList.remove("is-ready");
          if (tableLabel) tableLabel.textContent = table.id;
        });
      }

      function scheduleNext() {
        const currentOrder = FOODCOURT_CONFIG.orders[orderIndex];
        orderIndex = (orderIndex + 1) % FOODCOURT_CONFIG.orders.length;

        runOrder(currentOrder);

        nextTimer = gsap.delayedCall(
          FOODCOURT_CONFIG.timing.orderInterval,
          scheduleNext,
        );
      }

      scheduleNext();
    }, containerRef);

    // Pause only this component's animations when off-screen or tab hidden
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          activeTimelines.forEach((t) => t.pause());
          nextTimer?.pause();
        } else if (!document.hidden) {
          activeTimelines.forEach((t) => t.resume());
          nextTimer?.resume();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(container);

    function onVisibilityChange() {
      if (document.hidden) {
        activeTimelines.forEach((t) => t.pause());
        nextTimer?.pause();
      } else {
        activeTimelines.forEach((t) => t.resume());
        nextTimer?.resume();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      activeTimelines.forEach((t) => t.kill());
      nextTimer?.kill();
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "hairline-foodcourt relative flex w-full flex-col rounded-xl border bg-card p-3 sm:p-4 select-none",
        className,
      )}
    >
      <style jsx global>{`
        .hairline-foodcourt {
          /* Adaptive CSS custom property design system */
          --fc-line: color-mix(
            in srgb,
            var(--foreground, currentColor) 22%,
            transparent
          );
          --fc-text: color-mix(
            in srgb,
            var(--foreground, currentColor) 55%,
            transparent
          );
          --fc-accent: var(--primary, currentColor);
          --fc-success: var(
            --state-ready,
            var(--success, var(--primary, currentColor))
          );
          background: transparent;
        }

        .fc-static-stroke {
          stroke: var(--fc-line);
          stroke-width: 1px;
          vector-effect: non-scaling-stroke;
          fill: none;
        }

        .fc-static-text {
          fill: var(--fc-text);
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .fc-order-line {
          stroke: var(--fc-accent);
          stroke-width: 1px;
          vector-effect: non-scaling-stroke;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .fc-ready-line {
          stroke: var(--fc-success);
          stroke-width: 1px;
          vector-effect: non-scaling-stroke;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .fc-order-packet {
          fill: var(--fc-accent);
        }

        .fc-ready-packet {
          fill: var(--fc-success);
        }

        .fc-pulse-ring {
          stroke: var(--fc-accent);
          stroke-width: 1px;
          vector-effect: non-scaling-stroke;
          fill: none;
        }

        /* Class-toggled state changes (zero JS color animating) */
        .fc-shop.is-active .fc-shop-rect {
          stroke: var(--fc-accent);
        }

        .fc-shop.is-ready .fc-shop-rect {
          stroke: var(--fc-success);
        }

        .fc-shop.is-active .fc-shop-name {
          fill: var(--fc-accent);
        }

        .fc-shop.is-ready .fc-shop-name {
          fill: var(--fc-success);
        }

        .fc-table.is-ordering .fc-table-circle {
          stroke: var(--fc-accent);
        }

        .fc-table.is-ready .fc-table-circle {
          stroke: var(--fc-success);
        }

        .fc-table.is-ordering .fc-table-label {
          fill: var(--fc-accent);
        }

        .fc-table.is-ready .fc-table-label {
          fill: var(--fc-success);
        }

        .fc-prep-bar {
          stroke: var(--fc-accent);
          stroke-width: 1px;
          vector-effect: non-scaling-stroke;
        }
      `}</style>

      {/* Responsive SVG Scene (fills parent width naturally) */}
      <div className="relative aspect-[800/500] w-full">
        <svg
          viewBox="0 0 800 500"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full block overflow-visible"
        >
          {/* Dynamic Wire Layer (Active paths & packets) */}
          <g ref={wiresLayerRef} />

          {/* Shops (4 clean rounded rectangles) */}
          <g>
            {FOODCOURT_CONFIG.shops.map((shop) => (
              <g key={shop.id} id={`fc-shop-${shop.id}`} className="fc-shop">
                {/* Shop Outline */}
                <rect
                  className="fc-shop-rect fc-static-stroke"
                  x={shop.x}
                  y={shop.y}
                  width={shop.w}
                  height={shop.h}
                  rx={6}
                />

                {/* Shop Label (cleanly positioned above the progress rail) */}
                <text
                  className="fc-shop-name fc-static-text"
                  x={shop.x + shop.w / 2}
                  y={shop.y + 18}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {shop.name}
                </text>

                {/* Faint static track rail for prep progress */}
                <line
                  className="fc-static-stroke"
                  x1={shop.x + 16}
                  y1={shop.y + shop.h - 8}
                  x2={shop.x + shop.w - 16}
                  y2={shop.y + shop.h - 8}
                  opacity="0.3"
                />

                {/* Animated Preparation Fill Line */}
                <line
                  id={`fc-prep-${shop.id}`}
                  className="fc-prep-bar"
                  x1={shop.x + 16}
                  y1={shop.y + shop.h - 8}
                  x2={shop.x + 16}
                  y2={shop.y + shop.h - 8}
                  opacity="0"
                />

                {/* Order Tag Badge */}
                <g id={`fc-tag-${shop.id}`} opacity="0">
                  <text
                    id={`fc-tag-text-${shop.id}`}
                    x={shop.x + shop.w / 2}
                    y={shop.edge === "top" ? shop.y - 10 : shop.y + shop.h + 16}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fc-static-text text-[9px] font-medium"
                    fill="var(--fc-accent)"
                  >
                    #101 · 2 ITEMS
                  </text>
                </g>
              </g>
            ))}
          </g>

          {/* Tables (6 simple circles) */}
          <g>
            {FOODCOURT_CONFIG.tables.map((table) => (
              <g
                key={table.id}
                id={`fc-table-${table.id}`}
                className="fc-table"
              >
                {/* Table Outline */}
                <circle
                  className="fc-table-circle fc-static-stroke"
                  cx={table.x}
                  cy={table.y}
                  r={table.r}
                />

                {/* Table Number Label */}
                <text
                  id={`fc-label-${table.id}`}
                  className="fc-table-label fc-static-text font-medium"
                  x={table.x}
                  y={table.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {table.id}
                </text>

                {/* Pulse Ring */}
                <circle
                  id={`fc-pulse-${table.id}`}
                  className="fc-pulse-ring"
                  cx={table.x}
                  cy={table.y}
                  r={table.r}
                  opacity="0"
                />
              </g>
            ))}
          </g>
        </svg>
      </div>

      <p className="mt-2.5 border-t pt-2.5 text-caption text-fg-tertiary">
        Place order from any table and send multiple orders to different
        restaurants/stalls.
      </p>
    </div>
  );
}
