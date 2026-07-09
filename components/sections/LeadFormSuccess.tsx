'use client'

import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'

export function LeadFormSuccess() {
  const t = useTranslations('leadForm')
  return (
    <div className="text-center py-6">
      <div className="w-16 h-16 rounded-full bg-panther-red/8 border border-panther-red/20 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={32} className="text-panther-red" strokeWidth={1.5} />
      </div>
      <h3 className="text-2xl sm:text-3xl font-black text-panther-black tracking-tight mb-3">
        {t('successTitle')}
      </h3>
      <p className="text-gray-500 text-base leading-relaxed">
        {t('successMessage')}
      </p>
    </div>
  )
}
