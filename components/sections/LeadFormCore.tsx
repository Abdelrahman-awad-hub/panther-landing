'use client'

import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useTranslations, useLocale } from 'next-intl'
import { sendGTMEvent } from '@next/third-parties/google'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { LeadFormSuccess } from './LeadFormSuccess'

type FormData = {
  brandName: string
  phone: string
  city: string
  volumeCategory: string
  socialLink: string
  websiteUrl: string
}

const VOLUME_KEYS = ['300', '1000', '5000', '5000plus'] as const
const EG_PHONE = /^(\+20|0020|0)?1[0125][0-9]{8,10}$/
const URL_RE = /^https?:\/\/.+/

/**
 * Egyptian governorates. The English name is submitted as the value so the
 * Google Sheet stays readable; Arabic is shown to RTL users.
 */
const GOVERNORATES: { value: string; ar: string }[] = [
  { value: 'Cairo', ar: 'القاهرة' },
  { value: 'Giza', ar: 'الجيزة' },
  { value: 'Alexandria', ar: 'الإسكندرية' },
  { value: 'Qalyubia', ar: 'القليوبية' },
  { value: 'Dakahlia', ar: 'الدقهلية' },
  { value: 'Sharqia', ar: 'الشرقية' },
  { value: 'Gharbia', ar: 'الغربية' },
  { value: 'Monufia', ar: 'المنوفية' },
  { value: 'Beheira', ar: 'البحيرة' },
  { value: 'Kafr El Sheikh', ar: 'كفر الشيخ' },
  { value: 'Damietta', ar: 'دمياط' },
  { value: 'Port Said', ar: 'بورسعيد' },
  { value: 'Ismailia', ar: 'الإسماعيلية' },
  { value: 'Suez', ar: 'السويس' },
  { value: 'North Sinai', ar: 'شمال سيناء' },
  { value: 'South Sinai', ar: 'جنوب سيناء' },
  { value: 'Faiyum', ar: 'الفيوم' },
  { value: 'Beni Suef', ar: 'بني سويف' },
  { value: 'Minya', ar: 'المنيا' },
  { value: 'Asyut', ar: 'أسيوط' },
  { value: 'Sohag', ar: 'سوهاج' },
  { value: 'Qena', ar: 'قنا' },
  { value: 'Luxor', ar: 'الأقصر' },
  { value: 'Aswan', ar: 'أسوان' },
  { value: 'Red Sea', ar: 'البحر الأحمر' },
  { value: 'New Valley', ar: 'الوادي الجديد' },
  { value: 'Matrouh', ar: 'مطروح' },
]

/** Bilingual value props, shared by the form section and the modal header. */
export const PITCH_POINTS = [
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

type LeadFormCoreProps = {
  /** Where the form is rendered — used for GTM attribution. */
  source?: string
  /** Called once the lead is submitted successfully. */
  onSuccess?: () => void
  /** Autofocus the first field on mount (used inside the modal). */
  autoFocus?: boolean
}

export function LeadFormCore({ source = 'section', onSuccess, autoFocus = false }: LeadFormCoreProps) {
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
  const { handleSubmit, control, setFocus, formState: { errors, isSubmitting } } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: { brandName: '', phone: '', city: '', volumeCategory: '', socialLink: '', websiteUrl: '' },
  })

  useEffect(() => {
    if (autoFocus) setFocus('brandName')
  }, [autoFocus, setFocus])

  // Fire a single `form_start` event the first time the user interacts with any field.
  const startedRef = useRef(false)
  const handleFormStart = () => {
    if (startedRef.current) return
    startedRef.current = true
    sendGTMEvent({ event: 'form_start', form_name: 'contact', form_source: source })
  }

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
      const eventId = crypto.randomUUID()
      sendGTMEvent({ event: 'form_submit', form_name: 'contact', form_source: source, event_id: eventId })
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <LeadFormSuccess />
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      onInput={handleFormStart}
      dir={isAr ? 'rtl' : 'ltr'}
      className="space-y-5"
    >
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
                ref={field.ref}
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
                ref={field.ref}
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

      {/* City */}
      <div className="space-y-1.5">
        <Label className="text-gray-600 font-medium text-xs tracking-wide uppercase">
          {t('city')} <span className="text-panther-red">*</span>
        </Label>
        <Controller
          control={control}
          name="city"
          rules={{ required: true }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ''}>
              <SelectTrigger className={`${fieldClass} w-full`}>
                <SelectValue placeholder={t('cityPlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900 max-h-64">
                {GOVERNORATES.map((g) => (
                  <SelectItem
                    key={g.value} value={g.value}
                    className="text-gray-900 focus:bg-gray-50 focus:text-gray-900"
                  >
                    {isAr ? g.ar : g.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
          {errors.city && (
          <p className="text-panther-red text-xs mt-1">{t('cityRequired')}</p>
        )}
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
                ref={field.ref}
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
                ref={field.ref}
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

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-panther-red hover:bg-panther-red-dark text-white font-bold h-12 text-sm tracking-wide rounded-lg btn-red-glow disabled:opacity-50"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  )
}
