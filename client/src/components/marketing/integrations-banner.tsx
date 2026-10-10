"use client";

interface RestaurantBrand {
  name: string;
  category: string;
  renderLogo: () => React.ReactNode;
}

const RESTAURANTS: RestaurantBrand[] = [
  {
    name: "Osteria Romana",
    category: "Italian Trattoria",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="size-4 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12A10 10 0 0 1 12 2Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-[17px] font-semibold italic tracking-wide"
        >
          Osteria Romana
        </span>
      </div>
    ),
  },
  {
    name: "SMOKEHOUSE 77",
    category: "Craft BBQ & Grill",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="size-4 shrink-0 opacity-80" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c.5 3-1.5 5-1.5 7 0 2.5 2 4 2 6 0 3-2 5-4.5 5S3.5 18 3.5 15c0-4 4-6 4-9 0-1.5-.5-2.8-1-4 3 1 6.5 3 6.5 7 0 1-.2 2-.5 3 1.5-.8 3-2.5 3-5 0-2.5-1.5-4-3.5-5z" />
        </svg>
        <span
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          className="text-[21px] font-bold tracking-[0.14em]"
        >
          SMOKEHOUSE 77
        </span>
      </div>
    ),
  },
  {
    name: "Bao & Broth",
    category: "Asian Hawker",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="size-4 shrink-0 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 11h16a8 8 0 0 1-16 0Z" />
          <path d="M12 3v4M8 4v3M16 4v3" />
        </svg>
        <span
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          className="text-[16px] font-bold tracking-tight uppercase"
        >
          BAO &amp; BROTH
        </span>
      </div>
    ),
  },
  {
    name: "Maison Blanche",
    category: "French Bistro",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <span className="text-xs opacity-60">✦</span>
        <span
          style={{ fontFamily: "'Cinzel', serif" }}
          className="text-[14px] font-semibold tracking-[0.24em] uppercase"
        >
          Maison Blanche
        </span>
      </div>
    ),
  },
  {
    name: "Taquería del Sol",
    category: "Mexican Street Food",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="size-4 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <span
          style={{ fontFamily: "'DM Serif Display', serif" }}
          className="text-[17px] font-normal tracking-wide"
        >
          Taquería del Sol
        </span>
      </div>
    ),
  },
  {
    name: "TOKYO DRIFT",
    category: "Ramen & Izakaya",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <span
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="text-[15px] font-extrabold tracking-wider uppercase"
        >
          TOKYO DRIFT
        </span>
        <span className="rounded-xs border border-current px-1 py-0.2 text-[9px] font-mono font-bold tracking-widest opacity-80">
          RAMEN
        </span>
      </div>
    ),
  },
  {
    name: "Rustica Woodfired",
    category: "Artisan Pizza",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="size-4 shrink-0 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="m12 3 6 15-6-3-6 3 6-15Z" />
        </svg>
        <span
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-[16px] font-bold tracking-tight"
        >
          Rustica Pizza Co.
        </span>
      </div>
    ),
  },
  {
    name: "KÖTT & ELD",
    category: "Nordic Open Fire",
    renderLogo: () => (
      <div className="flex items-center gap-1.5">
        <span
          style={{ fontFamily: "'Oswald', sans-serif" }}
          className="text-[18px] font-semibold tracking-[0.16em] uppercase"
        >
          KÖTT &amp; ELD
        </span>
        <span className="text-[11px] font-mono opacity-50">/ CPH</span>
      </div>
    ),
  },
  {
    name: "Little Green Café",
    category: "Specialty Coffee",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="size-4 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 14 0c0 7-7 7-7 7Z" />
          <path d="M11 13v7" />
        </svg>
        <span
          style={{ fontFamily: "'Caveat', cursive" }}
          className="text-[20px] font-bold tracking-wide"
        >
          Little Green Café
        </span>
      </div>
    ),
  },
  {
    name: "BAR LUPO",
    category: "Aperitivo & Cicchetti",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <span
          style={{ fontFamily: "'Bodoni Moda', serif" }}
          className="text-[16px] font-semibold tracking-[0.22em] uppercase"
        >
          BAR LUPO
        </span>
        <span className="size-1 rounded-full bg-current opacity-60" />
        <span className="text-[10px] font-mono tracking-widest opacity-60">MILANO</span>
      </div>
    ),
  },
  {
    name: "THE DAILY GRIND",
    category: "Roastery & Bakery",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <svg className="size-4 shrink-0 opacity-75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
        <span
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
          className="text-[14px] font-semibold tracking-wider uppercase"
        >
          The Daily Grind
        </span>
      </div>
    ),
  },
  {
    name: "Mercado Verde",
    category: "Open Food Market",
    renderLogo: () => (
      <div className="flex items-center gap-2">
        <span
          style={{ fontFamily: "'Syne', sans-serif" }}
          className="text-[15px] font-bold tracking-tight uppercase"
        >
          MERCADO VERDE
        </span>
        <span className="text-xs opacity-60">✦</span>
      </div>
    ),
  },
];

const STREAM = [...RESTAURANTS, ...RESTAURANTS, ...RESTAURANTS];

export function IntegrationsBanner() {
  return (
    <section
      aria-label="Partner Kitchens & Stalls"
      className="border-y border-border/60 bg-surface-sunken/40 py-6 sm:py-7 overflow-hidden"
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bodoni+Moda:ital,opsz,wght@0,6..96,600;1,6..96,400&family=Caveat:wght@600;700&family=Cinzel:wght@600;700&family=DM+Serif+Display:ital@0;1&family=Oswald:wght@600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Space+Grotesk:wght@600;700&family=Syne:wght@700;800&display=swap");

        @keyframes scroll-trail {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        .marquee-trail {
          animation: scroll-trail 36s linear infinite;
          will-change: transform;
        }

        .marquee-trail-container:hover .marquee-trail {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-trail {
            animation: none !important;
          }
        }
      `}</style>

      {/* Subtle contextual label */}
      <div className="mb-4 text-center">
        <p className="text-micro font-medium uppercase tracking-[0.2em] text-fg-tertiary">
          Powering kitchens, food halls &amp; independent stalls everywhere
        </p>
      </div>

      {/* Infinite Horizontal Restaurant Brand Marquee Trail */}
      <div className="marquee-trail-container relative w-full overflow-hidden">
        {/* Left & Right ambient fade gradient masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-16 sm:w-28 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-16 sm:w-28 bg-gradient-to-l from-background via-background/80 to-transparent" />

        <div className="marquee-trail flex w-max items-center gap-12 sm:gap-16 lg:gap-20 py-1">
          {STREAM.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center shrink-0 text-fg-secondary/75 transition-all duration-200 ease-out hover:text-foreground hover:scale-[1.03]"
              title={`${item.name} (${item.category})`}
            >
              {item.renderLogo()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
