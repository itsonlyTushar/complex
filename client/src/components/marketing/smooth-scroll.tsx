"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/*
  Smooth scrolling is scoped to the public pages only. The operator and vendor
  portals are dense tools used mid-service, where hijacking the scroll would put
  distance between an input and the row someone is trying to reach.

  Lenis honours prefers-reduced-motion on its own (respectReducedMotion defaults
  to true), so a reduced-motion visitor tracks their input device 1:1.
*/
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.12,
        smoothWheel: true,
        /* Lenis owns anchor jumps so in-page links ease instead of snapping.
           The offset clears the 56px sticky nav. */
        anchors: { offset: -72 },
      }}
    >
      {children}
    </ReactLenis>
  );
}
