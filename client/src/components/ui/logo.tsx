import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import logoSvg from "@/assets/logo.svg";
import faviconImage from "@/assets/favicon.png";

interface LogoProps {
  className?: string;
  /** Show only the square mark (favicon) instead of the full wordmark. Use for collapsed rails/tight spaces. */
  markOnly?: boolean;
  /** Fixed rendered height in pixels. If omitted, scales responsively across viewport breakpoints. */
  size?: number;
}

export function Logo({ className, markOnly = false, size }: LogoProps) {
  if (markOnly) {
    const px = size ?? 32;
    return (
      <Image
        src={faviconImage}
        alt="Complex"
        width={px}
        height={px}
        className={cn("shrink-0 rounded-md", className)}
        priority
      />
    );
  }

  const isFixed = size !== undefined;

  return (
    <Image
      src={logoSvg}
      alt="Complex"
      unoptimized
      style={isFixed ? { height: size, width: "auto" } : { width: "auto" }}
      className={cn(
        "shrink-0 object-contain object-left",
        !isFixed && "h-7 sm:h-8 lg:h-9",
        className
      )}
      priority
    />
  );
}

export default Logo;
