# Design Schema

## Stack: Next.js + Tailwind CSS

---

## 1. Tailwind Config — `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#114236",
        accent: "#c6e366",
        surface: "#ffffff",
        bg: "#f8f4ee",
      },
      fontFamily: {
        heading: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Heading scale
        h1: [
          "clamp(2.4rem, 4vw, 3.6rem)",
          { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "700" },
        ],
        h2: [
          "clamp(1.8rem, 3vw, 2.6rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h3: [
          "1.15rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        // Body scale
        "body-lg": ["1rem", { lineHeight: "1.75" }],
        body: ["0.9375rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        label: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
        eyebrow: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      borderRadius: {
        card: "12px",
        btn: "6px",
        badge: "100px",
        icon: "10px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(17,66,54,0.06)",
        "card-hover": "0 12px 32px rgba(17,66,54,0.10)",
        cta: "0 16px 48px rgba(17,66,54,0.22)",
        btn: "0 8px 24px rgba(17,66,54,0.18)",
      },
      spacing: {
        // Section padding
        "section-x": "4rem", // 64px desktop
        "section-y": "5rem", // 80px desktop
        "section-x-sm": "1.5rem", // 24px mobile
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 2. Global CSS — `app/globals.css`

```css
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600&display=swap");

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: #114236;
    --color-accent: #c6e366;
    --color-surface: #ffffff;
    --color-bg: #f8f4ee;
  }

  html {
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    @apply bg-bg text-primary font-body;
  }

  h1,
  h2 {
    @apply font-heading font-bold;
  }

  h3,
  h4,
  h5,
  h6 {
    @apply font-body font-semibold;
  }

  /* Remove all default focus rings; add intentional ones */
  *:focus-visible {
    @apply outline-2 outline-offset-2 outline-accent;
  }
}

@layer components {
  /* ── Buttons ─────────────────────────────────────────── */

  .btn-primary {
    @apply inline-flex items-center justify-center
           bg-primary text-bg
           px-[30px] py-[14px]
           rounded-btn font-body text-[0.9rem] font-semibold
           transition-all duration-150
           hover:-translate-y-0.5 hover:shadow-btn
           focus-visible:outline-accent;
  }

  .btn-ghost {
    @apply inline-flex items-center justify-center
           bg-transparent text-primary
           border border-[1.5px] border-primary
           px-[28px] py-[13px]
           rounded-btn font-body text-[0.9rem] font-medium
           transition-colors duration-150
           hover:bg-primary/5;
  }

  .btn-accent {
    @apply inline-flex items-center justify-center
           bg-accent text-primary
           px-[28px] py-[14px]
           rounded-btn font-body text-[0.875rem] font-bold
           transition-opacity duration-150
           hover:opacity-90;
  }

  .btn-outline-light {
    @apply inline-flex items-center justify-center
           bg-transparent text-bg
           border border-[1.5px] border-bg/35
           px-[28px] py-[13px]
           rounded-btn font-body text-[0.875rem] font-semibold
           transition-colors duration-150
           hover:bg-bg/8;
  }

  /* ── Cards ───────────────────────────────────────────── */

  .card {
    @apply bg-surface rounded-card shadow-card
           text-primary;
  }

  .card-hover {
    @apply transition-all duration-200
           hover:-translate-y-1 hover:shadow-card-hover;
  }

  /* Feature card with left-accent border on hover */
  .feature-card {
    @apply card card-hover relative overflow-hidden
           p-9;
  }

  .feature-card::before {
    content: "";
    @apply absolute top-0 left-0 w-[3px] h-0 bg-accent
           transition-all duration-300;
  }

  .feature-card:hover::before {
    @apply h-full;
  }

  /* ── Badges ──────────────────────────────────────────── */

  .badge {
    @apply inline-flex items-center gap-2
           border border-primary rounded-badge
           px-3.5 py-1
           font-body text-label font-semibold uppercase tracking-[0.08em]
           text-primary bg-transparent;
  }

  /* Accent-filled variant (e.g. pricing "most popular") */
  .badge-accent {
    @apply badge bg-accent border-accent text-primary;
  }

  /* ── Section tag (eyebrow above headings) ────────────── */

  .section-tag {
    @apply badge mb-4;
  }

  /* ── Eyebrow with leading line ───────────────────────── */

  .eyebrow {
    @apply inline-flex items-center gap-2.5
           font-body text-eyebrow font-semibold uppercase
           text-primary/60 mb-5;
  }

  .eyebrow::before {
    content: "";
    @apply block w-6 h-[2px] bg-accent;
  }

  /* ── Accent underline on headings ────────────────────── */

  .accent-underline {
    @apply relative inline-block;
  }

  .accent-underline::after {
    content: "";
    @apply absolute left-0 bottom-[3px]
           w-full h-[4px] bg-accent rounded-sm -z-10;
  }

  /* ── Stat / metric card ──────────────────────────────── */

  .stat-card {
    @apply card p-7;
  }

  .stat-value {
    @apply font-heading font-bold text-[2.4rem] leading-none mb-1.5;
  }

  .stat-label {
    @apply font-body text-label font-semibold uppercase text-primary/50 mb-2.5;
  }

  .stat-delta {
    @apply font-body text-[0.8rem] font-semibold
           bg-accent text-primary
           inline-block px-2 py-0.5 rounded;
  }

  /* ── Pricing card variants ───────────────────────────── */

  .pricing-card {
    @apply card p-9;
  }

  .pricing-card-featured {
    @apply bg-primary text-bg rounded-card p-9 shadow-cta relative -top-2;
  }

  /* ── Nav ─────────────────────────────────────────────── */

  .nav-link {
    @apply font-body text-[0.875rem] font-medium text-primary/70
           no-underline transition-opacity duration-150
           hover:text-primary/100;
  }

  /* ── CTA band ────────────────────────────────────────── */

  .cta-band {
    @apply bg-primary text-bg
           rounded-card p-16
           flex items-center justify-between gap-10;
  }

  /* ── Icon wrapper ────────────────────────────────────── */

  .icon-wrap {
    @apply w-11 h-11 rounded-icon bg-bg
           flex items-center justify-center mb-5;
  }
}

@layer utilities {
  /* Convenience opacity text helpers */
  .text-muted {
    @apply text-primary/65;
  }
  .text-dimmed {
    @apply text-primary/50;
  }
  .text-ghost {
    @apply text-primary/40;
  }

  /* Section padding utility */
  .section-pad {
    @apply px-16 py-20 max-w-[1200px] mx-auto;
  }

  @screen lg {
    .section-pad {
      @apply px-16 py-20;
    }
  }

  @screen md {
    .section-pad {
      @apply px-6 py-16;
    }
  }
}
```

---

## 3. Typography Reference

| Token     | Font             | Size              | Weight  | Use                     |
| --------- | ---------------- | ----------------- | ------- | ----------------------- |
| `h1`      | Playfair Display | clamp(2.4–3.6rem) | 700     | Page hero titles        |
| `h2`      | Playfair Display | clamp(1.8–2.6rem) | 700     | Section headings        |
| `h3`      | Inter            | 1.15rem           | 600     | Card headings           |
| `body-lg` | Inter            | 1rem              | 400     | Hero descriptions       |
| `body`    | Inter            | 0.9375rem         | 400     | General body copy       |
| `body-sm` | Inter            | 0.875rem          | 400     | Card body, feature text |
| `label`   | Inter            | 0.75rem           | 600     | Stat labels, metadata   |
| `eyebrow` | Inter            | 0.75rem           | 600     | Section eyebrow tags    |
| Buttons   | Inter            | 0.875–0.9rem      | 600–700 | All CTAs                |

---

## 4. Color Token Reference

| Token     | Hex       | Tailwind class                | Use                                            |
| --------- | --------- | ----------------------------- | ---------------------------------------------- |
| `primary` | `#114236` | `text-primary` / `bg-primary` | All text, nav, buttons, borders                |
| `accent`  | `#c6e366` | `text-accent` / `bg-accent`   | Underlines, deltas, featured badges, mini bars |
| `surface` | `#ffffff` | `bg-surface`                  | Card backgrounds                               |
| `bg`      | `#f8f4ee` | `bg-bg`                       | Page background, icon wrappers                 |

---

## 5. Component Usage Patterns

### Page layout wrapper

```tsx
// app/layout.tsx
<body className="bg-bg text-primary font-body antialiased">{children}</body>
```

### Section scaffold

```tsx
<section className="section-pad">
  <div className="mb-12">
    <span className="section-tag">Features</span>
    <h2 className="font-heading text-h2 mt-2">Section heading</h2>
    <p className="text-body-lg text-muted mt-2.5 max-w-lg">Subheading copy.</p>
  </div>
  {/* content */}
</section>
```

### Hero heading with accent underline

```tsx
<h1 className="font-heading text-h1 text-primary mb-6">
  Build products that <span className="accent-underline">feel considered</span>
</h1>
```

### Button group

```tsx
<div className="flex items-center gap-3 flex-wrap">
  <button className="btn-primary">Get started</button>
  <button className="btn-ghost">Learn more</button>
</div>
```

### Card

```tsx
<div className="card card-hover p-9">
  <div className="icon-wrap">
    <Icon className="w-5 h-5 stroke-primary" />
  </div>
  <h3 className="font-heading text-h3 mb-2.5">Card title</h3>
  <p className="text-body-sm text-muted">Card description.</p>
</div>
```

### Badge / tag

```tsx
<span className="badge">Status</span>
<span className="badge-accent">Most popular</span>
```

### Stat card

```tsx
<div className="stat-card">
  <p className="stat-label">Revenue</p>
  <p className="stat-value">$48,290</p>
  <span className="stat-delta">+12.4%</span>
</div>
```

### Pricing card (featured)

```tsx
<div className="pricing-card-featured">
  <span className="badge-accent mb-5">Most popular</span>
  <p className="font-body text-label uppercase text-bg/60 mb-3">Professional</p>
  <p className="font-heading text-[2.6rem] font-bold leading-none">$49</p>
  {/* ... */}
  <button className="btn-accent w-full mt-8">Start trial</button>
</div>
```

### CTA band

```tsx
<div className="cta-band mx-16 my-20 rounded-card">
  <div>
    <h2 className="font-heading text-h2 text-bg max-w-lg">CTA heading</h2>
    <p className="text-body text-bg/65 mt-2.5">Supporting copy.</p>
  </div>
  <div className="flex gap-3 flex-shrink-0">
    <button className="btn-accent">Primary CTA</button>
    <button className="btn-outline-light">Secondary</button>
  </div>
</div>
```

---

## 6. Animation Rules

| Context                                          | Tool          | Rule                                                                                        |
| ------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------- |
| Public pages (landing, menu, order confirmation) | Framer Motion | Use `motion.div` with `initial`, `animate`, `transition`. Stagger children with `variants`. |
| Admin / dashboard pages                          | None          | Zero animations. No transitions beyond instant state changes.                               |
| Hover states (all pages)                         | Tailwind CSS  | `hover:` utilities only — translate, shadow, opacity.                                       |
| Page load reveals                                | Framer Motion | One orchestrated stagger per section. `fadeUp` pattern: `y: 24 → 0`, `opacity: 0 → 1`.      |

### Standard Framer Motion variants (public pages)

```ts
// lib/motion.ts
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
```

```tsx
// Usage
<motion.div variants={stagger} initial="hidden" animate="show">
  <motion.h1 variants={fadeUp}>Heading</motion.h1>
  <motion.p variants={fadeUp}>Body</motion.p>
  <motion.div variants={fadeUp}>
    <button className="btn-primary">CTA</button>
  </motion.div>
</motion.div>
```

---

## 7. File Structure Convention

```
/app
  layout.tsx          ← font imports, body classes
  globals.css         ← all @layer base/components/utilities
  page.tsx            ← public landing (Framer Motion OK)
  /dashboard
    layout.tsx        ← NO Framer Motion
    page.tsx

/components
  /ui
    Button.tsx        ← btn-primary, btn-ghost, btn-accent variants
    Card.tsx          ← card + optional hover
    Badge.tsx         ← badge + badge-accent
    StatCard.tsx
    SectionHeader.tsx ← section-tag + h2 + subtext
  /layout
    Nav.tsx
    Footer.tsx
  /sections           ← public-page sections (may use Framer Motion)
    Hero.tsx
    Features.tsx
    Testimonials.tsx
    Pricing.tsx
    CTABand.tsx

/lib
  motion.ts           ← shared Framer Motion variants
```

---

## 8. Rules Checklist

- No emojis anywhere — not in JSX, not in copy, not in placeholder text
- All text color defaults to `text-primary` (`#114236`) unless inside `.bg-primary` containers
- Card text inside dark containers uses `text-bg` (`#f8f4ee`)
- Framer Motion imports are only in files under `/app/(public)` or `/components/sections`
- Dashboard and admin layouts must never import `framer-motion`
- Accent (`#c6e366`) is used only as: underline decoration, delta badges, featured card CTAs, mini bar highlights, eyebrow lines — not as a background for large areas
- No filler sections — every section must map to a user decision or information need
