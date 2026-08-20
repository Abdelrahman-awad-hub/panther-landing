'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Zap } from 'lucide-react'
import { LeadFormModal } from './LeadFormModal'
import { trackEvent } from '@/lib/analytics'

export function SellerCTA() {
  const t = useTranslations('sellerCta')
  const locale = useLocale()
  const [scrolledPastHero, setScrolledPastHero] = useState(false)
  const [formInView, setFormInView] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Show the pill once the user scrolls ~0.6 of a viewport down.
  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.6)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hide the pill while the real form section is on screen (avoids redundancy).
  useEffect(() => {
    const section = document.getElementById('join')
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { rootMargin: '0px 0px -20% 0px' },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const openModal = () => {
    setModalOpen(true)
    trackEvent('cta_click', {
      cta_name: 'join_now',
      cta_location: 'floating_seller',
      language: locale,
    })
  }

  const closeModal = () => {
    setModalOpen(false)
    // Return focus to the pill for keyboard users.
    triggerRef.current?.focus()
  }

  const visible = scrolledPastHero && !formInView

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        aria-label={t('pill')}
        className={[
          'group fixed bottom-6 start-6 z-50 flex items-center gap-2',
          'rounded-full bg-panther-red text-white shadow-xl btn-red-glow',
          'h-12 sm:h-14 ps-4 pe-5 sm:ps-5 sm:pe-6',
          'font-bold text-sm tracking-wide',
          'transition-all duration-300 ease-out',
          'hover:scale-105 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-panther-black',
          'motion-reduce:transition-none',
          visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-6 opacity-0',
        ].join(' ')}
      >
        {/* Pulsing attention ring */}
        {visible && (
          <span
            className="absolute inset-0 rounded-full bg-panther-red opacity-50 motion-safe:animate-ping motion-reduce:hidden"
            aria-hidden="true"
          />
        )}
        <Zap className="relative h-4 w-4 sm:h-5 sm:w-5 shrink-0" fill="currentColor" aria-hidden="true" />
        <span className="relative hidden sm:inline">{t('pill')}</span>
        <span className="relative sm:hidden">{t('pillShort')}</span>
      </button>

      <LeadFormModal open={modalOpen} onClose={closeModal} />
    </>
  )
}
