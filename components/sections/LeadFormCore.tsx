'use client'

import { useEffect, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useLocale, useTranslations } from 'next-intl'
import { AlertCircle, Info } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'
import { captureLeadAttribution } from '@/lib/attribution'
import { classifyLead, needsWarehouseQuestion, VOLUME_CATEGORIES } from '@/lib/lead-qualification'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { LeadFormSuccess } from './LeadFormSuccess'

type FormData = {
  brandName: string
  phone: string
  city: string
  volumeCategory: string
  warehouseInterest: 'yes' | 'no' | ''
  socialLink: string
  websiteUrl: string
}

const EG_PHONE = /^(\+20|0020|0)?1[0125][0-9]{8,10}$/

const GOVERNORATES: { value: string; ar: string }[] = [
  { value: 'Cairo', ar: 'القاهرة' }, { value: 'Giza', ar: 'الجيزة' },
  { value: 'Alexandria', ar: 'الإسكندرية' }, { value: 'Qalyubia', ar: 'القليوبية' },
  { value: 'Dakahlia', ar: 'الدقهلية' }, { value: 'Sharqia', ar: 'الشرقية' },
  { value: 'Gharbia', ar: 'الغربية' }, { value: 'Monufia', ar: 'المنوفية' },
  { value: 'Beheira', ar: 'البحيرة' }, { value: 'Kafr El Sheikh', ar: 'كفر الشيخ' },
  { value: 'Damietta', ar: 'دمياط' }, { value: 'Port Said', ar: 'بورسعيد' },
  { value: 'Ismailia', ar: 'الإسماعيلية' }, { value: 'Suez', ar: 'السويس' },
  { value: 'North Sinai', ar: 'شمال سيناء' }, { value: 'South Sinai', ar: 'جنوب سيناء' },
  { value: 'Faiyum', ar: 'الفيوم' }, { value: 'Beni Suef', ar: 'بني سويف' },
  { value: 'Minya', ar: 'المنيا' }, { value: 'Asyut', ar: 'أسيوط' },
  { value: 'Sohag', ar: 'سوهاج' }, { value: 'Qena', ar: 'قنا' },
  { value: 'Luxor', ar: 'الأقصر' }, { value: 'Aswan', ar: 'أسوان' },
  { value: 'Red Sea', ar: 'البحر الأحمر' }, { value: 'New Valley', ar: 'الوادي الجديد' },
  { value: 'Matrouh', ar: 'مطروح' },
]

export const PITCH_POINTS = [
  { en: 'Protect and improve your delivery rate', ar: 'نحافظ على معدل تسليمك ونشتغل على تحسينه' },
  { en: 'Inspection with no additional fees nationwide', ar: 'معاينة من غير رسوم إضافية في كل مصر' },
  { en: 'Exchanges and returns with no additional fees', ar: 'استبدال ومرتجعات من غير رسوم إضافية' },
  { en: 'Flexible warehousing and fulfillment', ar: 'تخزين وتجهيز وشحن بمرونة' },
]

type LeadFormCoreProps = {
  source?: string
  onSuccess?: () => void
  autoFocus?: boolean
}

export function LeadFormCore({ source = 'section', onSuccess, autoFocus = false }: LeadFormCoreProps) {
  const t = useTranslations('leadForm')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [honeypot, setHoneypot] = useState('')
  const { handleSubmit, control, setFocus, formState: { errors, isSubmitting } } = useForm<FormData>({
    mode: 'onTouched',
    defaultValues: {
      brandName: '', phone: '', city: '', volumeCategory: '', warehouseInterest: '',
      socialLink: '', websiteUrl: '',
    },
  })
  const city = useWatch({ control, name: 'city' })
  const volumeCategory = useWatch({ control, name: 'volumeCategory' })
  const showWarehouseQuestion = needsWarehouseQuestion(city, volumeCategory)
  const formId = `seller_application_${source}`
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const element = formRef.current
    if (!element) return
    const key = `panther_form_view:${source}`
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      try {
        if (sessionStorage.getItem(key)) return
        sessionStorage.setItem(key, '1')
      } catch {
        // The event can still be emitted when storage is unavailable.
      }
      trackEvent('form_view', {
        form_id: formId, form_name: 'seller_application',
        form_source: source, language: locale,
      })
      observer.disconnect()
    }, { threshold: 0.5 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [formId, locale, source])

  useEffect(() => {
    if (autoFocus) setFocus('brandName')
  }, [autoFocus, setFocus])

  const startedRef = useRef(false)
  const handleFormStart = () => {
    if (startedRef.current) return
    const key = `panther_form_start:${source}`
    try {
      if (sessionStorage.getItem(key)) return
      sessionStorage.setItem(key, '1')
    } catch {
      // Component-level guard remains the fallback.
    }
    startedRef.current = true
    trackEvent('lead_form_start', {
      form_id: formId, form_name: 'seller_application',
      form_source: source, language: locale,
    })
  }

  const onSubmit = async (values: FormData) => {
    if (honeypot) return
    const warehouseInterest = showWarehouseQuestion ? values.warehouseInterest : 'not_applicable'
    const leadQualification = classifyLead({ ...values, warehouseInterest })
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          warehouseInterest,
          leadQualification,
          website_confirm: honeypot,
          formSource: source,
          locale,
          ...captureLeadAttribution(),
        }),
      })
      if (!res.ok) throw new Error()
      const data: { leadId?: string } = await res.json()
      if (!data.leadId) throw new Error()
      setStatus('success')
      const eventPayload = {
        form_id: formId, form_name: 'seller_application', form_source: source, lead_id: data.leadId,
        event_id: data.leadId, lead_source: source, volume_category: values.volumeCategory,
        lead_qualification: leadQualification, warehouse_interest: warehouseInterest, language: locale,
        service_type: 'cod_shipping', expected_shipments: values.volumeCategory, city: values.city,
      }
      trackEvent('panther_lead_success', eventPayload)
      if (leadQualification.startsWith('qualified_')) trackEvent('panther_qualified_lead', eventPayload)
      onSuccess?.()
    } catch (error) {
      setStatus('error')
      trackEvent('lead_form_error', {
        form_id: formId, form_name: 'seller_application', form_source: source,
        error_type: error instanceof TypeError ? 'network' : 'submission', language: locale,
      })
    }
  }

  const onInvalid = (invalidFields: Record<string, unknown>) => {
    trackEvent('lead_form_validation_error', {
      form_id: formId, form_name: 'seller_application', form_source: source,
      error_type: 'validation', field_name: Object.keys(invalidFields).sort()[0] ?? 'unknown',
      error_fields: Object.keys(invalidFields).sort().join(','), language: locale,
    })
  }

  if (status === 'success') return <LeadFormSuccess />

  const fieldClass = 'h-12 rounded-xl border border-gray-200 bg-gray-50 text-base text-gray-900 placeholder:text-gray-400 focus-visible:border-panther-red focus-visible:outline-none focus-visible:ring-0 transition-colors'
  const labelClass = 'text-xs font-bold uppercase tracking-wide text-gray-600'

  return (
    <form id={formId} ref={formRef} noValidate onSubmit={handleSubmit(onSubmit, onInvalid)} onInput={handleFormStart} dir={isAr ? 'rtl' : 'ltr'} className="space-y-5">
      <input type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" value={honeypot} onChange={(event) => setHoneypot(event.target.value)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className={labelClass}>{t('brandName')} <span className="text-panther-red">*</span></Label>
          <Controller control={control} name="brandName" rules={{ required: true }} render={({ field }) => (
            <Input {...field} required aria-required="true" aria-invalid={Boolean(errors.brandName)} autoComplete="organization" placeholder={t('brandNamePlaceholder')} className={fieldClass} />
          )} />
          {errors.brandName && <p className="text-xs text-panther-red">{t('brandNameRequired')}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>{t('phone')} <span className="text-panther-red">*</span></Label>
          <Controller control={control} name="phone" rules={{ required: true, pattern: EG_PHONE }} render={({ field }) => (
            <Input {...field} required aria-required="true" aria-invalid={Boolean(errors.phone)} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder={t('phonePlaceholder')} className={fieldClass} />
          )} />
          {errors.phone && <p className="text-xs text-panther-red">{errors.phone.type === 'required' ? t('phoneRequired') : t('phoneInvalid')}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className={labelClass}>{t('city')} <span className="text-panther-red">*</span></Label>
          <Controller control={control} name="city" rules={{ required: true }} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger aria-required="true" aria-invalid={Boolean(errors.city)} className={`${fieldClass} w-full`}>
                <span className="flex-1 truncate text-start">{field.value ? (isAr ? GOVERNORATES.find((item) => item.value === field.value)?.ar : field.value) : t('cityPlaceholder')}</span>
              </SelectTrigger>
              <SelectContent className="max-h-64 border-gray-200 bg-white text-gray-900">
                {GOVERNORATES.map((governorate) => (
                  <SelectItem key={governorate.value} value={governorate.value}>{isAr ? governorate.ar : governorate.value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
          {errors.city && <p className="text-xs text-panther-red">{t('cityRequired')}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className={labelClass}>{t('volume')} <span className="text-panther-red">*</span></Label>
          <Controller control={control} name="volumeCategory" rules={{ required: true }} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger aria-required="true" aria-invalid={Boolean(errors.volumeCategory)} className={`${fieldClass} w-full`}>
                <span className="flex-1 truncate text-start">{field.value ? t(`volume${field.value}`) : t('volumePlaceholder')}</span>
              </SelectTrigger>
              <SelectContent className="border-gray-200 bg-white text-gray-900">
                {VOLUME_CATEGORIES.map((key) => <SelectItem key={key} value={key}>{t(`volume${key}`)}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
          {errors.volumeCategory && <p className="text-xs text-panther-red">{t('volumeRequired')}</p>}
        </div>
      </div>

      {city && (city === 'Cairo' || city === 'Giza') && (
        <div className="flex gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-panther-red" /><p>{t('pickupHint')}</p>
        </div>
      )}
      {volumeCategory === 'under150' && (
        <div className="flex gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /><p>{t('belowMinimumHint')}</p>
        </div>
      )}
      {showWarehouseQuestion && (
        <div className="space-y-2 rounded-2xl border border-panther-red/20 bg-panther-red/[0.03] p-4">
          <Label className={labelClass}>{t('warehouseQuestion')} <span className="text-panther-red">*</span></Label>
          <p className="text-xs leading-relaxed text-zinc-500">{t('warehouseHint')}</p>
          <Controller control={control} name="warehouseInterest" rules={{ required: showWarehouseQuestion }} render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger aria-required="true" aria-invalid={Boolean(errors.warehouseInterest)} className={`${fieldClass} w-full`}>
                <span className="flex-1 truncate text-start">{field.value ? t(field.value === 'yes' ? 'warehouseYes' : 'warehouseNo') : t('warehouseQuestion')}</span>
              </SelectTrigger>
              <SelectContent className="border-gray-200 bg-white text-gray-900">
                <SelectItem value="yes">{t('warehouseYes')}</SelectItem>
                <SelectItem value="no">{t('warehouseNo')}</SelectItem>
              </SelectContent>
            </Select>
          )} />
          {errors.warehouseInterest && <p className="text-xs text-panther-red">{t('warehouseRequired')}</p>}
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-2.5 rounded-lg border border-panther-red/20 bg-panther-red/5 p-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0 text-panther-red" /><p className="text-sm text-gray-700">{t('errorMessage')}</p>
        </div>
      )}

      <Button type="submit" disabled={isSubmitting} className="h-14 w-full rounded-xl bg-panther-red text-base font-bold text-white btn-red-glow hover:bg-panther-red-dark disabled:opacity-50">
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
      <p className="text-center text-xs leading-5 text-zinc-500">
        {t('privacyNote')}{' '}
        <a href={`/${locale}/privacy`} className="font-semibold text-zinc-800 underline underline-offset-2 hover:text-panther-red">
          {t('privacyLink')}
        </a>
      </p>
    </form>
  )
}
