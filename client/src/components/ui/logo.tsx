import Image from 'next/image'
import React from 'react'
import logoLight from '../../assets/light.png'
import logoDark from '../../assets/black.png'

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const imageClass = className || 'h-12 w-auto object-contain';

  return (
    <>
      {/* Light logo: visible by default, hidden in dark mode */}
      <Image
        src={logoLight}
        alt="Logo"
        className={`${imageClass} dark:hidden`}
        priority
      />
      {/* Dark logo: hidden by default, visible in dark mode */}
      <Image
        src={logoDark}
        alt="Logo"
        className={`${imageClass} hidden dark:block`}
        priority
      />
    </>
  )
}

export default Logo;
