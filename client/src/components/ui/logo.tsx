import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";
import faviconImage from "@/assets/favicon.png";

interface LogoProps {
  className?: string;
  /** Show only the square mark (favicon) instead of the full wordmark. Use for collapsed rails/tight spaces. */
  markOnly?: boolean;
  /** Rendered height in pixels; width follows the source image's aspect ratio. */
  size?: number;
}

export function Logo({ className, markOnly = false, size }: LogoProps) {
  if (markOnly) {
    const px = size ?? 28;
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

  const height = size ?? 28;
  return (
    <Image
      src={logoImage}
      alt="Complex"
      style={{ height, width: "auto" }}
      className={cn("shrink-0", className)}
      priority
    />
  );
}

export default Logo;
