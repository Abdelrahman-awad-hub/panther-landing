import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
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
            <p className="text-white text-sm">{t('tagline')}</p>
          </div>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link href={`/${locale}/track`} className="text-white hover:text-white/70 text-sm transition-colors">{t('track')}</Link>
            <a href="#" className="text-white hover:text-white/70 text-sm transition-colors">{t('privacy')}</a>
            <a href="#" className="text-white hover:text-white/70 text-sm transition-colors">{t('terms')}</a>
            <a href="#" className="text-white hover:text-white/70 text-sm transition-colors">{t('contact')}</a>
          </div>
        </div>
        <div className="border-t border-white/8 mt-8 pt-6 text-center">
          <p className="text-white/70 text-xs">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
