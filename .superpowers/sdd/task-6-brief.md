### Task 6: Header + Footer Layout Components

**Files:**
- Create: `components/layout/Header.tsx`
- Create: `components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `Logo` from `@/components/ui/Logo`; `useTranslations('nav')`, `useTranslations('footer')` from next-intl; `sellerPortalUrl: string` prop
- Produces: `<Header sellerPortalUrl />`, `<Footer />`

- [ ] **Step 1: Create Header component**

Create `components/layout/Header.tsx`:

```tsx
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
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-panther-black/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Logo locale={locale} size="md" />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={`#${s}`} className="text-sm font-medium text-white/65 hover:text-white transition-colors">
                {t(s)}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href={switchPath} className="text-sm font-medium text-white/50 hover:text-white/80 transition-colors px-1">
              {otherLocale === 'ar' ? 'العربية' : 'English'}
            </Link>
            <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm"
                className="border-white/25 text-white hover:bg-white/8 bg-transparent h-9 px-4 text-sm">
                {t('sellerLogin')}
              </Button>
            </a>
            <a href="#join">
              <Button size="sm" className="bg-panther-red hover:bg-panther-red-dark text-white h-9 px-5 text-sm font-semibold">
                {t('becomeASeller')}
              </Button>
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="lg:hidden text-white p-1.5" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-panther-black border-t border-white/8">
          <div className="px-4 py-5 flex flex-col gap-1">
            {NAV_SECTIONS.map((s) => (
              <a key={s} href={`#${s}`} onClick={() => setOpen(false)}
                className="text-white/75 hover:text-white py-2.5 text-base border-b border-white/5 last:border-0">
                {t(s)}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-2.5">
              <Link href={switchPath} className="text-white/50 hover:text-white text-sm">
                {otherLocale === 'ar' ? 'العربية' : 'English'}
              </Link>
              <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-white/25 text-white hover:bg-white/8 bg-transparent">
                  {t('sellerLogin')}
                </Button>
              </a>
              <a href="#join" onClick={() => setOpen(false)}>
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
```

- [ ] **Step 2: Create Footer component**

Create `components/layout/Footer.tsx`:

```tsx
import { useTranslations, useLocale } from 'next-intl'
import { Logo } from '@/components/ui/Logo'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-panther-black border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo locale={locale} size="md" />
            <p className="text-white/35 text-sm">{t('tagline')}</p>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="#" className="text-white/35 hover:text-white/60 text-sm transition-colors">{t('privacy')}</a>
            <a href="#" className="text-white/35 hover:text-white/60 text-sm transition-colors">{t('terms')}</a>
            <a href="#" className="text-white/35 hover:text-white/60 text-sm transition-colors">{t('contact')}</a>
          </div>
        </div>
        <div className="border-t border-white/8 mt-8 pt-6 text-center">
          <p className="text-white/25 text-xs">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Commit layout components**

```bash
git add -A
git commit -m "feat: add Header (scrolled, mobile drawer, language toggle) and Footer components"
```

---

