import { useTranslations } from 'next-intl'
import { Truck, Eye, TrendingUp, Heart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons: LucideIcon[] = [Truck, Eye, TrendingUp, Heart]

export function AboutSection() {
  const t = useTranslations('about')

  return (
    <section id="about" className="bg-[#F9F8F7] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-panther-black leading-tight tracking-tight mb-5">
              {t('title')}
            </h2>
            <p className="text-lg text-zinc-500 leading-relaxed">{t('description')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {([1, 2, 3, 4] as const).map((n) => {
              const Icon = icons[n - 1]
              return (
                <div key={n}
                  className="bg-white shadow-card border border-zinc-100 rounded-2xl p-6 hover:shadow-card-hover hover:border-panther-red/20 transition-all group">
                  <div className="w-10 h-10 bg-panther-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-panther-red/18 transition-colors">
                    <Icon size={20} className="text-panther-red" />
                  </div>
                  <h3 className="font-bold text-panther-black mb-2 text-sm">{t(`feature${n}Title`)}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{t(`feature${n}Desc`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
