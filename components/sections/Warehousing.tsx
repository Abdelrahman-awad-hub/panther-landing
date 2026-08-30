'use client'

import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Boxes, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trackEvent } from '@/lib/analytics'

const icons = [Boxes, PackageCheck, Truck, ShieldCheck]
const featureKeys = ['0', '1', '2', '3'] as const

export function WarehousingSection() {
  const t = useTranslations('warehousing')
  const locale = useLocale()

  return (
    <section className="overflow-hidden bg-panther-black py-20 text-white lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="self-center">
          <div className="mb-5 inline-flex rounded-full border border-panther-red/40 bg-panther-red/10 px-4 py-1.5 text-sm font-semibold text-panther-red-light">
            {t('badge')}
          </div>
          <h2 className="mb-5 text-4xl font-black leading-tight tracking-tight lg:text-5xl">{t('title')}</h2>
          <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/60">{t('subtitle')}</p>
          <a
            href="#join"
            onClick={() => trackEvent('cta_click', {
              cta_name: 'join_now',
              cta_location: 'warehousing',
              language: locale,
            })}
          >
            <Button className="group bg-panther-red px-7 font-bold text-white hover:bg-panther-red-dark">
              {t('cta')}
              <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </Button>
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {featureKeys.map((key, index) => {
            const Icon = icons[index]
            return (
              <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-panther-red/15 text-panther-red-light">
                  <Icon size={22} />
                </div>
                <h3 className="mb-2 font-bold">{t(`feature${key}Title`)}</h3>
                <p className="text-sm leading-relaxed text-white/55">{t(`feature${key}Desc`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
