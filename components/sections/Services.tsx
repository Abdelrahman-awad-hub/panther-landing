import { useTranslations } from 'next-intl'
import { Package, Upload, MapPin, Users, Printer, DollarSign, Globe, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const icons: LucideIcon[] = [Package, Upload, MapPin, Users, Printer, DollarSign, Globe, BarChart2]
const itemKeys = ['0','1','2','3','4','5','6','7'] as const

export function ServicesSection() {
  const t = useTranslations('services')

  return (
    <section id="services" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-panther-black leading-tight tracking-tight mb-4">{t('title')}</h2>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {itemKeys.map((i) => {
            const Icon = icons[Number(i)]
            return (
              <div key={i}
                className="bg-white shadow-card border border-zinc-100 rounded-2xl p-6 hover:shadow-card-hover hover:border-panther-red/20 transition-all group cursor-default">
                <div className="w-11 h-11 bg-panther-red/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-panther-red/18 transition-colors">
                  <Icon size={22} className="text-panther-red" />
                </div>
                <h3 className="font-bold text-panther-black mb-2 text-sm">{t(`item${i}Title`)}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{t(`item${i}Desc`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
