import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Zap, ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  sellerPortalUrl: string
}

export function HeroSection({ sellerPortalUrl }: HeroSectionProps) {
  const t = useTranslations('hero')

  return (
    <section className="relative min-h-screen bg-panther-black flex items-center overflow-hidden pt-16 lg:pt-20">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#E5001A 1px, transparent 1px), linear-gradient(90deg, #E5001A 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
        {/* Speed lines */}
        <div className="absolute top-[38%] left-0 w-3/4 h-px bg-gradient-to-r from-transparent via-panther-red/25 to-transparent" />
        <div className="absolute top-[50%] left-0 w-full h-px bg-gradient-to-r from-transparent via-panther-red/15 to-transparent" />
        <div className="absolute top-[62%] left-0 w-2/3 h-px bg-gradient-to-r from-transparent via-panther-red/10 to-transparent" />
        {/* Glow blobs */}
        <div className="absolute -top-24 -right-48 w-[480px] h-[480px] bg-panther-red/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-[320px] h-[320px] bg-panther-red/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-panther-red/10 border border-panther-red/30 rounded-full px-4 py-1.5 mb-8">
            <Zap size={13} className="text-panther-red" />
            <span className="text-panther-red text-sm font-medium">{t('badge')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[1.04] tracking-tight mb-6 whitespace-pre-line">
            {t('headline')}
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white/55 leading-relaxed mb-10 max-w-2xl">
            {t('subheadline')}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#join">
              <Button size="lg"
                className="bg-panther-red hover:bg-panther-red-dark text-white font-bold px-8 text-base group w-full sm:w-auto">
                {t('ctaPrimary')}
                <ArrowRight size={18} className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </Button>
            </a>
            <a href={sellerPortalUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline"
                className="border-white/25 text-white hover:bg-white/10 hover:text-white bg-transparent font-medium px-8 text-base w-full sm:w-auto">
                {t('ctaSecondary')}
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
                <div className="text-xs text-white/40 font-semibold uppercase tracking-widest">
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
