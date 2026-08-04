import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ReactQueryProvider from "@/lib/react-query";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const defaultUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : "https://complexapp.food";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Complex - Sports Booking & Management Made Easy",
    template: "%s | Complex",
  },
  description: "Seamless sports court reservations, facility scheduling, and management application built with ease.",
  keywords: [
    "sports booking",
    "court reservation",
    "sports management",
    "facility scheduling",
    "Complex app",
    "venue booking",
  ],
  authors: [{ name: "Tushar Soni" }],
  creator: "Tushar Soni",
  publisher: "Complex",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: defaultUrl,
    siteName: "Complex",
    title: "Complex - Sports Booking & Management Made Easy",
    description: "Seamless sports court reservations, facility scheduling, and management application built with ease.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Complex - Sports Booking & Management Made Easy",
    description: "Seamless sports court reservations, facility scheduling, and management application built with ease.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googled1924988dfb7311c",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster closeButton richColors position="top-right" />
          </ThemeProvider>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}

