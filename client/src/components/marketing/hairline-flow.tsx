"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

/* =========================================================================
 * APPLICATION FLOW CONFIGURATION
 * 8-step timeline alternating top and bottom along a central hairline spine.
 * Customize labels, subheadings, or step count here.
 * ========================================================================= */
export interface FlowStep {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  side: "top" | "bottom";
  icon: "qr" | "cart" | "card" | "kitchen" | "timer" | "monitor" | "bell" | "payout";
}

export const APPLICATION_FLOW_CONFIG = {
  timing: {
    loopDuration: 12.0,    // Total cycle duration (seconds)
    travelEase: "none",
  },
  steps: [
    {
      id: "step-1",
      number: "01",
      title: "Table QR Scan",
      subtitle: "Instant browser menu",
      side: "top",
      icon: "qr",
    },
    {
      id: "step-2",
      number: "02",
      title: "Multi-Stall Cart",
      subtitle: "One cart, every kitchen",
      side: "bottom",
      icon: "cart",
    },
    {
      id: "step-3",
      number: "03",
      title: "Split Checkout",
      subtitle: "Single Stripe payment",
      side: "top",
      icon: "card",
    },
    {
      id: "step-4",
      number: "04",
      title: "Kitchen Routing",
      subtitle: "Stalls only see their lines",
      side: "bottom",
      icon: "kitchen",
    },
    {
      id: "step-5",
      number: "05",
      title: "Live Ticket Clocks",
      subtitle: "Escalates as it ages",
      side: "top",
      icon: "timer",
    },
    {
      id: "step-6",
      number: "06",
      title: "Floor Overview",
      subtitle: "Real-time venue load",
      side: "bottom",
      icon: "monitor",
    },
    {
      id: "step-7",
      number: "07",
      title: "Ready Alert",
      subtitle: "Instant text notification",
      side: "top",
      icon: "bell",
    },
    {
      id: "step-8",
      number: "08",
      title: "Auto Settlements",
      subtitle: "Stripe Connect payout",
      side: "bottom",
      icon: "payout",
    },
  ] as FlowStep[],
};

/* 1px Minimalist Hairline Icons (vector-effect: non-scaling-stroke) */
function renderFlowIcon(type: FlowStep["icon"], cx: number, cy: number) {
  switch (type) {
    case "qr":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <rect x={cx - 7} y={cy - 7} width="5" height="5" />
          <rect x={cx + 2} y={cy - 7} width="5" height="5" />
          <rect x={cx - 7} y={cy + 2} width="5" height="5" />
          <line x1={cx + 2} y1={cy + 2} x2={cx + 7} y2={cy + 2} />
          <line x1={cx + 5} y1={cy + 5} x2={cx + 7} y2={cy + 7} />
          <line x1={cx + 2} y1={cy + 7} x2={cx + 2} y2={cy + 5} />
        </g>
      );
    case "cart":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <path d={`M ${cx - 7} ${cy - 5} L ${cx - 5} ${cy - 5} L ${cx - 2} ${cy + 3} L ${cx + 6} ${cy + 3} L ${cx + 8} ${cy - 2} L ${cx - 4} ${cy - 2}`} />
          <circle cx={cx - 1} cy={cy + 6} r="1" />
          <circle cx={cx + 5} cy={cy + 6} r="1" />
        </g>
      );
    case "card":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <rect x={cx - 7} y={cy - 5} width="14" height="10" rx="1.5" />
          <line x1={cx - 7} y1={cy - 1} x2={cx + 7} y2={cy - 1} />
          <line x1={cx - 4} y1={cy + 2} x2={cx - 2} y2={cy + 2} />
        </g>
      );
    case "kitchen":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <path d={`M ${cx - 6} ${cy + 5} L ${cx + 6} ${cy + 5} L ${cx + 6} ${cy + 1} Q ${cx + 7} ${cy - 2} ${cx + 4} ${cy - 5} Q ${cx} ${cy - 7} ${cx - 4} ${cy - 5} Q ${cx - 7} ${cy - 2} ${cx - 6} ${cy + 1} Z`} />
          <line x1={cx - 6} y1={cy + 2} x2={cx + 6} y2={cy + 2} />
        </g>
      );
    case "timer":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <circle cx={cx} cy={cy + 1} r="6" />
          <line x1={cx} y1={cy + 1} x2={cx} y2={cy - 2} />
          <line x1={cx} y1={cy + 1} x2={cx + 2} y2={cy + 1} />
          <line x1={cx - 2} y1={cy - 6} x2={cx + 2} y2={cy - 6} />
        </g>
      );
    case "monitor":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <rect x={cx - 7} y={cy - 5} width="14" height="9" rx="1" />
          <line x1={cx - 2} y1={cy + 4} x2={cx - 3} y2={cy + 7} />
          <line x1={cx + 2} y1={cy + 4} x2={cx + 3} y2={cy + 7} />
          <line x1={cx - 4} y1={cy + 7} x2={cx + 4} y2={cy + 7} />
        </g>
      );
    case "bell":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <path d={`M ${cx - 5} ${cy + 3} Q ${cx - 4} ${cy - 4} ${cx} ${cy - 5} Q ${cx + 4} ${cy - 4} ${cx + 5} ${cy + 3} Z`} />
          <line x1={cx - 7} y1={cy + 3} x2={cx + 7} y2={cy + 3} />
          <path d={`M ${cx - 1.5} ${cy + 4.5} Q ${cx} ${cy + 6} ${cx + 1.5} ${cy + 4.5}`} />
        </g>
      );
    case "payout":
      return (
        <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none">
          <circle cx={cx} cy={cy} r="6.5" />
          <path d={`M ${cx} ${cy - 3.5} L ${cx} ${cy + 3.5}`} />
          <path d={`M ${cx - 2} ${cy - 2} Q ${cx + 2} ${cy - 2.5} ${cx} ${cy} Q ${cx - 2} ${cy + 2.5} ${cx + 2} ${cy + 2}`} />
        </g>
      );
  }
}

export function HairlineFlow({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = APPLICATION_FLOW_CONFIG.steps;
  const total = steps.length;

  // Geometry coordinates
  const width = 1000;
  const baselineY = 140;
  const startX = 65;
  const endX = 935;
  const stepSpacing = (endX - startX) / (total - 1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Static reduced-motion fallback: all nodes active
    if (isReduced) {
      container.querySelectorAll(".flow-step-node").forEach((el) => el.classList.add("is-active"));
      return;
    }

    let flowTimeline: gsap.core.Timeline | null = null;

    const ctx = gsap.context(() => {
      const packet = container.querySelector("#flow-traveling-packet");
      const baselineActive = container.querySelector("#flow-active-spine");

      flowTimeline = gsap.timeline({
        repeat: -1,
        defaults: { ease: "none" },
      });

      const proxy = { p: 0 };

      flowTimeline.to(proxy, {
        p: 1,
        duration: APPLICATION_FLOW_CONFIG.timing.loopDuration,
        onUpdate: () => {
          const currentX = startX + proxy.p * (endX - startX);

          if (packet) {
            packet.setAttribute("cx", `${currentX}`);
          }

          if (baselineActive) {
            baselineActive.setAttribute("x2", `${currentX}`);
          }

          // Activate node as packet crosses its X coord
          steps.forEach((_, index) => {
            const nodeX = startX + index * stepSpacing;
            const nodeEl = container.querySelector(`#flow-node-${index}`);

            if (currentX >= nodeX - 4) {
              nodeEl?.classList.add("is-active");
            } else {
              nodeEl?.classList.remove("is-active");
            }
          });
        },
      });
    }, containerRef);

    // Pause only this component when off-screen or tab hidden
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          flowTimeline?.pause();
        } else if (!document.hidden) {
          flowTimeline?.resume();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    function onVisibilityChange() {
      if (document.hidden) {
        flowTimeline?.pause();
      } else {
        flowTimeline?.resume();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      flowTimeline?.kill();
      ctx.revert();
    };
  }, [endX, startX, stepSpacing, steps]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "hairline-flow relative flex w-full flex-col select-none",
        className
      )}
    >
      <style jsx global>{`
        .hairline-flow {
          /* Color system adapting to app theme tokens */
          --fc-line: color-mix(in srgb, var(--foreground, currentColor) 22%, transparent);
          --fc-text: color-mix(in srgb, var(--foreground, currentColor) 60%, transparent);
          --fc-accent: var(--primary, currentColor);
          --fc-success: var(--state-ready, var(--success, var(--primary, currentColor)));
          background: transparent;
          font-family: inherit;
        }

        .flow-line {
          stroke: var(--fc-line);
          stroke-width: 1px;
          vector-effect: non-scaling-stroke;
          fill: none;
        }

        .flow-active-line {
          stroke: var(--fc-accent);
          stroke-width: 1px;
          vector-effect: non-scaling-stroke;
          fill: none;
        }

        .flow-packet {
          fill: var(--fc-accent);
        }

        .flow-num {
          fill: var(--fc-text);
          font-family: inherit;
          font-size: 10px;
          letter-spacing: 0.08em;
          font-weight: 500;
          transition: fill 0.25s ease;
        }

        .flow-title {
          fill: var(--fc-text);
          font-family: inherit;
          font-size: 11px;
          letter-spacing: -0.01em;
          font-weight: 500;
          transition: fill 0.25s ease;
        }

        .flow-subtitle {
          fill: color-mix(in srgb, var(--foreground, currentColor) 35%, transparent);
          font-family: inherit;
          font-size: 9px;
          letter-spacing: 0.02em;
          transition: fill 0.25s ease;
        }

        .flow-icon-wrap {
          color: var(--fc-text);
          transition: color 0.25s ease, transform 0.25s ease;
        }

        /* Active / Illuminated State when packet passes node */
        .flow-step-node.is-active .flow-node-circle {
          stroke: var(--fc-accent);
        }

        .flow-step-node.is-active .flow-node-core {
          fill: var(--fc-accent);
        }

        .flow-step-node.is-active .flow-stem {
          stroke: var(--fc-accent);
        }

        .flow-step-node.is-active .flow-num {
          fill: var(--fc-accent);
        }

        .flow-step-node.is-active .flow-title {
          fill: var(--foreground, currentColor);
        }

        .flow-step-node.is-active .flow-icon-wrap {
          color: var(--fc-accent);
        }
      `}</style>

      {/* Responsive SVG Canvas */}
      <div className="relative aspect-[1000/280] w-full">
        <svg
          viewBox="0 0 1000 280"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full block overflow-visible"
        >
          {/* Subtle Faint Background Floor Dots */}
          <defs>
            <pattern id="flow-grid-dots" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle
                cx="20"
                cy="20"
                r="0.75"
                fill="color-mix(in srgb, var(--foreground, currentColor) 10%, transparent)"
              />
            </pattern>
          </defs>
          <rect width="1000" height="280" fill="url(#flow-grid-dots)" />

          {/* Main Horizontal Baseline Spine */}
          <line
            x1="20"
            y1={baselineY}
            x2="980"
            y2={baselineY}
            className="flow-line"
          />

          {/* Active Highlight Spine (Fills in as packet travels) */}
          <line
            id="flow-active-spine"
            x1={startX}
            y1={baselineY}
            x2={startX}
            y2={baselineY}
            className="flow-active-line"
          />

          {/* Traveling Packet Signal */}
          <circle
            id="flow-traveling-packet"
            cx={startX}
            cy={baselineY}
            r="3"
            className="flow-packet"
          />

          {/* Nodes, Stems, Icons & Labels */}
          {steps.map((step, index) => {
            const x = startX + index * stepSpacing;
            const isTop = step.side === "top";

            // Geometry offsets
            const stemStartY = isTop ? baselineY - 5 : baselineY + 5;
            const stemEndY = isTop ? baselineY - 45 : baselineY + 45;
            const iconY = isTop ? stemEndY - 15 : stemEndY + 15;
            const titleY = isTop ? iconY - 18 : iconY + 18;
            const subtitleY = isTop ? titleY - 12 : titleY + 12;
            const numY = isTop ? baselineY + 16 : baselineY - 12;

            return (
              <g
                key={step.id}
                id={`flow-node-${index}`}
                className={cn(
                  "flow-step-node cursor-pointer transition-opacity duration-200",
                  activeStep !== null && activeStep !== index && "opacity-40"
                )}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Baseline Anchor Circle */}
                <circle
                  cx={x}
                  cy={baselineY}
                  r="5"
                  className="flow-node-circle flow-line"
                />
                <circle
                  cx={x}
                  cy={baselineY}
                  r="1.5"
                  className="flow-node-core"
                  fill="var(--fc-text)"
                />

                {/* Step Number (01, 02...) */}
                <text
                  x={x}
                  y={numY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="flow-num"
                >
                  {step.number}
                </text>

                {/* Vertical Stem */}
                <line
                  x1={x}
                  y1={stemStartY}
                  x2={x}
                  y2={stemEndY}
                  className="flow-stem flow-line"
                />

                {/* Hairline Icon */}
                <g className="flow-icon-wrap">
                  {renderFlowIcon(step.icon, x, iconY)}
                </g>

                {/* Step Title Label */}
                <text
                  x={x}
                  y={titleY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="flow-title"
                >
                  {step.title}
                </text>

                {/* Step Subtitle */}
                {step.subtitle && (
                  <text
                    x={x}
                    y={subtitleY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="flow-subtitle"
                  >
                    {step.subtitle}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
