'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle, Mail, Phone, ArrowRight } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/201070782785'
const PHONE_DISPLAY = '+20 107 078 2785'
const EMAIL = 'sales@panther-express.com'

const svgClass = 'h-5 w-5'

const SOCIALS: { name: string; href: string; icon: React.ReactNode }[] = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/panther_express_?igsh=MWRtczY3N29jczlsZg%3D%3D',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass} aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=100086041746520',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass} aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@pantherexpress3?_r=1&_t=ZS-97Z3mWT333I',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={svgClass} aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
]

export function ContactUs() {
  const t = useTranslations('contactPage')
  const locale = useLocale()

  const methods = [
    {
      Icon: MessageCircle,
      title: t('whatsappTitle'),
      desc: t('whatsappDesc'),
      value: PHONE_DISPLAY,
      cta: t('whatsappCta'),
      href: WHATSAPP_URL,
      external: true,
    },
    {
      Icon: Mail,
      title: t('emailTitle'),
      desc: t('emailDesc'),
      value: EMAIL,
      cta: t('emailCta'),
      href: `mailto:${EMAIL}`,
      external: false,
    },
    {
      Icon: Phone,
      title: t('phoneTitle'),
      desc: t('phoneDesc'),
      value: PHONE_DISPLAY,
      cta: t('phoneCta'),
      href: `tel:${PHONE_DISPLAY.replace(/\s/g, '')}`,
      external: false,
    },
  ]

  return (
    <>
      {/* Header */}
      <section className="relative bg-panther-black pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#E5001A 1px, transparent 1px), linear-gradient(90deg, #E5001A 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
          <div className="absolute -top-24 -right-48 w-[480px] h-[480px] bg-panther-red/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-panther-red/10 border border-panther-red/30 rounded-full px-4 py-1.5 mb-6">
            <MessageCircle size={13} className="text-panther-red" />
            <span className="text-panther-red text-sm font-medium">{t('badge')}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight mb-5">
            {t('title')}
          </h1>
          <p className="text-lg text-white/55 leading-relaxed max-w-2xl">{t('subtitle')}</p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="bg-[#F9F8F7] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {methods.map((m) => (
              <a
                key={m.title}
                href={m.href}
                {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group bg-white shadow-card border border-zinc-100 rounded-2xl p-7 hover:shadow-card-hover hover:border-panther-red/20 transition-all flex flex-col"
              >
                <div className="w-12 h-12 bg-panther-red/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-panther-red/18 transition-colors">
                  <m.Icon size={22} className="text-panther-red" />
                </div>
                <h3 className="font-bold text-panther-black mb-1">{m.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-4">{m.desc}</p>
                <p className="text-sm font-semibold text-panther-black mb-4 break-words">
                  <bdi dir="ltr">{m.value}</bdi>
                </p>
                <span className="mt-auto inline-flex items-center text-panther-red text-sm font-semibold">
                  {m.cta}
                  <ArrowRight size={15} className="ms-1.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                </span>
              </a>
            ))}
          </div>

          {/* Socials */}
          <div className="mt-5">
            <div className="bg-white shadow-card border border-zinc-100 rounded-2xl p-7">
              <h3 className="font-bold text-panther-black mb-4">{t('socialTitle')}</h3>
              <div className="flex gap-3">
                {SOCIALS.map(({ name, href, icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                    className="w-11 h-11 rounded-xl bg-[#F9F8F7] border border-zinc-100 flex items-center justify-center text-panther-black hover:bg-panther-red hover:text-white hover:border-panther-red transition-colors"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-panther-black py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-panther-red/10 border border-panther-red/30 rounded-full px-4 py-1.5 mb-6">
            <span className="text-panther-red text-sm font-medium">{t('ctaBadge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-8">{t('ctaTitle')}</h2>
          <Link href={`/${locale}#join`}>
            <Button size="lg" className="bg-panther-red hover:bg-panther-red-dark text-white font-bold px-8 group">
              {t('ctaButton')}
              <ArrowRight size={18} className="ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
