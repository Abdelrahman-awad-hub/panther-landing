import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  locale: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  dark?: boolean
}

const sizes = { sm: [100, 30], md: [160, 45], lg: [200, 56] } as const

export function Logo({ locale, className = '', size = 'md', dark = false }: LogoProps) {
  const [w, h] = sizes[size]
  return (
    <Link href={`/${locale}`} className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        src="/panthe-logo.png"
        alt="Panther Express"
        width={w}
        height={h}
        priority
        className={dark ? 'invert' : ''}
      />
    </Link>
  )
}
