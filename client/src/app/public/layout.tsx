import type { Viewport } from "next";

// Guests order from their phones. viewport-fit=cover lets the fixed bottom bars
// pad themselves clear of the iPhone home indicator via env(safe-area-inset-*).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
