'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle2, AlertCircle, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

type FormData = {
  brandName: string
  phone: string
  volumeCategory: string
  socialLink: string
  websiteUrl: string
}

const VOLUME_KEYS = ['300', '1000', '5000', '5000plus'] as const
const EG_PHONE = /^(\+20|0020|0)?1[0125][0-9]{8,10}$/
const URL_RE = /^https?:\/\/.+/

const PITCH_POINTS = [
  { en: 'Account activated in 24 hours', ar: 'تفعيل الحساب خلال 24 ساعة' },
  { en: 'No subscription fees', ar: 'بدون رسوم اشتراك' },
  { en: 'Transparent pricing, no hidden fees', ar: 'أسعار واضحة بدون رسوم مخفية' },
]

function readUTMs(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  const p = new URLSearchParams(window.location.search)
  return {
    utmSource:   p.get('utm_source')   ?? '',
    utmMedium:   p.get('utm_medium')   ?? '',
    utmCampaign: p.get('utm_campaign') ?? '',
    utmTerm:     p.get('utm_term')     ?? '',
    utmContent:  p.get('utm_content')  ?? '',
  }
}

export function LeadFormSection() {
  const t = useTranslations('leadForm')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [attribution, setAttribution] = useState<Record<string, string>>({})

  useEffect(() => {
    setAttribution({
      referrerUrl: document.referrer,
      landingUrl: window.location.href,
      ...readUTMs(),
    })
  }, [])

  const [honeypot, setHoneypot] = useState('')
  const { handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: { brandName: '', phone: '', volumeCategory: '', socialLink: '', websiteUrl: '' },
  })

  const onSubmit = async (values: FormData) => {
    if (honeypot) return
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, website_confirm: honeypot, ...attribution }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="join" className="bg-white py-24 lg:py-32">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-panther-red/8 border border-panther-red/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-panther-red" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-black text-panther-black tracking-tight mb-3">
            {t('successTitle')}
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            {t('successMessage')}
          </p>
        </div>
      </section>
    )
  }

  const fieldClass = [
    'bg-gray-50 border border-gray-200',
    'text-gray-900 placeholder:text-gray-400',
    'rounded-lg h-11',
    'focus-visible:outline-none focus-visible:ring-0',
    'focus-visible:border-panther-red',
    'transition-colors',
  ].join(' ')

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
            <form
              onSubmit={handleSubmit(onSubmit)}
              dir={isAr ? 'rtl' : 'ltr'}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              style={{
                borderInlineStartWidth: '3px',
                borderInlineStartColor: '#E5001A',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07), 0 16px 40px -4px rgba(0,0,0,0.08)',
              }}
            >
              <div className="p-7 sm:p-8 space-y-5">
                {/* Honeypot */}
                <input
                  type="text" tabIndex={-1} autoComplete="off"
                  className="sr-only" aria-hidden="true"
                  value={honeypot} onChange={e => setHoneypot(e.target.value)}
                />

                {/* Brand + Phone */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-600 font-medium text-xs tracking-wide uppercase">
                      {t('brandName')} <span className="text-panther-red">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="brandName"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Input
                          placeholder={t('brandNamePlaceholder')}
                          className={fieldClass}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.brandName && (
                      <p className="text-panther-red text-xs mt-1">{t('brandNameRequired')}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-600 font-medium text-xs tracking-wide uppercase">
                      {t('phone')} <span className="text-panther-red">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="phone"
                      rules={{ required: true, pattern: EG_PHONE }}
                      render={({ field }) => (
                        <Input
                          type="tel" dir="ltr"
                          placeholder={t('phonePlaceholder')}
                          className={fieldClass}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="text-panther-red text-xs mt-1">
                        {errors.phone.type === 'required' ? t('phoneRequired') : t('phoneInvalid')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Volume */}
                <div className="space-y-1.5">
                  <Label className="text-gray-600 font-medium text-xs tracking-wide uppercase">
                    {t('volume')} <span className="text-panther-red">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="volumeCategory"
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value ?? ''}>
                        <SelectTrigger className={`${fieldClass} w-full`}>
                          <SelectValue placeholder={t('volumePlaceholder')} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 text-gray-900">
                          {VOLUME_KEYS.map((k) => (
                            <SelectItem
                              key={k} value={k}
                              className="text-gray-900 focus:bg-gray-50 focus:text-gray-900"
                            >
                              {t(`volume${k}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.volumeCategory && (
                    <p className="text-panther-red text-xs mt-1">{t('volumeRequired')}</p>
                  )}
                </div>

                {/* Social + Website */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-gray-600 font-medium text-xs tracking-wide uppercase">
                      {t('social')}
                    </Label>
                    <Controller
                      control={control}
                      name="socialLink"
                      rules={{ validate: v => !v || URL_RE.test(v) }}
                      render={({ field }) => (
                        <Input
                          type="url" dir="ltr"
                          placeholder={t('socialPlaceholder')}
                          className={fieldClass}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.socialLink && (
                      <p className="text-panther-red text-xs mt-1">{t('urlInvalid')}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-gray-600 font-medium text-xs tracking-wide uppercase">
                      {t('website')}
                    </Label>
                    <Controller
                      control={control}
                      name="websiteUrl"
                      rules={{ validate: v => !v || URL_RE.test(v) }}
                      render={({ field }) => (
                        <Input
                          type="url" dir="ltr"
                          placeholder={t('websitePlaceholder')}
                          className={fieldClass}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                        />
                      )}
                    />
                    {errors.websiteUrl && (
                      <p className="text-panther-red text-xs mt-1">{t('urlInvalid')}</p>
                    )}
                  </div>
                </div>

                {status === 'error' && (
                  <div className="flex items-start gap-2.5 bg-panther-red/5 border border-panther-red/20 rounded-lg p-3">
                    <AlertCircle size={15} className="text-panther-red shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-sm">{t('errorMessage')}</p>
                  </div>
                )}
              </div>

              <div className="px-7 sm:px-8 pb-7 sm:pb-8">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-panther-red hover:bg-panther-red-dark text-white font-bold h-12 text-sm tracking-wide rounded-lg btn-red-glow disabled:opacity-50"
                >
                  {isSubmitting ? t('submitting') : t('submit')}
                </Button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
