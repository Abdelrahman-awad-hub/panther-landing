'use client'

import { useLocale } from 'next-intl'
import { Check } from 'lucide-react'
import { LeadFormCore, PITCH_POINTS } from './LeadFormCore'

export function LeadFormSection() {
  const locale = useLocale()
  const isAr = locale === 'ar'

  return (
    <section id="join" className="relative bg-white py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{ background: 'radial-gradient(ellipse 55% 65% at 72% 50%, rgba(229,0,26,0.03) 0%, transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">

          {/* Left: Pitch column */}
          <div className="lg:col-span-2 lg:pt-2 relative">
            <span
              className="absolute -top-6 select-none pointer-events-none font-black leading-none"
              style={{
                fontSize: 'clamp(5rem, 12vw, 8.5rem)',
                color: 'rgba(229,0,26,0.07)',
                letterSpacing: '-0.04em',
                left: isAr ? 'auto' : '-0.1em',
                right: isAr ? '-0.1em' : 'auto',
              }}
              aria-hidden="true"
            >
              {isAr ? '٢٤س' : '24H'}
            </span>

            <p className="relative flex items-center gap-2 text-panther-red text-xs font-bold tracking-[0.18em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-panther-red-light flex-shrink-0" aria-hidden="true" />
              {isAr ? 'انضم الآن' : 'Join Now'}
            </p>

            <h2 className="relative text-3xl lg:text-4xl font-black text-panther-black leading-tight tracking-tight mb-4">
              {isAr
                ? <>سيب بياناتك وابدأ<br />شراكتك مع Panther<br />خلال 24 ساعة</>
                : <>Leave your info and start<br />your partnership with Panther<br />in 24 hours.</>
              }
            </h2>

            <p className="relative text-gray-500 text-base leading-relaxed mb-10">
              {isAr
                ? 'سيب بيانات البراند بتاعك، وفريق Panther هيتواصل معاك بأفضل خطة Logistics مناسبة لحجم شغلك.'
                : 'Share your brand details and the Panther team will reach out with the best logistics plan for your business size.'}
            </p>

            <ul className="relative space-y-3.5">
              {PITCH_POINTS.map((pt, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-panther-red/10 border border-panther-red/20 flex items-center justify-center">
                    <Check size={11} className="text-panther-red" strokeWidth={2.5} />
                  </span>
                  <span className="text-gray-600 text-sm">{isAr ? pt.ar : pt.en}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Form card */}
          <div className="lg:col-span-3">
            <div
              className="bg-white rounded-2xl border border-gray-200 p-7 sm:p-8"
              style={{
                borderInlineStartWidth: '3px',
                borderInlineStartColor: '#E5001A',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 16px 40px -4px rgba(0,0,0,0.08)',
              }}
            >
              <LeadFormCore source="section" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
