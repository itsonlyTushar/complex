import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  env: {
    NEXT_EMAILJS_SERVICE_ID: process.env.NEXT_EMAILJS_SERVICE_ID,
    NEXT_EMAILJS_TEMPLATE_ID: process.env.NEXT_EMAILJS_TEMPLATE_ID,
    NEXT_EMAILJS_PUBLIC_KEY: process.env.NEXT_EMAILJS_PUBLIC_KEY,
  },
};

export default nextConfig;
// Updated local environment configuration

