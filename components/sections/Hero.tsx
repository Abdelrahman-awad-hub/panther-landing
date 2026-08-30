'use client'

import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

export function HeroSection() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <section className="relative min-h-screen bg-panther-black flex items-center overflow-hidden pt-16 lg:pt-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FF4D60]/40 bg-[#FF4D60]/10 px-4 py-1.5 mb-8">
            <Zap size={13} className="text-[#FF4D60]" />
            <span className="text-[#FF4D60] text-sm font-semibold">{t('badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[1.04] tracking-tight mb-6 whitespace-pre-line">
            {t('headline')}
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl">
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#join"
              onClick={() => trackEvent('cta_click', { cta_name: 'join_now', cta_location: 'hero', language: locale })}>
              <Button size="lg"
                className="btn-red-shimmer bg-panther-red hover:bg-panther-red-dark text-white font-bold px-8 text-base group w-full sm:w-auto">
                {t('ctaPrimary')}
                <ArrowRight size={18} className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </Button>
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 flex flex-wrap gap-x-10 gap-y-6">
            {(['1', '2', '3'] as const).map((n) => (
              <div key={n}>
                <div className="text-3xl sm:text-4xl font-black text-white leading-none mb-1">
                  {t(`stat${n}Value` as `stat${typeof n}Value`)}
                </div>
                <div className="text-xs text-white/65 font-semibold uppercase tracking-widest">
                  {t(`stat${n}Label` as `stat${typeof n}Label`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
