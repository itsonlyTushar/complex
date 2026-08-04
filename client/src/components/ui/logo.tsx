import Image from 'next/image'
import React from 'react'
import logoLight from '../../assets/light.png'

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  const imageClass = className || 'h-12 w-auto object-contain';

  return (
    <Image
      src={logoLight}
      alt="Logo"
      className={imageClass}
      priority
    />
  )
}

export default Logo;
