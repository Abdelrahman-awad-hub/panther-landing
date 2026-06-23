### Task 11: Lead Capture Form

**Files:**
- Create: `components/sections/LeadForm.tsx`

**Interfaces:**
- Consumes: `POST /api/leads`; `LeadSubmissionSchema` from `@/lib/lead-schema`; `useTranslations('leadForm')`
- Produces: `<LeadFormSection />`

- [ ] **Step 1: Create Lead Form section**

Create `components/sections/LeadForm.tsx`:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { LeadSubmissionSchema, type LeadSubmission } from '@/lib/lead-schema'

const VOLUME_KEYS = ['300', '1000', '5000', '5000plus'] as const

function readUTMs() {
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
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [attribution, setAttribution] = useState<Record<string, string>>({})

  useEffect(() => {
    setAttribution({
      referrerUrl: document.referrer,
      landingUrl:  window.location.href,
      ...readUTMs(),
    })
  }, [])

  const form = useForm<LeadSubmission>({
    resolver: zodResolver(LeadSubmissionSchema),
    defaultValues: { brandName: '', phone: '', socialLink: '', websiteUrl: '', website_confirm: '' },
  })

  const onSubmit = async (values: LeadSubmission) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, ...attribution }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <section id="join" className="bg-panther-red py-24 lg:py-32">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <CheckCircle2 size={60} className="text-white mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="text-3xl font-black text-white mb-3">{t('successTitle')}</h2>
          <p className="text-white/75 text-lg">{t('successMessage')}</p>
        </div>
      </section>
    )
  }

  const fieldClass = 'bg-white/10 border-white/25 text-white placeholder:text-white/35 focus-visible:ring-white/30 focus-visible:border-white/60'
  const errorClass = 'text-white/75 text-xs mt-1'

  return (
    <section id="join" className="bg-panther-red py-24 lg:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-white/15 rounded-full px-4 py-1.5 mb-5">
            <span className="text-white text-sm font-semibold">{t('badge')}</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-3">{t('title')}</h2>
          <p className="text-white/70 text-lg">{t('subtitle')}</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-7 sm:p-9 space-y-5"
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
        >
          {/* Honeypot */}
          <input type="text" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" {...form.register('website_confirm')} />

          {/* Brand name */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('brandName')} <span className="text-white/50">*</span></Label>
            <Input placeholder={t('brandNamePlaceholder')} className={fieldClass} {...form.register('brandName')} />
            {form.formState.errors.brandName && <p className={errorClass}>{t('brandNameRequired')}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('phone')} <span className="text-white/50">*</span></Label>
            <Input type="tel" placeholder={t('phonePlaceholder')} className={fieldClass} dir="ltr" {...form.register('phone')} />
            {form.formState.errors.phone && (
              <p className={errorClass}>
                {form.formState.errors.phone.type === 'too_small' ? t('phoneRequired') : t('phoneInvalid')}
              </p>
            )}
          </div>

          {/* Volume */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('volume')} <span className="text-white/50">*</span></Label>
            <Select onValueChange={(v) => form.setValue('volumeCategory', v as LeadSubmission['volumeCategory'], { shouldValidate: true })}>
              <SelectTrigger className={`${fieldClass} h-10`}>
                <SelectValue placeholder={t('volumePlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {VOLUME_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>{t(`volume${k}`)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.volumeCategory && <p className={errorClass}>{t('volumeRequired')}</p>}
          </div>

          {/* Social */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('social')}</Label>
            <Input type="url" placeholder={t('socialPlaceholder')} className={fieldClass} dir="ltr" {...form.register('socialLink')} />
            {form.formState.errors.socialLink && <p className={errorClass}>{t('urlInvalid')}</p>}
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label className="text-white font-semibold text-sm">{t('website')}</Label>
            <Input type="url" placeholder={t('websitePlaceholder')} className={fieldClass} dir="ltr" {...form.register('websiteUrl')} />
            {form.formState.errors.websiteUrl && <p className={errorClass}>{t('urlInvalid')}</p>}
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-2.5 bg-white/15 border border-white/20 rounded-xl p-3">
              <AlertCircle size={16} className="text-white shrink-0 mt-0.5" />
              <p className="text-white text-sm">{t('errorMessage')}</p>
            </div>
          )}

          <Button type="submit" disabled={status === 'loading'}
            className="w-full bg-panther-black hover:bg-panther-dark text-white font-bold py-3 text-base rounded-xl transition-all disabled:opacity-60 mt-2">
            {status === 'loading' ? t('submitting') : t('submit')}
          </Button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit Lead Form**

```bash
git add -A
git commit -m "feat: add LeadFormSection with Zod validation, UTM attribution, and honeypot"
```

---

