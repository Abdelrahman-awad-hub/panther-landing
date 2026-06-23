import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ArrowRight, Package, Upload, MapPin, Printer, Users, BarChart2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const featureIcons: LucideIcon[] = [Package, Upload, MapPin, Printer, Users, BarChart2]
const featureKeys = ['0','1','2','3','4','5'] as const

interface SellerHighlightsProps {
  sellerPortalUrl: string
}

export function SellerHighlightsSection({ sellerPortalUrl }: SellerHighlightsProps) {
  const t = useTranslations('sellerHighlights')

  return (
    <section id="portal" className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Sticky text */}
          <div className="lg:sticky lg:top-28">
            <div className="inline-flex items-center bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-panther-black leading-tight tracking-tight mb-5">
              {t('title')}
            </h2>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8">{t('subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#join">
                <Button className="bg-panther-red hover:bg-panther-red-dark text-white font-semibold px-6 group">
                  {t('ctaJoin')}
                  <ArrowRight size={16} className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                </Button>
              </a>
              <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-zinc-200 text-panther-black hover:bg-zinc-50">
                  {t('ctaLogin')}
                </Button>
              </a>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featureKeys.map((i) => {
              const Icon = featureIcons[Number(i)]
              return (
                <div key={i}
                  className="bg-[#F9F8F7] shadow-card border border-zinc-100 rounded-2xl p-5 hover:shadow-card-hover hover:border-panther-red/20 transition-all group">
                  <div className="w-10 h-10 bg-panther-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-panther-red/18 transition-colors">
                    <Icon size={20} className="text-panther-red" />
                  </div>
                  <h3 className="font-bold text-panther-black mb-1.5 text-sm">{t(`feature${i}Title`)}</h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{t(`feature${i}Desc`)}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
