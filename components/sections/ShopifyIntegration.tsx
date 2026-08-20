'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { ShoppingBag, RefreshCw, Zap, MapPin, ArrowRight, X, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

const featureIcons: LucideIcon[] = [RefreshCw, Zap, MapPin]
const featureKeys = ['1', '2', '3'] as const
const CONTACT_URL = 'https://wa.me/201070782785'

function ShopifyLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="#95BF47" aria-hidden="true">
      <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zM11.71 11.305s-.81-.424-1.774-.424c-1.447 0-1.504.906-1.504 1.141 0 1.232 3.24 1.715 3.24 4.629 0 2.295-1.44 3.76-3.406 3.76-2.354 0-3.54-1.465-3.54-1.465l.646-2.086s1.245 1.066 2.28 1.066c.675 0 .975-.545.975-.932 0-1.619-2.654-1.694-2.654-4.359-.034-2.237 1.571-4.416 4.827-4.416 1.257 0 1.875.361 1.875.361l-.945 2.715-.02.01zM11.17.83c.136 0 .271.038.405.135-.984.465-2.064 1.639-2.508 3.992-.656.213-1.293.405-1.889.578C7.697 3.75 8.951.84 11.17.84V.83zm1.235 2.949v.135c-.754.232-1.583.484-2.394.736.466-1.777 1.333-2.645 2.085-2.971.193.501.309 1.176.309 2.1zm.539-2.234c.694.074 1.141.867 1.429 1.755-.349.114-.735.231-1.158.366v-.252c0-.752-.096-1.371-.271-1.871v.002zm2.992 1.289c-.02 0-.06.021-.078.021s-.289.075-.714.21c-.423-1.233-1.176-2.37-2.508-2.37h-.115C12.135.209 11.669 0 11.265 0 8.159 0 6.675 3.877 6.21 5.846c-1.194.365-2.063.636-2.16.674-.675.213-.694.232-.772.87-.075.462-1.83 14.063-1.83 14.063L15.009 24l.927-21.166z" />
    </svg>
  )
}

export function ShopifyIntegrationSection() {
  const t = useTranslations('shopify')
  const locale = useLocale()
  const [open, setOpen] = useState(false)

  // Close on Escape + lock body scroll while the modal is open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  return (
    <section id="shopify" className="bg-[#F9F8F7] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-6">
              <ShoppingBag size={14} className="text-panther-red" />
              <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-panther-black leading-tight tracking-tight mb-5">
              {t('title')}
            </h2>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8">{t('description')}</p>

            <div className="space-y-4 mb-10">
              {featureKeys.map((n) => {
                const Icon = featureIcons[Number(n) - 1]
                return (
                  <div key={n} className="flex items-start gap-4">
                    <div className="w-10 h-10 shrink-0 bg-panther-red/10 rounded-xl flex items-center justify-center">
                      <Icon size={18} className="text-panther-red" />
                    </div>
                    <div>
                      <h3 className="font-bold text-panther-black text-sm mb-0.5">{t(`feature${n}Title`)}</h3>
                      <p className="text-sm text-zinc-500 leading-relaxed">{t(`feature${n}Desc`)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button
              onClick={() => {
                setOpen(true)
                trackEvent('cta_click', {
                  cta_name: 'shopify_setup_guide',
                  cta_location: 'shopify_section',
                  language: locale,
                })
              }}
              className="bg-panther-red hover:bg-panther-red-dark text-white font-semibold px-6 group"
            >
              {t('ctaSetup')}
              <ArrowRight size={16} className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-panther-red/5 rounded-[2rem] blur-2xl" aria-hidden />
            <div className="relative bg-white shadow-card border border-zinc-100 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-[#95BF47]/12 flex items-center justify-center">
                  <ShopifyLogo className="w-7 h-7" />
                </div>
                <div className="text-zinc-300 text-2xl font-black">⇄</div>
                <div className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center">
                  <Image
                    src="/panthe-logo.png"
                    alt="Panther Express"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {featureKeys.map((n) => {
                  const Icon = featureIcons[Number(n) - 1]
                  return (
                    <div key={n} className="flex items-center gap-3 bg-[#F9F8F7] rounded-xl px-4 py-3">
                      <Icon size={16} className="text-panther-red shrink-0" />
                      <span className="text-sm font-semibold text-panther-black">{t(`feature${n}Title`)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shopify-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-panther-black/70 backdrop-blur-sm animate-in fade-in-0"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl animate-in fade-in-0 zoom-in-95">
            <button
              onClick={() => setOpen(false)}
              aria-label={t('modalClose')}
              className="absolute top-5 end-5 w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-panther-black hover:bg-zinc-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 sm:p-10">
              <div className="inline-flex items-center gap-2 bg-panther-red/8 border border-panther-red/20 rounded-full px-4 py-1.5 mb-5">
                <ShoppingBag size={14} className="text-panther-red" />
                <span className="text-panther-red text-sm font-semibold">{t('badge')}</span>
              </div>
              <h3 id="shopify-modal-title" className="text-2xl sm:text-3xl font-black text-panther-black tracking-tight mb-2">
                {t('modalTitle')}
              </h3>
              <p className="text-zinc-500 leading-relaxed mb-8">{t('modalSubtitle')}</p>

              {/* Video embed */}
              <div className="relative aspect-video w-full rounded-2xl bg-panther-black overflow-hidden mb-8">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube.com/embed/Vc9mWF8giFM"
                  title={t('modalTitle')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Contact */}
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('contact_click', {
                  contact_method: 'whatsapp',
                  contact_location: 'shopify_modal',
                  link_url: CONTACT_URL,
                  language: locale,
                })}
                className="flex items-center gap-3 rounded-2xl bg-[#F9F8F7] border border-zinc-100 px-5 py-4 hover:border-panther-red/30 transition-colors group"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-panther-red/10 flex items-center justify-center">
                  <MessageCircle size={18} className="text-panther-red" />
                </div>
                <span className="text-sm text-zinc-600 leading-relaxed flex-1">{t('contactHelp')}</span>
                <ArrowRight size={16} className="text-panther-red shrink-0 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
