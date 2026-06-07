"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative flex items-center justify-center">
      {/* Emerald Void */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            color: "#ffffff",
            fontSize: "clamp(2rem, 5vw, 4rem)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textAlign: "center",
            margin: 0,
            padding: "0 1rem",
          }}
        >
          Complex is live to use
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <Button asChild size="lg">
            <Link href="/login">Login</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

