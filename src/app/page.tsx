"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RiTwitterXLine } from "react-icons/ri";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-black relative flex items-center justify-center overflow-hidden font-body">
      {/* Stellar Mist */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 140% 50% at 15% 60%, rgba(124, 58, 237, 0.11), transparent 48%),
            radial-gradient(ellipse 90% 80% at 85% 25%, rgba(245, 101, 101, 0.09), transparent 58%),
            radial-gradient(ellipse 120% 65% at 40% 90%, rgba(34, 197, 94, 0.13), transparent 52%),
            radial-gradient(ellipse 100% 45% at 70% 5%, rgba(251, 191, 36, 0.07), transparent 42%),
            radial-gradient(ellipse 80% 75% at 90% 80%, rgba(168, 85, 247, 0.10), transparent 55%),
            #000000
          `,
        }}
      />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl"
      >
        <motion.div variants={fadeUp} className="badge mb-8 flex items-center">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Under Development
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-h1 font-heading text-white mb-6"
        >
          Something Great <br />
          <span className="accent-underline text-[#114236]">is Brewing</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-body-lg text-white/50 mb-10 max-w-lg"
        >
          Currently building this product solo. If you'd like to collaborate
          <br className="hidden sm:block" /> or contribute, feel free to reach
          out let's build something amazing together.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="https://github.com/itsonlyTushar"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-light flex items-center"
          >
            <Github className="mr-2.5 h-5 w-5" />
            GitHub
          </Link>
          <Link
            href="https://x.com/ts28_7"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-light flex items-center"
          >
            <RiTwitterXLine className="mr-2.5 h-5 w-5" />
            Twitter
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-20 text-white/20 text-label uppercase tracking-widest"
        >
          © {new Date().getFullYear()} itsonlyTushar
        </motion.div>
      </motion.div>
    </div>
  );
}
