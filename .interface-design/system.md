# Complex — interface design system

**Steel and signal.** Live-service software for multi-vendor food halls.

## Who this is for

A food-court operator or restaurant vendor, usually standing, often mid-rush, on
a wall- or counter-mounted screen — or the same person at a desk afterwards doing
settlement. The job is *see what is happening and act*. The feel is a **calm
instrument**: quiet by default, loud only when something needs attention.

## Two contexts, not one theme with a toggle

- **Kitchen mode (dark)** is native, not an inversion. Real kitchen display
  systems are near-black and high contrast because they are read at six feet in a
  hot, bright room.
- **Office mode (light)** is for settlement, menus, accounts and reporting.

Both palettes are authored independently in `client/src/app/globals.css`. Never
derive one by flipping the other.

## Colour

Neutrals are cool stainless/concrete. **One brand hue only** — an instrument blue
for action, selection, focus and links.

Hue always carries meaning; it is never decorative:

| Token | Means |
| --- | --- |
| `state-idle` | in flight, nothing wrong |
| `state-ready` | done / positive delta |
| `state-aging` | needs attention soon |
| `state-late` | over threshold / destructive / failed |

Each has a matching `-bg` tint for chips and banners. Because green, amber and red
are spoken for, **never use them for emphasis, decoration or branding.** A control
that is merely destructive-capable (log out) stays neutral and only turns
`state-late` on hover.

Rejected on purpose: indigo-on-white-cards-with-soft-shadows, four equal KPI
cards per page, zebra tables with a kebab menu per row.

## Typography

**IBM Plex Sans** for UI text, **IBM Plex Mono** for data. Loaded at 400/500/600
only — do not use `font-bold` (700) or `font-extrabold` (800); they synthesise.

The rule: **mono carries every number and identifier** — order IDs, table numbers,
money, ticket ages, counts. Put `data-numeric` on the element; a base-layer rule
applies mono plus `tabular-nums` so figures never reflow as they tick.

Scale (ratio ~1.2, 14px base): `micro 11 · caption 12 · body 14 · lead 16 ·
h3 18 · h2 22 · h1 28 · display 36`. Hierarchy comes from size **and** weight
**and** colour together — `foreground / fg-secondary / fg-tertiary /
muted-foreground` are four distinct tiers, use them.

`.eyebrow` is the standard small uppercase label above a data block.

## Depth — one strategy

Borders plus surface shift for structure. Shadow is reserved strictly for things
that genuinely lift (popovers, dialogs, dropdowns) via `.surface-overlay`.

Surfaces step by a few percent of lightness: `background → surface-raised →
surface-overlay`. Inputs are **sunken**, not raised — `--control` is darker than
its card in kitchen mode. Sidebar shares the canvas background; only a hairline
border separates it. Dark mode collapses elevation to rings, since depth shadows
do not read on near-black.

## Spacing and density

4px grid. Cloud-Console dense: card padding 16px, control height 32–36px, rows
~40px, section gaps 20–24px. Page shells use `px-4 pb-8` with a sticky 48px header.

## Component patterns

- **Button primary** — 36px h · 16px px · 6px radius · 14px/500 · `active:scale-[0.97]` · 140ms `--ease-out`
- **Card** — 10px radius · 16px padding · border, no shadow
- **Input** — 36px h · 6px radius · `--control` fill · focus swaps border to ring + 2px ring at 35%
- **Sidebar item** — 32px h · tinted `bg-accent` + `accent-foreground` when active, never a solid brand fill
- **`.state-rail`** — 3px flush leading edge on any row/card carrying state; square corners
- **`.state-chip`** — tinted pill, `micro` weight 500, for status and ticket age

### The signature

The **split ticket**: one guest cart fans out to N vendors, each segment carrying
its own state. An operator sees every segment; a vendor sees theirs solid and the
rest ghosted.

**Ticket age is a live pressure signal**, not metadata — computed from
`createdAt`, escalating `idle → aging (6m) → late (12m)`, re-rendered on an
interval so it keeps moving while the screen sits open.

## Charts

Recharts paints through SVG **presentation attributes**, which do not resolve CSS
custom properties in any current browser. Never pass `var(--x)` to `fill`/`stroke`
props. Use inline `style={{ fill: "var(--…)" }}` or the class rules in
`globals.css` (`.recharts-cartesian-axis-tick text`, `.recharts-tooltip-cursor`).
Disable load animation on dashboards — a chart seen fifty times a day should not
replay. Emphasise one series/bar with `chart-1`; let the rest recede at ~40%.

## Non-negotiables

- Every interactive element needs default, hover, active, focus, disabled.
- Every data view needs loading, empty **and error** states — an unreachable API
  must never render as a reassuring empty state.
- Use the existing shadcn primitives and Radix/Base UI; never hand-roll a control.
- Bind to tokens. No raw hex, no `bg-white`, no `text-slate-500`.
- Never animate `width`/`height`/`margin`; only `transform` and `opacity`.
- Respect `prefers-reduced-motion` (handled globally).
