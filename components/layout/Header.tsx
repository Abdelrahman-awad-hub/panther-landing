'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button } from '@/components/ui/button'

const NAV_SECTIONS = ['services', 'about', 'clients', 'branches', 'partners'] as const

interface HeaderProps {
  sellerPortalUrl: string
}

export function Header({ sellerPortalUrl }: HeaderProps) {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const otherLocale = locale === 'en' ? 'ar' : 'en'
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_1px_0_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.06)]' : 'shadow-none'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Logo locale={locale} size="sm" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={`#${s}`}
                className="text-sm font-medium text-gray-500 hover:text-panther-black transition-colors">
                {t(s)}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href={switchPath}
              className="text-sm font-medium text-gray-400 hover:text-panther-black transition-colors px-1">
              {otherLocale === 'ar' ? 'العربية' : 'English'}
            </Link>
            <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_name: 'seller_login', cta_location: 'header' })}>
              <Button variant="outline" size="sm"
                className="border-gray-300 text-panther-black hover:bg-gray-50 hover:text-panther-black bg-transparent h-9 px-4 text-sm">
                {t('sellerLogin')}
              </Button>
            </a>
            <a href="#join"
              onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_name: 'join_now', cta_location: 'header' })}>
              <Button size="sm" className="bg-panther-red hover:bg-panther-red-dark text-white h-9 px-5 text-sm font-semibold">
                {t('becomeASeller')}
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-1.5 text-panther-black transition-colors"
            onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-5 flex flex-col gap-1">
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={`#${s}`} onClick={() => setOpen(false)}
                className="text-gray-600 hover:text-panther-black py-2.5 text-base border-b border-gray-100 last:border-0 transition-colors">
                {t(s)}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link href={switchPath} className="text-gray-400 hover:text-panther-black text-sm transition-colors">
                {otherLocale === 'ar' ? 'العربية' : 'English'}
              </Link>
              <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer"
                onClick={() => window.dataLayer?.push({ event: 'cta_click', cta_name: 'seller_login', cta_location: 'header' })}>
                <Button variant="outline" className="w-full border-gray-300 text-panther-black hover:bg-gray-50 hover:text-panther-black bg-transparent">
                  {t('sellerLogin')}
                </Button>
              </a>
              <a href="#join" onClick={() => { setOpen(false); window.dataLayer?.push({ event: 'cta_click', cta_name: 'join_now', cta_location: 'header' }) }}>
                <Button className="w-full bg-panther-red hover:bg-panther-red-dark text-white font-semibold">
                  {t('becomeASeller')}
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
