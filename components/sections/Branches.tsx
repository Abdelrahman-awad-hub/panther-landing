import { useTranslations, useLocale } from 'next-intl'
import { MapPin, Phone } from 'lucide-react'
import { branches } from '@/data/branches'

export function BranchesSection() {
  const t = useTranslations('branches')
  const locale = useLocale()
  const isAr = locale === 'ar'

  return (
    <section id="branches" className="bg-[#F5F3F0] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl font-black text-panther-black tracking-tight mb-3">{t('title')}</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <div key={branch.id}
              className={`bg-white shadow-card rounded-2xl p-6 hover:shadow-card-hover hover:border-panther-red/25 transition-all border ${
                branch.isHQ ? 'border-panther-red/25' : 'border-zinc-100'
              }`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-panther-black text-lg">{isAr ? branch.cityAr : branch.city}</h3>
                  {branch.isHQ && (
                    <span className="inline-block mt-1 text-xs font-bold text-panther-red bg-panther-red/8 border border-panther-red/20 px-2 py-0.5 rounded-full">
                      {t('hqLabel')}
                    </span>
                  )}
                </div>
                <div className="w-9 h-9 bg-panther-red/10 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin size={17} className="text-panther-red" />
                </div>
              </div>

              <p className="text-zinc-500 text-sm mb-3 flex items-start gap-1.5">
                <MapPin size={12} className="shrink-0 mt-0.5" />
                {isAr ? branch.addressAr : branch.address}
              </p>

              <p className="text-zinc-400 text-xs mb-4 flex items-center gap-1.5">
                <Phone size={12} className="shrink-0" />
                <span dir="ltr">{branch.phone}</span>
              </p>

              <div className="flex flex-wrap gap-1.5">
                {(isAr ? branch.areasAr : branch.areas).slice(0, 4).map((area) => (
                  <span key={area}
                    className="text-xs bg-zinc-100 text-zinc-500 border border-zinc-200 px-2 py-0.5 rounded-full">
                    {area}
                  </span>
                ))}
                {branch.areas.length > 4 && (
                  <span className="text-xs text-zinc-400 py-0.5">+{branch.areas.length - 4}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
