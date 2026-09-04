'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslations, useLocale } from 'next-intl'
import { X, Check } from 'lucide-react'
import { LeadFormCore, PITCH_POINTS } from './LeadFormCore'

type LeadFormModalProps = {
  open: boolean
  onClose: () => void
}

export function LeadFormModal({ open, onClose }: LeadFormModalProps) {
  const t = useTranslations('sellerCta')
  const locale = useLocale()
  const isAr = locale === 'ar'
  const [mounted, setMounted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  // Close on Escape + lock background scroll while open.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!mounted || !open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="seller-modal-title"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-panther-black/70 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 sm:zoom-in-95 sm:slide-in-from-bottom-0"
        style={{
          borderTopWidth: '3px',
          borderTopColor: '#E5001A',
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="absolute top-4 end-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-panther-red"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <p className="flex items-center gap-2 text-panther-red text-xs font-bold tracking-[0.18em] uppercase mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-panther-red-light flex-shrink-0" aria-hidden="true" />
            {isAr ? 'سجّل الآن' : 'Sign Up Now'}
          </p>
          <h2
            id="seller-modal-title"
            className="text-2xl sm:text-3xl font-black text-panther-black tracking-tight leading-tight mb-2 pe-10"
          >
            {t('modalTitle')}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-5">
            {t('modalSubtitle')}
          </p>

          {/* Trust badges */}
          <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
            {PITCH_POINTS.map((pt, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-panther-red/10 border border-panther-red/20 flex items-center justify-center">
                  <Check size={9} className="text-panther-red" strokeWidth={2.5} />
                </span>
                <span className="text-gray-600 text-xs">{isAr ? pt.ar : pt.en}</span>
              </li>
            ))}
          </ul>

          <LeadFormCore source="floating_modal" onSuccess={() => { /* keep modal open to show success */ }} autoFocus />
        </div>
      </div>
    </div>,
    document.body,
  )
}
