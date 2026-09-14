import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import logoImage from "@/assets/logo.png";

interface LogoProps {
  className?: string;
  /** Hide the wordmark and show only the monogram (collapsed rails, tight bars). */
  markOnly?: boolean;
}

export function Logo({ className, markOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      <Image
        src={logoImage}
        alt="Complex"
        className={cn("h-7 w-auto", markOnly && "object-cover object-left")}
        priority
      />
    </span>
  );
}

export default Logo;
